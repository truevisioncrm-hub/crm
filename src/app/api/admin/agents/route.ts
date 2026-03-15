import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    try {
        const supabase = await createClient()

        // Securely get the user session
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Fetch the user's org_id from their profile
        const { data: profile } = await supabase
            .from("profiles")
            .select("org_id, role")
            .eq("id", user.id)
            .single()

        if (!profile || profile.role !== "admin") {
            return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 })
        }

        if (!profile.org_id) {
            // If they don't have an org_id yet, they simply have no agents
            return NextResponse.json([])
        }

        const orgId = profile.org_id

        const { data: agents, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("org_id", orgId)
            .eq("role", "agent")
            .order("created_at", { ascending: false })

        if (error) throw error

        // Fetch all leads for this organization to build aggregated stats per agent
        const { data: leads, error: leadsError } = await supabase
            .from("leads")
            .select("assigned_agent_id, status")
            .eq("org_id", orgId);

        if (leadsError) throw leadsError;

        // Attach leads_count and deals_won to every agent
        const agentsWithStats = (agents || []).map(agent => {
            const agentLeads = (leads || []).filter(l => l.assigned_agent_id === agent.id);
            const dealsWon = agentLeads.filter(l => l.status === 'closed_won').length;

            return {
                ...agent,
                leads_count: agentLeads.length,
                deals_won: dealsWon
            };
        });

        return NextResponse.json(agentsWithStats)
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const { full_name, email, phone } = await request.json()
        const supabase = await createClient()

        // Securely get the user session
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Fetch the user's org_id from their profile
        const { data: profile } = await supabase
            .from("profiles")
            .select("org_id, role")
            .eq("id", user.id)
            .single()

        if (!profile || profile.role !== "admin") {
            return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 })
        }

        if (!profile.org_id) {
            return NextResponse.json({ error: "No organization assigned to admin" }, { status: 400 })
        }

        const org_id = profile.org_id

        const { data, error } = await supabase
            .from("profiles")
            .insert({
                id: crypto.randomUUID(), // This will likely be overwritten by Auth, but for profile creation
                org_id,
                full_name,
                email,
                phone,
                role: "agent",
                status: "active"
            })
            .select()
            .single()

        if (error) throw error
        return NextResponse.json(data)
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

export async function PATCH(request: Request) {
    try {
        const { id, status } = await request.json()
        const supabase = await createClient()

        // Securely get the user session
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Fetch the user's org_id from their profile
        const { data: profile } = await supabase
            .from("profiles")
            .select("org_id, role")
            .eq("id", user.id)
            .single()

        if (!profile || profile.role !== "admin") {
            return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 })
        }

        // Optional: Ensure the agent to be updated belongs to the admin's organization
        const { data: agentProfile } = await supabase
            .from("profiles")
            .select("org_id")
            .eq("id", id)
            .single()

        if (!agentProfile || agentProfile.org_id !== profile.org_id) {
            return NextResponse.json({ error: "Agent not found in your organization" }, { status: 404 })
        }

        // 1. Update status
        const { error } = await supabase
            .from("profiles")
            .update({ status })
            .eq("id", id)

        if (error) throw error

        // 2. If deactivating, reassign leads
        if (status === "inactive" || status === "exited") {
            const activeStatuses = ['new', 'contacted', 'meeting_scheduled', 'site_visit', 'negotiation', 'documentation']

            const { data: affectedLeads } = await supabase
                .from("leads")
                .select("id")
                .eq("assigned_agent_id", id)
                .in("status", activeStatuses)

            if (affectedLeads && affectedLeads.length > 0) {
                await supabase
                    .from("leads")
                    .update({ assigned_agent_id: null, updated_at: new Date().toISOString() })
                    .eq("assigned_agent_id", id)
                    .in("status", activeStatuses)

                const activities = affectedLeads.map(l => ({
                    lead_id: l.id,
                    activity_type: "transfer",
                    message: "Auto-Transferred on Agent Exit",
                    metadata: { detail: `Agent was marked ${status}. Lead returned to Admin pool.` },
                    agent_id: null
                }))
                await supabase.from("lead_activities").insert(activities)
            }
        }

        return NextResponse.json({ success: true })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
