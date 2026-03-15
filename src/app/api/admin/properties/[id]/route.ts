import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
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
            return NextResponse.json({ error: "Forbidden: No organization assigned" }, { status: 403 })
        }

        const { data, error } = await supabase
            .from("properties")
            .select("*")
            .eq("id", id)
            .eq("org_id", profile.org_id)
            .single()

        if (error) throw error
        if (!data) return NextResponse.json({ error: "Property not found" }, { status: 404 })

        return NextResponse.json({
            ...data,
            type: data.features?.listing_type || 'Sell'
        })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const payload = await request.json()
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

        // Strip type if it exists in payload as it's not a real column
        const { type, ...dbPayload } = payload

        const { data, error } = await supabase
            .from("properties")
            .update({ ...dbPayload, updated_at: new Date().toISOString() })
            .eq("id", id)
            .eq("org_id", profile.org_id)
            .select()
            .single()

        if (error) throw error
        return NextResponse.json({
            ...data,
            type: data.features?.listing_type || 'Sell'
        })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
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

        const { error } = await supabase
            .from("properties")
            .delete()
            .eq("id", id)
            .eq("org_id", profile.org_id)

        if (error) throw error
        return NextResponse.json({ success: true })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
