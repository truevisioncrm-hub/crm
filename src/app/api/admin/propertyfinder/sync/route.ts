import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getPFListings, getPFLeads, normalizePFListing, normalizePFLead } from '@/lib/propertyfinder';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();

        // Auth check
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('org_id, role')
            .eq('id', user.id)
            .single();

        if (!profile || profile.role !== 'admin' || !profile.org_id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const syncType = body.type || 'all'; // 'listings' | 'leads' | 'all'
        const results: any = { listings: null, leads: null };

        // ─── Sync Listings ──────────────────────────────────────
        if (syncType === 'listings' || syncType === 'all') {
            try {
                const pfListings = await getPFListings({ perPage: '100' });

                // Get already synced PF listing IDs to avoid duplicates
                const { data: existing } = await supabase
                    .from('properties')
                    .select('pf_listing_id')
                    .eq('org_id', profile.org_id)
                    .not('pf_listing_id', 'is', null);

                const existingIds = new Set((existing || []).map(e => e.pf_listing_id));

                const newListings = pfListings.results
                    .filter(l => !existingIds.has(l.id))
                    .map(l => {
                        const normalized = normalizePFListing(l);
                        // image_url from PF goes into both image_url (convenience) and images[] (schema)
                        return {
                            ...normalized,
                            images: normalized.image_url ? [normalized.image_url] : [],
                            org_id: profile.org_id,
                        };
                    });

                if (newListings.length > 0) {
                    const { data, error } = await supabase
                        .from('properties')
                        .insert(newListings)
                        .select();

                    if (error) {
                        console.error('[PF Sync] Listing insert error:', error);
                        results.listings = { error: error.message, count: 0 };
                    } else {
                        results.listings = { count: data?.length || 0, synced: true };
                    }
                } else {
                    results.listings = { count: 0, message: 'All listings already synced' };
                }
            } catch (err: any) {
                console.error('[PF Sync] listings error:', err.message);
                results.listings = { error: err.message, count: 0 };
            }
        }

        // ─── Sync Leads ─────────────────────────────────────────
        if (syncType === 'leads' || syncType === 'all') {
            try {
                const pfLeads = await getPFLeads();

                // Get already synced PF lead IDs to avoid duplicates
                const { data: existing } = await supabase
                    .from('leads')
                    .select('pf_lead_id')
                    .eq('org_id', profile.org_id)
                    .not('pf_lead_id', 'is', null);

                const existingIds = new Set((existing || []).map(e => e.pf_lead_id));

                const newLeads = pfLeads.data
                    .filter(l => !existingIds.has(l.id))
                    .map(l => ({
                        ...normalizePFLead(l),
                        org_id: profile.org_id,
                    }));

                if (newLeads.length > 0) {
                    const { data, error } = await supabase
                        .from('leads')
                        .insert(newLeads)
                        .select();

                    if (error) {
                        console.error('[PF Sync] Lead insert error:', error);
                        results.leads = { error: error.message, count: 0 };
                    } else {
                        results.leads = { count: data?.length || 0, synced: true };

                        // Log activity for each synced lead
                        const activities = (data || []).map((lead: any) => ({
                            lead_id: lead.id,
                            activity_type: 'custom',
                            message: `Lead imported from Property Finder (${lead.pf_channel || 'unknown'})`,
                            metadata: { detail: 'Auto-synced via PF API' },
                            agent_id: null,
                        }));

                        if (activities.length > 0) {
                            const { error: actErr } = await supabase.from('lead_activities').insert(activities);
                            if (actErr) console.error('[PF Sync] Activity insert error:', actErr.message);
                        }
                    }
                } else {
                    results.leads = { count: 0, message: 'All leads already synced' };
                }
            } catch (err: any) {
                console.error('[PF Sync] leads error:', err.message);
                results.leads = { error: err.message, count: 0 };
            }
        }

        return NextResponse.json({ success: true, results });
    } catch (err: any) {
        console.error('[PF Sync API]', err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
