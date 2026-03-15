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
            return NextResponse.json({ employees: [], attendance: [] })
        }

        const orgId = profile.org_id
        const currentMonthString = new Date().toISOString().slice(0, 7) // YYYY-MM

        // 1. Fetch Agents in this org
        const { data: agentsData, error: agentsError } = await supabase
            .from("profiles")
            .select("id, full_name, role, avatar_url")
            .eq("org_id", orgId)
            .eq("role", "agent")
            .eq("status", "active")

        if (agentsError) throw agentsError

        // 2. Fetch Attendance for this month
        const { data: attendanceData, error: attendanceError } = await supabase
            .from("attendance")
            .select("*")
            .eq("org_id", orgId)
            .like("attendance_date::text", `${currentMonthString}%`)

        if (attendanceError) throw attendanceError

        return NextResponse.json({
            employees: agentsData || [],
            attendance: attendanceData || []
        })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
