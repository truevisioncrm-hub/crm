import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { data, error } = await supabase
            .from("leads")
            .select("*")
            .eq("assigned_agent_id", user.id)
            .order("created_at", { ascending: false })

        if (error) throw error
        return NextResponse.json(data || [])
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const payload = await request.json()
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Get agent's org_id
        const { data: profile } = await supabase
            .from("profiles")
            .select("org_id")
            .eq("id", user.id)
            .single()

        if (!profile?.org_id) {
            return NextResponse.json({ error: "No organization assigned" }, { status: 400 })
        }

        // Force assigned_agent_id + org_id to current user's values
        const { data, error } = await supabase
            .from("leads")
            .insert([{ ...payload, assigned_agent_id: user.id, org_id: profile.org_id }])
            .select()
            .single()

        if (error) throw error

        // Log activity
        await supabase.from("lead_activities").insert([{
            lead_id: data.id,
            activity_type: "custom",
            message: `Lead created from ${payload.source}`,
            metadata: { detail: "Manual entry by Agent" },
            agent_id: user.id
        }])

        return NextResponse.json(data)
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
