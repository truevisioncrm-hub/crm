import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: leadId } = await params
        const supabase = await createClient()

        // Auth check
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // 1. Fetch Lead
        const { data: leadData, error: leadError } = await supabase
            .from("leads")
            .select("*, profiles:assigned_agent_id(id, full_name, avatar_url)")
            .eq("id", leadId)
            .single()

        if (leadError) throw leadError

        // 2. Fetch Matching Properties
        const areaQ = leadData.area_interest ? leadData.area_interest.split(',')[0].trim() : ""
        const typeQ = leadData.property_type ? leadData.property_type.trim() : ""

        let query = supabase.from("properties").select("*").eq("status", "available").limit(3)

        if (areaQ || typeQ) {
            const orConditions = []
            if (areaQ) orConditions.push(`location.ilike.%${areaQ}%`)
            if (typeQ) orConditions.push(`title.ilike.%${typeQ}%`)
            if (orConditions.length > 0) {
                query = query.or(orConditions.join(','))
            }
        }
        const { data: properties } = await query

        // 3. Fetch Activity Timeline
        const { data: activities } = await supabase
            .from("lead_activities")
            .select("*, profiles:agent_id(id, full_name, avatar_url)")
            .eq("lead_id", leadId)
            .order("created_at", { ascending: false })

        return NextResponse.json({
            lead: leadData,
            properties: properties || [],
            activities: activities || []
        })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: leadId } = await params
        const { note } = await request.json()
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { data, error } = await supabase
            .from("lead_activities")
            .insert([{
                lead_id: leadId,
                activity_type: "note",
                message: note.trim(),
                metadata: { detail: "Note added via lead detail page" },
                agent_id: user.id
            }])
            .select("*, profiles:agent_id(id, full_name, avatar_url)")
            .single()

        if (error) throw error
        return NextResponse.json(data)
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
