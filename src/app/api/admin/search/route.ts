import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const query = searchParams.get('q')
        if (!query || query.length < 2) return NextResponse.json([])

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

        if (!profile?.org_id) return NextResponse.json([])

        const orgId = profile.org_id

        // Parallel search across Leads, Properties, and Agents
        const [
            { data: leads },
            { data: properties },
            { data: agents }
        ] = await Promise.all([
            supabase.from("leads").select("id, name").eq("org_id", orgId).ilike('name', `%${query}%`).limit(5),
            supabase.from("properties").select("id, title").eq("org_id", orgId).ilike('title', `%${query}%`).limit(5),
            supabase.from("profiles").select("id, full_name").eq("org_id", orgId).eq('role', 'agent').ilike('full_name', `%${query}%`).limit(5)
        ])

        const results = [
            ...(leads?.map(l => ({ id: l.id, title: l.name, type: 'Lead', href: `/admin/leads/${l.id}` })) || []),
            ...(properties?.map(p => ({ id: p.id, title: p.title, type: 'Property', href: `/admin/sell/${p.id}` })) || []), // Assuming sell for now
            ...(agents?.map(a => ({ id: a.id, title: a.full_name, type: 'Agent', href: `/admin/agents/${a.id}` })) || [])
        ]

        return NextResponse.json(results)
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
