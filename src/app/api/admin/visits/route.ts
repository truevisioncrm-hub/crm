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
            return NextResponse.json({ agents: [], leads: [], visits: [] })
        }

        const orgId = profile.org_id

        const [agentsRes, leadsRes, visitsRes] = await Promise.all([
            supabase.from("profiles").select("id, full_name, avatar_url").eq("org_id", orgId).eq("role", "agent").eq("status", "active"),
            supabase.from("leads").select("id, name, phone, area_interest, property_type").eq("org_id", orgId).order("name"),
            supabase.from("visits").select("*, profiles:agent_id(id, full_name, avatar_url), leads(id, name, phone, area_interest, property_type)").eq("org_id", orgId).order("scheduled_at", { ascending: true })
        ])

        return NextResponse.json({
            agents: agentsRes.data || [],
            leads: leadsRes.data || [],
            visits: visitsRes.data || []
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
            .from("visits")
            .insert([{ ...payload, org_id: orgId }])
            .select("*, profiles:agent_id(id, full_name, avatar_url), leads(id, name, phone, area_interest, property_type)")
            .single()

        if (error) throw error
        return NextResponse.json(data)
    } catch (err: any) {
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
            .from("visits")
            .update({ ...updates })
            .eq("id", id)
            .eq("org_id", orgId) // Ensure they only edit visits in their org
            .select("*, profiles:agent_id(id, full_name, avatar_url), leads(id, name, phone, area_interest, property_type)")
            .single()

        if (error) throw error
        return NextResponse.json(data)
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
