"use client";

import { useEffect, useState } from "react";
import { Download, Calendar, ArrowUpRight, ArrowDownRight, TrendingUp, Users, MapPin, IndianRupee, Target, Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend, RadialBarChart, RadialBar } from "recharts";

// ─── Constants ──────────────────────────────────────────────
const COLORS = ["#3B82F6", "#F59E0B", "#8B5CF6", "#EC4899", "#10B981", "#EF4444", "#06B6D4"];
const tooltipStyle = { backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #E5E7EB", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", fontSize: "12px" };

// ─── Initial Empty Data (Avoid layout shift) ───────────────
const REVENUE_DATA = [
    { name: "Jan", revenue: 0, expenses: 0, profit: 0 },
    { name: "Feb", revenue: 0, expenses: 0, profit: 0 },
    { name: "Mar", revenue: 0, expenses: 0, profit: 0 },
    { name: "Apr", revenue: 0, expenses: 0, profit: 0 },
    { name: "May", revenue: 0, expenses: 0, profit: 0 },
    { name: "Jun", revenue: 0, expenses: 0, profit: 0 },
];

export default function ReportsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await fetch('/api/admin/reports');
                const result = await res.json();
                if (result.error) throw new Error(result.error);
                setData(result);
            } catch (err) {
                console.error("Failed to fetch reports:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    const formatCurrency = (val: number) => {
        if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
        if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
        return `₹${val.toLocaleString()}`;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-neutral-500 font-medium">Generating performance report...</p>
            </div>
        );
    }

    if (!data) {
        return <div className="p-8 text-center text-neutral-500 font-medium border-2 border-dashed rounded-3xl mt-10">Report generation failed. Please try again.</div>;
    }

    const { kpis, funnel, sources, propertyDemand } = data;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Reports & Analytics</h1>
                    <p className="text-sm text-neutral-500 mt-1">Deep dive into your business performance</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm font-semibold hover:bg-neutral-50 transition-colors shadow-sm">
                        <Calendar size={16} /> Last 12 Months
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25">
                        <Download size={16} /> Export PDF
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Revenue", value: formatCurrency(kpis.revenue), change: "--%", positive: true, icon: IndianRupee, color: "text-emerald-600", bg: "bg-emerald-50", iconBg: "bg-emerald-100" },
                    { label: "Deals Closed", value: kpis.closedWon, change: "--%", positive: true, icon: Target, color: "text-primary", bg: "bg-primary/5", iconBg: "bg-primary/10" },
                    { label: "Active Leads", value: kpis.totalLeads, change: "--%", positive: true, icon: Users, color: "text-blue-600", bg: "bg-blue-50", iconBg: "bg-blue-100" },
                    { label: "Active Agents", value: kpis.activeAgents, change: "--%", positive: true, icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50", iconBg: "bg-amber-100" },
                ].map((kpi) => {
                    const Icon = kpi.icon;
                    return (
                        <div key={kpi.label} className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">{kpi.label}</p>
                                <div className={`w-8 h-8 rounded-xl ${kpi.iconBg} flex items-center justify-center`}>
                                    <Icon size={16} className={kpi.color} />
                                </div>
                            </div>
                            <h3 className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</h3>
                            <span className={`inline-flex items-center text-[10px] font-bold mt-1 text-neutral-400`}>
                                -- vs last year
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* ═══ Section 2: Leads Funnel + Source ═══ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Leads Funnel */}
                <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-neutral-900 mb-1">Lead Conversion Funnel</h3>
                    <p className="text-xs text-neutral-400 mb-5">From new lead to deal closed</p>
                    <div className="space-y-3">
                        {funnel.map((stage: any, i: number) => {
                            const pct = Math.round((stage.count / (funnel[0].count || 1)) * 100);
                            return (
                                <div key={stage.stage}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-semibold text-neutral-700 capitalize">{stage.stage.replace('_', ' ')}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-bold text-neutral-900">{stage.count}</span>
                                            {i > 0 && <span className="text-[9px] text-neutral-400">{pct}%</span>}
                                        </div>
                                    </div>
                                    <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                                    </div>
                                </div>
                            );
                        })}
                        {funnel.length === 0 && <p className="text-xs text-neutral-400 text-center py-6">No lead data available for funnel.</p>}
                    </div>
                </div>

                {/* Lead Source */}
                <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-neutral-900 mb-1">Lead Sources</h3>
                    <p className="text-xs text-neutral-400 mb-5">Where your leads come from</p>
                    <div className="flex items-center gap-6">
                        <div className="w-[160px] h-[160px] shrink-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={sources} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value" strokeWidth={0}>
                                        {sources.map((entry: any, index: number) => (
                                            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={tooltipStyle} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex-1 space-y-3">
                            {sources.map((src: any, index: number) => (
                                <div key={src.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                        <span className="text-xs font-medium text-neutral-700 capitalize">{src.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-neutral-900">{src.value}</span>
                                    </div>
                                </div>
                            ))}
                            {sources.length === 0 && <p className="text-xs text-neutral-400 text-center py-6">No source data available.</p>}
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══ Section 4: Property Type Distribution ═══ */}
            <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-neutral-900 mb-1">Property Demand</h3>
                <p className="text-xs text-neutral-400 mb-5">Most searched property types</p>
                <div className="flex items-center gap-6">
                    <div className="w-[180px] h-[180px] shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={propertyDemand} cx="50%" cy="50%" outerRadius={85} dataKey="value" strokeWidth={0} label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={9}>
                                    {propertyDemand.map((entry: any, index: number) => (
                                        <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={tooltipStyle} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex-1 space-y-3">
                        {propertyDemand.map((pt: any, index: number) => (
                            <div key={pt.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    <span className="text-xs font-medium text-neutral-700 uppercase">{pt.name}</span>
                                </div>
                                <span className="text-xs font-bold text-neutral-900">{pt.value}</span>
                            </div>
                        ))}
                        {propertyDemand.length === 0 && <p className="text-xs text-neutral-400 text-center py-6">No property demand data available.</p>}
                    </div>
                </div>
            </div>

            {/* Hidden Placeholder sections for future implementation */}
            <div className="p-12 border-2 border-dashed border-neutral-100 rounded-3xl text-center">
                <p className="text-neutral-400 text-sm font-medium">Revenue Trend, Agent Leaderboard, and Attendance reports will be populated as your organization grows.</p>
            </div>
        </div>
    );
}
