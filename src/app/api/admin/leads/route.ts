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
            return NextResponse.json({ leads: [], agents: [] })
        }

        const orgId = profile.org_id

        const url = new URL(request.url)
        const page = parseInt(url.searchParams.get('page') || '1')
        const limit = parseInt(url.searchParams.get('limit') || '20')
        const search = url.searchParams.get('search') || ''
        const filterStatus = url.searchParams.get('status') || 'all'

        const from = (page - 1) * limit
        const to = from + limit - 1

        // 1. Fetch Agents
        const { data: agents } = await supabase
            .from("profiles")
            .select("id, full_name, avatar_url")
            .eq("org_id", orgId)
            .eq("role", "agent")
            .eq("status", "active")

        // 2. Fetch Leads with filtering and pagination
        let query = supabase
            .from("leads")
            .select("*, profiles:assigned_agent_id(id, full_name, avatar_url)", { count: 'exact' })
            .eq("org_id", orgId)

        if (search) {
            query = query.ilike('name', `%${search}%`)
        }

        if (filterStatus && filterStatus !== 'all') {
            query = query.eq('status', filterStatus)
        }

        const { data: leads, count, error } = await query
            .order("created_at", { ascending: false })
            .range(from, to)

        if (error) throw error

        return NextResponse.json({
            leads: leads || [],
            agents: agents || [],
            pagination: {
                total: count || 0,
                page,
                limit,
                totalPages: Math.ceil((count || 0) / limit)
            }
        })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const payload = await request.json()
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

        if (!profile || profile.role !== "admin" || !profile.org_id) {
            return NextResponse.json({ error: "Forbidden: Admin access and organization required" }, { status: 403 })
        }

        const orgId = profile.org_id

        const { data, error } = await supabase
            .from("leads")
            .insert([{ ...payload, org_id: orgId }])
            .select("*, profiles:assigned_agent_id(id, full_name, avatar_url)")
            .single()

        if (error) throw error

        // Log activity
        await supabase.from("lead_activities").insert([{
            lead_id: data.id,
            activity_type: "custom",
            message: `Lead created from ${payload.source}`,
            metadata: { detail: `Manual entry via Admin Dashboard` },
            agent_id: null
        }])

        return NextResponse.json(data)
    } catch (err: any) {
        console.error("[POST /api/admin/leads] Error:", err.message, err.details || '');
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

export async function PATCH(request: Request) {
    try {
        const { id, ...updates } = await request.json()
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

        if (!profile || profile.role !== "admin" || !profile.org_id) {
            return NextResponse.json({ error: "Forbidden: Admin access and organization required" }, { status: 403 })
        }

        const orgId = profile.org_id

        const { data, error } = await supabase
            .from("leads")
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq("id", id)
            .eq("org_id", orgId) // Ensure they only edit leads in their org
            .select("*, profiles:assigned_agent_id(id, full_name, avatar_url)")
            .single()

        if (error) throw error
        return NextResponse.json(data)
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

// Custom sweep action via PUT (just a convention)
export async function PUT(request: Request) {
    try {
        const { sweep } = await request.json()
        if (!sweep) return NextResponse.json({ error: "Invalid action" }, { status: 400 })

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

        if (!profile || profile.role !== "admin" || !profile.org_id) {
            return NextResponse.json({ error: "Forbidden: Admin access and organization required" }, { status: 403 })
        }

        const orgId = profile.org_id
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()

        // Find leads to sweep
        const { data: stales } = await supabase
            .from("leads")
            .select("id, profiles:assigned_agent_id(full_name)")
            .eq("org_id", orgId)
            .eq("status", "new")
            .not("assigned_agent_id", "is", null)
            .lt("created_at", twoHoursAgo)

        if (!stales || stales.length === 0) {
            return NextResponse.json({ success: true, count: 0 })
        }

        const staleIds = stales.map(l => l.id)

        // Update DB
        const { error } = await supabase
            .from("leads")
            .update({ assigned_agent_id: null, updated_at: new Date().toISOString() })
            .in("id", staleIds)

        if (error) throw error

        // Log activity
        const activities = staleIds.map(id => ({
            lead_id: id,
            activity_type: "transfer",
            message: "Auto-Transferred to Admin Pool",
            metadata: { detail: "Lead was inactive for 2+ hours" },
            agent_id: null
        }))
        await supabase.from("lead_activities").insert(activities)

        return NextResponse.json({ success: true, count: stales.length, ids: staleIds })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
