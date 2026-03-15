import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AgentDashboardClient } from "./AgentDashboardClient";

// Helper to format dates
const getDayName = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
};

export default async function AgentDashboard() {
    const supabase = await createClient();

    // 1. Authenticate user directly on the server
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/login");
    }

    const today = new Date().toISOString().split('T')[0];

    // Fetch Leads for the last 7 days to calculate live performance data
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // 2. Fetch Data in Parallel (Bypassing API Route)
    const [
        { data: attendance, error: attendanceError },
        { data: profile },
        { count: myLeadsCount },
        { count: dealsClosedCount },
        { data: visits },
        { data: recentLeads }
    ] = await Promise.all([
        supabase.from('attendance').select('*').eq('agent_id', user.id).eq('attendance_date', today).single(),
        supabase.from('profiles').select('org_id').eq('id', user.id).single(),
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('assigned_agent_id', user.id),
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('assigned_agent_id', user.id).eq('status', 'closed_won'),
        supabase.from('visits').select('*').eq('agent_id', user.id).gte('scheduled_at', `${today}T00:00:00Z`).lte('scheduled_at', `${today}T23:59:59Z`).order('scheduled_at', { ascending: true }),
        supabase.from('leads').select('created_at').eq('assigned_agent_id', user.id).gte('created_at', sevenDaysAgo.toISOString())
    ]);

    // Format Performance Data (Leads assigned per day over last 7 days)
    const performanceMap = new Map();
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        performanceMap.set(getDayName(d.toISOString()), 0);
    }

    recentLeads?.forEach(lead => {
        const day = getDayName(lead.created_at);
        if (performanceMap.has(day)) {
            performanceMap.set(day, performanceMap.get(day) + 1);
        }
    });

    const PERFORMANCE_DATA = Array.from(performanceMap.entries()).map(([name, value]) => ({ name, value }));

    let currentAttendance = attendance;

    // Auto check-in if no record for today
    if (attendanceError && attendanceError.code === 'PGRST116') {
        const { data: newRecord } = await supabase
            .from('attendance')
            .insert({
                agent_id: user.id,
                org_id: profile?.org_id,
                status: 'present',
                attendance_date: today
            })
            .select()
            .single();

        currentAttendance = newRecord;
    }

    const stats = {
        myLeads: myLeadsCount || 0,
        dealsClosed: dealsClosedCount || 0,
    };

    const checkInTime = currentAttendance?.check_in
        ? new Date(currentAttendance.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : null;

    const upcomingVisits = (visits || []).map((v: any) => ({
        time: new Date(v.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: v.title,
        location: v.location_address,
        client: "" // Client name logic could be expanded here if needed via join
    }));

    return (
        <AgentDashboardClient
            initialStats={stats}
            initialLiveStatus={currentAttendance?.status || 'Offline'}
            attendanceId={currentAttendance?.id}
            checkInTime={checkInTime}
            performanceData={PERFORMANCE_DATA}
            upcomingVisits={upcomingVisits}
        />
    );
}
