import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const currentMonthString = new Date().toISOString().slice(0, 7) // YYYY-MM

        // Fetch attendance for the logged-in agent for the current month
        const { data, error } = await supabase
            .from("attendance")
            .select("*")
            .eq("agent_id", user.id)
            .like("attendance_date::text", `${currentMonthString}%`)
            .order("attendance_date", { ascending: false })

        if (error) throw error

        return NextResponse.json(data || [])
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
