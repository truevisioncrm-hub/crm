import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { createPFListing, searchPFLocations } from '@/lib/propertyfinder';

const PROPERTY_TYPE_MAP: Record<string, string> = {
    '1bhk': 'apartment',
    '2bhk': 'apartment',
    '3bhk': 'apartment',
    '4bhk': 'apartment',
    'apartment': 'apartment',
    'villa': 'villa',
    'townhouse': 'townhouse',
    'penthouse': 'penthouse',
    'plot': 'commercial-plot',
    'commercial': 'office',
    'office': 'office',
    'shop': 'shop',
    'studio': 'apartment',
};

export async function POST(request: Request) {
    try {
        const supabase = await createClient();

        // 1. Auth check
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data: profile } = await supabase
            .from("profiles")
            .select("org_id, role")
            .eq("id", user.id)
            .single();

        if (!profile || profile.role !== 'admin' || !profile.org_id) {
            return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
        }

        // 2. Parse request body
        const { propertyId } = await request.json();
        if (!propertyId) {
            return NextResponse.json({ error: "propertyId is required" }, { status: 400 });
        }

        // 3. Fetch Local Property from Supabase
        const { data: property, error: propError } = await supabase
            .from("properties")
            .select("*")
            .eq("id", propertyId)
            .eq("org_id", profile.org_id)
            .single();

        if (propError || !property) {
            return NextResponse.json({ error: "Property not found in local database" }, { status: 404 });
        }

        // 4. Map Location String to PF Location ID
        let pfLocationId = null;
        if (property.location) {
            const locRes = await searchPFLocations(property.location);
            if (locRes && locRes.data && locRes.data.length > 0) {
                pfLocationId = locRes.data[0].id;
            }
        }

        if (!pfLocationId) {
            return NextResponse.json({
                error: `Could not map local location "${property.location}" to a Property Finder location ID. Try adjusting the location name.`
            }, { status: 400 });
        }

        // 5. Construct PF Payload
        // Extract listing_type ('Sell' or 'Rent') from the features JSON column
        const listingType = property.features?.listing_type || 'Sell';
        const offeringType = listingType.toLowerCase() === 'rent' ? 'rent' : 'sale';
        const priceType = offeringType === 'rent' ? 'yearly' : 'sale';

        // Match our DB property_type to PF property types
        const pfPropertyType = PROPERTY_TYPE_MAP[property.property_type?.toLowerCase()] || 'apartment';
        const category = ['office', 'shop', 'commercial-plot'].includes(pfPropertyType) ? 'commercial' : 'residential';

        // Parse numeric price — property.price can be a number or numeric string
        const priceNum = parseFloat(String(property.price)) || 0;

        // Bedroom/bathroom mapping — PF uses string values; studio = "0"
        const bedroomsStr = property.bedrooms != null
            ? String(property.bedrooms)
            : (property.property_type === 'studio' ? '0' : '1');
        const bathroomsStr = property.bathrooms != null
            ? String(property.bathrooms)
            : '1';

        // Map completing status correctly to PF spec
        let pfCompletionStatus = undefined;
        if (property.completion_status) {
            pfCompletionStatus = property.completion_status.toLowerCase() === 'off-plan' ? 'off_plan' : 'completed';
        }

        // Map furnished status correctly to PF spec
        let pfFurnished = undefined;
        if (property.furnished) {
            pfFurnished = property.furnished.toLowerCase();
            if (pfFurnished === 'partly furnished') pfFurnished = 'partly';
        }

        const pfPayload: any = {
            title: { en: property.title || `${property.property_type} in ${property.location}` },
            description: { en: property.description || "No description provided." },
            price: {
                type: priceType,
                amounts: {}
            },
            category: category,
            propertyType: pfPropertyType,
            offeringType: offeringType,
            bedrooms: bedroomsStr,
            bathrooms: bathroomsStr,
            size: property.bua_sqft ? Number(property.bua_sqft) : (property.area_sqft ? Number(property.area_sqft) : 0),
            location: { id: pfLocationId },
            reference: `TV-${property.id.substring(0, 8).toUpperCase()}`,
            availableFrom: new Date().toISOString().split('T')[0]
        };

        if (pfCompletionStatus) pfPayload.completionStatus = pfCompletionStatus;
        if (pfFurnished) pfPayload.furnished = pfFurnished;

        if (offeringType === 'rent') {
            pfPayload.price.amounts.yearly = priceNum;
        } else {
            pfPayload.price.amounts.sale = priceNum;
        }

        // Add images if available — schema stores as images[] array, image_url is the first image
        const firstImage = property.image_url || (Array.isArray(property.images) ? property.images[0] : null);
        if (firstImage) {
            pfPayload.media = {
                images: [{ original: { url: firstImage } }]
            };
        }

        // 6. Push to Property Finder API
        try {
            const pfRes = await createPFListing(pfPayload);

            // 7. Update local property with PF Listing ID
            if (pfRes && pfRes.data && pfRes.data.id) {
                await supabase
                    .from("properties")
                    .update({
                        pf_listing_id: pfRes.data.id,
                        pf_reference: pfPayload.reference,
                        updated_at: new Date().toISOString()
                    })
                    .eq("id", propertyId);

                return NextResponse.json({
                    success: true,
                    message: "Successfully published to Property Finder!",
                    pf_listing_id: pfRes.data.id
                });
            } else {
                return NextResponse.json({ error: "Failed to create listing on Property Finder: Invalid response" }, { status: 500 });
            }

        } catch (pfErr: any) {
            console.error("PF Publish Error:", pfErr.message);
            // Return 403 explicitly if it's a scope error so the frontend can show a custom msg
            const isForbidden = pfErr.message.includes('403');
            return NextResponse.json({
                error: isForbidden
                    ? "Your API Key lacks 'listings:full_access' permission. Contact Property Finder support to enable listing publishing."
                    : pfErr.message
            }, { status: isForbidden ? 403 : 500 });
        }

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
