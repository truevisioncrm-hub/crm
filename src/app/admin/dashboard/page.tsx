import { ArrowUpRight, ArrowDownRight, Users, Target, TrendingUp, MoreHorizontal, Calendar, Download, Filter, MapPin } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AdminDashboardCharts } from "./AdminDashboardCharts";

// Helpers
const colorsList = ['#1B4332', '#2D6A4F', '#40916C', '#52B788', '#74C69D', '#95D5B2'];

const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
    return `₹${val.toLocaleString()}`;
};

export default async function AdminDashboard() {
    const supabase = await createClient();

    // 1. Authenticate & Get Org ID directly on the server
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('org_id, role')
        .eq('id', user.id)
        .single();

    if (!profile || profile.role !== 'admin' || !profile.org_id) {
        return <div className="p-8 text-center text-neutral-500">Access Denied or No Organization Assigned.</div>;
    }

    const orgId = profile.org_id;

    // 2. Fetch all required data in parallel
    const [
        { count: agentsCount },
        { data: leads },
        { data: todayVisits }
    ] = await Promise.all([
        supabase.from("profiles").select("*", { count: 'exact', head: true }).eq("org_id", orgId).eq("role", "agent").eq("status", "active"),
        supabase.from("leads").select("*, profiles:assigned_agent_id(full_name)").eq("org_id", orgId),
        supabase.from("visits").select("*, profiles:agent_id(full_name)").eq("org_id", orgId)
            .gte("scheduled_at", `${new Date().toISOString().split('T')[0]}T00:00:00Z`)
            .lte("scheduled_at", `${new Date().toISOString().split('T')[0]}T23:59:59Z`)
            .order("scheduled_at", { ascending: true })
            .limit(4)
    ]);

    // 3. Process Data
    let revenue = 0;
    let momData: { name: string, value: number }[] = [];
    let leadSources: { name: string, value: number, color: string }[] = [];
    let recentTx: any[] = [];

    if (leads) {
        const sourceMap: Record<string, number> = {};
        leads.forEach((l: any) => { sourceMap[l.source] = (sourceMap[l.source] || 0) + 1; });
        leadSources = Object.entries(sourceMap)
            .map(([name, value], i) => ({ name, value, color: colorsList[i % colorsList.length] }))
            .sort((a, b) => b.value - a.value);

        const closedLeads = leads.filter((l: any) => l.status === "closed_won");

        recentTx = closedLeads.map((l: any) => {
            const amtStr = l.budget_max ? `₹${(l.budget_max / 100000).toFixed(1)} L` : "₹50.0 L";
            return {
                id: l.id,
                name: l.name,
                property: l.property_type ? `${l.property_type} ${l.area_interest || ""}` : "Property Deal",
                date: new Date(l.updated_at || l.created_at).toLocaleDateString(),
                amount: amtStr,
                status: "Completed",
                rawDate: new Date(l.updated_at || l.created_at)
            };
        }).sort((a: any, b: any) => b.rawDate.getTime() - a.rawDate.getTime()).slice(0, 5);

        revenue = closedLeads.reduce((sum, l) => sum + (Number(l.budget_max) || 5000000), 0);

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const curMonth = new Date().getMonth();

        const momMap = new Map();
        for (let i = 5; i >= 0; i--) {
            const mIdx = (curMonth - i + 12) % 12;
            momMap.set(months[mIdx], 0);
        }

        closedLeads.forEach((l: any) => {
            const d = new Date(l.updated_at || l.created_at);
            const mLabel = months[d.getMonth()];
            if (momMap.has(mLabel)) {
                const dealValue = (Number(l.budget_max) || 5000000) / 1000;
                momMap.set(mLabel, momMap.get(mLabel) + dealValue);
            }
        });

        momMap.forEach((value, key) => {
            momData.push({ name: key, value: value || 0 });
        });
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header Section - Full Width */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Dashboard Overview</h1>
                    <p className="text-sm text-neutral-500 mt-1">Welcome back, Admin. Here&apos;s what&apos;s happening today.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-semibold hover:bg-neutral-50 transition-colors shadow-sm">
                        <Download size={14} /> Export Report
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-xs font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25">
                        <Filter size={14} /> Custom Range
                    </button>
                </div>
            </div>

            {/* Charts Section - Full Width */}
            <AdminDashboardCharts
                momData={momData}
                leadSources={leadSources}
                agentsCount={agentsCount || 0}
                revenueStr={formatCurrency(revenue)}
            />

            {/* Bottom Section - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Recent Transactions - 8 cols */}
                <div className="lg:col-span-8 bg-white border border-neutral-100 rounded-2xl shadow-sm card-shadow overflow-hidden h-fit">
                    <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                        <h3 className="font-bold text-neutral-900">Recent Transactions</h3>
                        <button className="text-xs font-semibold text-primary hover:text-primary-dark">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-neutral-50/50">
                                <tr className="text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                                    <th className="px-6 py-4 font-medium">Client Name</th>
                                    <th className="px-6 py-4 font-medium">Property</th>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                    <th className="px-6 py-4 font-medium">Amount</th>
                                    <th className="px-6 py-4 font-medium text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {(!recentTx || recentTx.length === 0) && (
                                    <tr><td colSpan={5} className="px-6 py-6 text-center text-sm text-neutral-400">No recent transactions. Move a Lead to Closed Won!</td></tr>
                                )}
                                {recentTx?.map((item) => (
                                    <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-bold text-neutral-600">
                                                    {item.name.charAt(0)}
                                                </div>
                                                <span className="text-sm font-semibold text-neutral-900">{item.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-500">{item.property}</td>
                                        <td className="px-6 py-4 text-sm text-neutral-500">{item.date}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-neutral-900">{item.amount}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${item.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                                                item.status === 'Pending' ? 'bg-amber-50 text-amber-700' :
                                                    'bg-red-50 text-red-700'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Today's Visits - 4 cols */}
                <div className="lg:col-span-4 bg-white border border-neutral-100 rounded-2xl shadow-sm card-shadow p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-neutral-900">Today&apos;s Visits</h3>
                        <div className="bg-neutral-100 px-2 py-1 rounded-lg text-xs font-semibold text-neutral-600">
                            {todayVisits?.length || 0} Pending
                        </div>
                    </div>
                    <div className="space-y-6 flex-1">
                        {(!todayVisits || todayVisits.length === 0) && <p className="text-xs text-neutral-400 text-center py-4">No visits scheduled for today.</p>}
                        {todayVisits?.map((visit: any) => {
                            const date = new Date(visit.scheduled_at);
                            return (
                                <div key={visit.id} className="flex gap-4 items-start group">
                                    <div className="flex flex-col items-center min-w-[40px]">
                                        <span className="text-xs font-bold text-neutral-900">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).split(' ')[0]}</span>
                                        <span className="text-[10px] uppercase font-bold text-neutral-400">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).split(' ')[1]}</span>
                                    </div>
                                    <div className="w-px h-10 bg-neutral-100 group-hover:bg-primary/20 transition-colors" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-neutral-900 truncate">{visit.title}</p>
                                        <p className="text-[11px] text-neutral-500 flex items-center gap-1.5 mt-1 truncate"><MapPin size={12} className="text-neutral-400 shrink-0" />{visit.location_address}</p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                                {visit.profiles?.full_name?.charAt(0) || '?'}
                                            </div>
                                            <span className="text-[10px] font-bold text-neutral-500">{visit.profiles?.full_name || 'Unassigned'}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <button className="w-full mt-6 py-2.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-600 rounded-xl text-xs font-bold transition-colors border border-neutral-200">
                        View Full Schedule
                    </button>
                </div>

            </div>
        </div>
    );
}
