import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const today = new Date().toISOString().split('T')[0]

        // 1. Get today's attendance
        const { data: attendance, error: attendanceError } = await supabase
            .from('attendance')
            .select('*')
            .eq('agent_id', user.id)
            .eq('attendance_date', today)
            .single()

        let currentAttendance = attendance

        // 2. Auto check-in if no record for today
        if (attendanceError && attendanceError.code === 'PGRST116') {
            // Get agent's org_id for the attendance record
            const { data: profile } = await supabase
                .from('profiles')
                .select('org_id')
                .eq('id', user.id)
                .single()

            const { data: newRecord, error: insertError } = await supabase
                .from('attendance')
                .insert({
                    agent_id: user.id,
                    org_id: profile?.org_id,
                    status: 'present',
                    attendance_date: today
                })
                .select()
                .single()

            if (insertError) throw insertError
            currentAttendance = newRecord
        } else if (attendanceError) {
            throw attendanceError
        }

        // 3. Get real stats from DB
        const { count: myLeadsCount } = await supabase
            .from('leads')
            .select('*', { count: 'exact', head: true })
            .eq('assigned_agent_id', user.id)

        const { count: dealsClosedCount } = await supabase
            .from('leads')
            .select('*', { count: 'exact', head: true })
            .eq('assigned_agent_id', user.id)
            .eq('status', 'closed_won')

        const stats = {
            myLeads: myLeadsCount || 0,
            dealsClosed: dealsClosedCount || 0,
        }

        return NextResponse.json({
            attendance: currentAttendance,
            stats
        })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const { attendanceId, status, checkOut } = await request.json()
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        if (checkOut) {
            const { error } = await supabase
                .from('attendance')
                .update({
                    check_out: new Date().toISOString(),
                    status: 'present'
                })
                .eq('id', attendanceId)
                .eq('agent_id', user.id)

            if (error) throw error
            return NextResponse.json({ success: true })
        }

        if (status) {
            const { error } = await supabase
                .from('attendance')
                .update({ status })
                .eq('id', attendanceId)
                .eq('agent_id', user.id)

            if (error) throw error
            return NextResponse.json({ success: true })
        }

        return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
