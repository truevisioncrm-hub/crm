import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const type = searchParams.get('type') // 'Sell' or 'Rent'
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

        if (!profile?.org_id) {
            return NextResponse.json([])
        }

        let query = supabase
            .from("properties")
            .select("*")
            .eq("org_id", profile.org_id)
            .order("created_at", { ascending: false })

        if (type) query = query.contains("features", { listing_type: type })

        const { data, error } = await query
        if (error) throw error

        const formattedData = (data || []).map(p => ({
            ...p,
            type: p.features?.listing_type || 'Sell'
        }))

        return NextResponse.json(formattedData)
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const payload = await request.json()
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

        if (!profile?.org_id) {
            return NextResponse.json({ error: "No organization assigned" }, { status: 400 })
        }

        // The 'type' field (Sell/Rent) is stored inside features JSON
        const { type, ...dbPayload } = payload
        const features = dbPayload.features || {}
        if (type) {
            features.listing_type = type
        }

        const { data, error } = await supabase
            .from("properties")
            .insert([{ ...dbPayload, features, org_id: profile.org_id }])
            .select()
            .single()

        if (error) throw error
        return NextResponse.json({ ...data, type: data.features?.listing_type || 'Sell' })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
