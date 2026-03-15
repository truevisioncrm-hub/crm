import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
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

        if (!profile || profile.role !== "admin") {
            return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 })
        }

        if (!profile.org_id) {
            return NextResponse.json([])
        }

        const { data, error } = await supabase
            .from("profiles")
            .select("id, full_name, role, avatar_url, updated_at, deactivated_at")
            .eq("org_id", profile.org_id)
            .in("status", ["inactive", "exited"])
            .order("updated_at", { ascending: false })

        if (error) throw error
        return NextResponse.json(data || [])
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

export async function PATCH(request: Request) {
    try {
        const { id, status } = await request.json()
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

        if (!profile || profile.role !== "admin") {
            return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 })
        }

        // Validate status value
        const validStatuses = ["active", "inactive", "exited"]
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: "Invalid status value" }, { status: 400 })
        }

        const updateData: Record<string, any> = {
            status,
            updated_at: new Date().toISOString()
        }

        // Set deactivated_at if deactivating, clear if reactivating
        if (status === "inactive" || status === "exited") {
            updateData.deactivated_at = new Date().toISOString()
        } else if (status === "active") {
            updateData.deactivated_at = null
        }

        const { error } = await supabase
            .from("profiles")
            .update(updateData)
            .eq("id", id)
            .eq("org_id", profile.org_id)

        if (error) throw error
        return NextResponse.json({ success: true })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
