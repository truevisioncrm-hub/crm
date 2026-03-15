import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: agentId } = await params
        const supabase = await createClient()

        // Auth check
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { data: adminProfile } = await supabase
            .from("profiles")
            .select("org_id, role")
            .eq("id", user.id)
            .single()

        if (!adminProfile || adminProfile.role !== "admin") {
            return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 })
        }

        // 1. Fetch Agent Profile
        const { data: agent, error: agentError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", agentId)
            .eq("org_id", adminProfile.org_id)
            .single()

        if (agentError) throw agentError

        // 2. Fetch Assigned Leads
        const { data: leads } = await supabase
            .from("leads")
            .select("*")
            .eq("assigned_agent_id", agentId)
            .order("updated_at", { ascending: false })

        // 3. Fetch Recent Activity
        const { data: activities } = await supabase
            .from("lead_activities")
            .select("*")
            .eq("agent_id", agentId)
            .order("created_at", { ascending: false })
            .limit(10)

        // 4. Fetch Attendance for today's status
        const today = new Date().toISOString().split('T')[0]
        const { data: attendance } = await supabase
            .from("attendance")
            .select("status")
            .eq("agent_id", agentId)
            .eq("attendance_date", today)
            .single()

        return NextResponse.json({
            agent: {
                ...agent,
                liveStatus: attendance?.status || (agent.status === 'active' ? "Offline" : "Inactive")
            },
            leads: leads || [],
            activities: activities || []
        })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
