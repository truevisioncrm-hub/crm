import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const type = searchParams.get('type') // 'Sell' or 'Rent'
        const supabase = await createClient()

        // Auth check
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { data: profile } = await supabase
            .from("profiles")
            .select("org_id")
            .eq("id", user.id)
            .single()

        if (!profile?.org_id) {
            return NextResponse.json([])
        }

        let query = supabase
            .from("properties")
            .select("*")
            .eq("org_id", profile.org_id)
            .order("created_at", { ascending: false })

        if (type) query = query.contains("features", { listing_type: type })

        const { data, error } = await query
        if (error) throw error

        const formattedData = (data || []).map(p => ({
            ...p,
            type: p.features?.listing_type || 'Sell'
        }))

        return NextResponse.json(formattedData)
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const supabase = await createClient()

        // Auth check
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { data: profile } = await supabase
            .from("profiles")
            .select("org_id")
            .eq("id", user.id)
            .single()

        if (!profile?.org_id) {
            return NextResponse.json({ error: "No organization assigned" }, { status: 400 })
        }

        // The 'type' field (Sell/Rent) is stored inside features JSON
        const {
            title, location, price, type, bedrooms, bathrooms, area_sqft, status, description, property_type,
            completion_status, furnished, bua_sqft, payment_plan,
            // New wizard fields
            developer, total_floors, floor_no, plot_size_sqft, build_year,
            occupancy, availability_date, parking, unit_no, source_of_listing,
            service_charge, ac_charge, video_url, view360_url, portals, images,
            owner_name, owner_email, owner_phone, owner_nationality,
        } = body;

        // Basic validation
        if (!location || !price || !type) {
            return NextResponse.json({ error: "Missing required fields: location, price, type" }, { status: 400 })
        }

        const features = body.features || {}
        if (type) {
            features.listing_type = type
        }

        const { data, error } = await supabase
            .from("properties")
            .insert([{
                title: title || null,
                location,
                price,
                bedrooms: bedrooms || null,
                bathrooms: bathrooms || null,
                area_sqft: area_sqft || null,
                org_id: profile.org_id,
                features,
                status: status || 'available',
                description: description || null,
                property_type: property_type || null,
                completion_status: completion_status || null,
                furnished: furnished || null,
                bua_sqft: bua_sqft || null,
                payment_plan: payment_plan || null,
                // New fields
                developer: developer || null,
                total_floors: total_floors || null,
                floor_no: floor_no || null,
                plot_size_sqft: plot_size_sqft || null,
                build_year: build_year || null,
                occupancy: occupancy || null,
                availability_date: availability_date || null,
                parking: parking || null,
                unit_no: unit_no || null,
                source_of_listing: source_of_listing || null,
                service_charge: service_charge || null,
                ac_charge: ac_charge || null,
                video_url: video_url || null,
                view360_url: view360_url || null,
                portals: portals || {},
                images: images || [],
                owner_name: owner_name || null,
                owner_email: owner_email || null,
                owner_phone: owner_phone || null,
                owner_nationality: owner_nationality || null,
            }])
            .select()
            .single()

        if (error) throw error
        return NextResponse.json({ ...data, type: data.features?.listing_type || 'Sell' })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
