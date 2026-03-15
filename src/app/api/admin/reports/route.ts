import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    try {
        const supabase = await createClient()

        // Auth check
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { data: profile } = await supabase
            .from("profiles")
            .select("org_id, role")
            .eq("id", user.id)
            .single()

        if (!profile || profile.role !== 'admin' || !profile.org_id) {
            return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 })
        }

        const orgId = profile.org_id

        // 1. Fetch KPI Stats
        const [
            { count: totalLeads },
            { count: wonLeads },
            { count: activeAgents },
            { data: leadsData }
        ] = await Promise.all([
            supabase.from("leads").select("*", { count: 'exact', head: true }).eq("org_id", orgId),
            supabase.from("leads").select("*", { count: 'exact', head: true }).eq("org_id", orgId).eq("status", "closed_won"),
            supabase.from("profiles").select("*", { count: 'exact', head: true }).eq("org_id", orgId).eq("role", "agent").eq("status", "active"),
            supabase.from("leads").select("status, source, property_type, budget_max").eq("org_id", orgId)
        ])

        // 2. Process Funnel & Sources
        const funnelMap: Record<string, number> = {
            "new": 0, "contacted": 0, "meeting_scheduled": 0, "site_visit": 0, "negotiation": 0, "documentation": 0, "closed_won": 0
        }
        const sourceMap: Record<string, number> = {}
        const propertyTypeMap: Record<string, number> = {}
        let totalRevenue = 0

        leadsData?.forEach(l => {
            if (funnelMap[l.status] !== undefined) funnelMap[l.status]++
            if (l.source) sourceMap[l.source] = (sourceMap[l.source] || 0) + 1
            if (l.property_type) propertyTypeMap[l.property_type] = (propertyTypeMap[l.property_type] || 0) + 1
            if (l.status === 'closed_won') totalRevenue += (Number(l.budget_max) || 0)
        })

        const funnel = Object.entries(funnelMap).map(([stage, count]) => ({ stage, count }))
        const sources = Object.entries(sourceMap).map(([name, value]) => ({ name, value }))
        const propertyDemand = Object.entries(propertyTypeMap).map(([name, value]) => ({ name, value }))

        return NextResponse.json({
            kpis: {
                totalLeads: totalLeads || 0,
                closedWon: wonLeads || 0,
                activeAgents: activeAgents || 0,
                revenue: totalRevenue
            },
            funnel,
            sources,
            propertyDemand
        })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
