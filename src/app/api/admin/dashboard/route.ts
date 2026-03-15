import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    try {
        const supabase = await createClient()

        // Secure Server-Side Session Verification
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('org_id, role')
            .eq('id', user.id)
            .single()

        if (!profile || profile.role !== 'admin') {
            return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 })
        }

        if (!profile.org_id) {
            return NextResponse.json({ agentsCount: 0, leads: [], todayVisits: [] })
        }

        const orgId = profile.org_id;

        // 1. Total Agents
        const { count: agentsCount } = await supabase
            .from("profiles")
            .select("*", { count: 'exact', head: true })
            .eq("org_id", orgId)
            .eq("role", "agent")
            .eq("status", "active")

        // 2. Fetch Leads for Aggregation
        const { data: leads, error: leadsError } = await supabase
            .from("leads")
            .select("*, profiles:assigned_agent_id(full_name)")
            .eq("org_id", orgId)

        if (leadsError) throw leadsError

        // 3. Today's Visits
        const todayStr = new Date().toISOString().split('T')[0]
        const { data: visits, error: visitsError } = await supabase
            .from("visits")
            .select("*, profiles:agent_id(full_name)")
            .eq("org_id", orgId)
            .gte("scheduled_at", `${todayStr}T00:00:00Z`)
            .lte("scheduled_at", `${todayStr}T23:59:59Z`)
            .order("scheduled_at", { ascending: true })
            .limit(4)

        if (visitsError) throw visitsError

        return NextResponse.json({
            agentsCount: agentsCount || 0,
            leads: leads || [],
            todayVisits: visits || []
        })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
