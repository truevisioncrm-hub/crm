/**
 * Property Finder API Client
 * Server-side only — uses env vars for credentials.
 * Handles JWT token caching with auto-refresh.
 */

const PF_API_BASE = 'https://atlas.propertyfinder.com';

// ─── Token Cache ────────────────────────────────────────────
let cachedToken: string | null = null;
let tokenExpiresAt: number = 0;

async function getAccessToken(): Promise<string> {
    // Return cached token if still valid (with 2-min buffer)
    if (cachedToken && Date.now() < tokenExpiresAt - 120_000) {
        return cachedToken;
    }

    const apiKey = process.env.PROPERTYFINDER_API_KEY;
    const apiSecret = process.env.PROPERTYFINDER_API_SECRET;

    if (!apiKey || !apiSecret) {
        throw new Error('Property Finder API credentials not configured');
    }

    const res = await fetch(`${PF_API_BASE}/v1/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, apiSecret }),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(`PF Auth failed (${res.status}): ${err.detail || err.message || 'Unknown error'}`);
    }

    const data = await res.json();
    cachedToken = data.accessToken;
    tokenExpiresAt = Date.now() + (data.expiresIn || 1800) * 1000;

    return cachedToken!;
}

// ─── Generic Fetch Helper ───────────────────────────────────
interface FetchOptions {
    method?: string;
    params?: Record<string, string>;
    body?: any;
}

async function pfFetch<T = any>(path: string, options?: FetchOptions): Promise<T> {
    const token = await getAccessToken();

    const url = new URL(`${PF_API_BASE}${path}`);
    if (options?.params) {
        Object.entries(options.params).forEach(([k, v]) => {
            if (v) url.searchParams.set(k, v);
        });
    }

    const res = await fetch(url.toString(), {
        method: options?.method || 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: options?.body ? JSON.stringify(options.body) : undefined,
        // Next.js fetch caching: revalidate every 5 minutes (only for GET requests)
        next: (options?.method || 'GET') === 'GET' ? { revalidate: 300 } : undefined,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(`PF API ${path} failed (${res.status}): ${JSON.stringify(err)}`);
    }

    return res.json();
}

// ─── Types ──────────────────────────────────────────────────

export interface PFListing {
    id: string;
    reference: string;
    title: string | null;
    description: string | null;
    price: number;
    currency: string;
    bedrooms: string;
    bathrooms: string;
    size: number | null;
    sizeUnit: string | null;
    propertyType: string;
    offeringType: string; // "sale" or "rent"
    availableFrom: string | null;
    amenities: string[];
    images: Array<{ id: string; url: string; title: string | null }>;
    location: {
        name: string;
        path: string;
        pathNames: string[];
    } | null;
    assignedTo: {
        id: number;
        name: string;
        photos: { thumbnail: string } | null;
    } | null;
    status: string;
    createdAt: string;
    updatedAt: string;
    completionStatus: string | null;
    furnishing: string | null;
}

export interface PFListingsResponse {
    pagination: {
        page: number;
        perPage: number;
        total: number;
        totalPages: number;
        nextPage: number | null;
        prevPage: number | null;
    };
    results: PFListing[];
}

export interface PFLead {
    id: string;
    channel: string; // 'call' | 'whatsapp' | 'email' | 'sms'
    createdAt: string;
    entityType: string;
    listing: {
        id: string;
        reference: string;
    } | null;
    publicProfile: {
        id: number;
    } | null;
    sender: {
        contacts: Array<{ type: string; value: string }>;
    } | null;
    status: string;
    tags: string[] | null;
    call?: {
        recordFile: string;
        talkTime: number;
        waitTime: number;
    };
    responseLink: string | null;
}

export interface PFLeadsResponse {
    data: PFLead[];
}

export interface PFUser {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    createdAt: string;
    publicProfile: {
        id: number;
        name: string;
        email: string;
        phone: string;
        bio: { primary: string; secondary: string };
        imageVariants: any;
        isSuperAgent: boolean;
        linkedinAddress: string;
    } | null;
}

export interface PFUsersResponse {
    data: PFUser[];
}

// ─── API Methods ────────────────────────────────────────────

export async function getPFListings(params?: {
    page?: string;
    perPage?: string;
}): Promise<PFListingsResponse> {
    return pfFetch<PFListingsResponse>('/v1/listings', {
        params: {
            page: params?.page || '1',
            per_page: params?.perPage || '50',
        }
    });
}

export async function getPFLeads(): Promise<PFLeadsResponse> {
    return pfFetch<PFLeadsResponse>('/v1/leads');
}

export async function getPFUsers(): Promise<PFUsersResponse> {
    return pfFetch<PFUsersResponse>('/v1/users');
}

export async function searchPFLocations(query: string) {
    if (query.length < 2) return { data: [] };
    return pfFetch('/v1/locations', { params: { search: query } });
}

export async function createPFListing(payload: any): Promise<{ data: PFListing }> {
    return pfFetch<{ data: PFListing }>('/v1/listings', {
        method: 'POST',
        body: payload,
    });
}

// ─── Helpers ────────────────────────────────────────────────

/** Normalize a PF listing into our local property schema */
export function normalizePFListing(listing: PFListing) {
    const pfTypeMap: Record<string, string> = {
        'apartment': '2bhk',
        'villa': 'villa',
        'townhouse': 'villa',
        'penthouse': 'penthouse',
        'plot': 'plot',
        'commercial-plot': 'plot',
        'office': 'commercial',
        'shop': 'commercial',
        'studio': 'studio',
    };
    const mappedType = pfTypeMap[listing.propertyType?.toLowerCase()] || '2bhk';

    return {
        title: listing.title || `${listing.propertyType} in ${listing.location?.name || 'Unknown'}`,
        location: listing.location?.pathNames?.join(', ') || listing.location?.name || '',
        price: String(listing.price || 0),
        property_type: mappedType,
        beds: parseInt(listing.bedrooms) || 0,
        baths: parseInt(listing.bathrooms) || 0,
        area_sqft: listing.size || 0,
        status: 'Available',
        features: {
            ...(listing.amenities || []).reduce((acc: any, am: string) => ({ ...acc, [am]: true }), {}),
            listing_type: listing.offeringType === 'rent' ? 'Rent' : 'Sell'
        },
        pf_listing_id: listing.id,
        pf_reference: listing.reference,
        image_url: listing.images?.[0]?.url || null,
        description: listing.description || '',
    };
}

/** Normalize a PF lead into our local lead schema */
export function normalizePFLead(lead: PFLead) {
    const phone = lead.sender?.contacts?.find(c => c.type === 'phone')?.value
        || lead.sender?.contacts?.[0]?.value
        || '';

    // NOTE: 'propertyfinder' (no underscore) matches our updated DB constraint
    return {
        name: phone || `PF Lead (${lead.channel})`,
        phone,
        source: 'propertyfinder' as const,
        status: 'new' as const,
        pf_lead_id: lead.id,
        pf_channel: lead.channel,
        created_at: lead.createdAt,
    };
}
