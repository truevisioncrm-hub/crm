"use client";

import { Download, Calendar, ArrowUpRight, ArrowDownRight, TrendingUp, Users, Home, Eye, MapPin, Phone, IndianRupee, Target, Clock, UserCheck } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend, RadialBarChart, RadialBar } from "recharts";

// ─── Data ───────────────────────────────────────────────────
const REVENUE_DATA = [
    { name: "Jan", revenue: 3200, expenses: 1800, profit: 1400 },
    { name: "Feb", revenue: 4100, expenses: 2100, profit: 2000 },
    { name: "Mar", revenue: 3800, expenses: 1950, profit: 1850 },
    { name: "Apr", revenue: 5200, expenses: 2400, profit: 2800 },
    { name: "May", revenue: 4700, expenses: 2200, profit: 2500 },
    { name: "Jun", revenue: 6100, expenses: 2800, profit: 3300 },
    { name: "Jul", revenue: 5500, expenses: 2600, profit: 2900 },
    { name: "Aug", revenue: 7200, expenses: 3100, profit: 4100 },
    { name: "Sep", revenue: 6800, expenses: 2900, profit: 3900 },
    { name: "Oct", revenue: 8100, expenses: 3400, profit: 4700 },
    { name: "Nov", revenue: 7600, expenses: 3200, profit: 4400 },
    { name: "Dec", revenue: 9200, expenses: 3800, profit: 5400 },
];

const LEADS_FUNNEL = [
    { stage: "New Leads", count: 245, color: "#3B82F6" },
    { stage: "Contacted", count: 182, color: "#F59E0B" },
    { stage: "Site Visit", count: 98, color: "#8B5CF6" },
    { stage: "Negotiation", count: 64, color: "#EC4899" },
    { stage: "Closed Won", count: 42, color: "#10B981" },
];

const LEAD_SOURCE = [
    { name: "Facebook", value: 35, color: "#3B82F6" },
    { name: "Website", value: 25, color: "#8B5CF6" },
    { name: "99acres", value: 18, color: "#F59E0B" },
    { name: "Referral", value: 14, color: "#10B981" },
    { name: "Walk-in", value: 8, color: "#EC4899" },
];

const AGENT_PERFORMANCE = [
    { name: "Arjun M", leads: 48, deals: 12, revenue: 8.5, visits: 32, rate: 92 },
    { name: "Priya S", leads: 42, deals: 10, revenue: 6.2, visits: 28, rate: 88 },
    { name: "Rahul K", leads: 35, deals: 8, revenue: 5.1, visits: 22, rate: 85 },
    { name: "Sneha P", leads: 38, deals: 9, revenue: 5.8, visits: 25, rate: 90 },
    { name: "Vikash J", leads: 28, deals: 6, revenue: 3.4, visits: 18, rate: 78 },
];

const PROPERTY_TYPE = [
    { name: "2BHK", value: 42, color: "#3B82F6" },
    { name: "3BHK", value: 31, color: "#8B5CF6" },
    { name: "Villa", value: 15, color: "#10B981" },
    { name: "Penthouse", value: 8, color: "#F59E0B" },
    { name: "Mansion", value: 4, color: "#EC4899" },
];

const MONTHLY_VISITS = [
    { name: "Jan", scheduled: 45, completed: 38, cancelled: 7 },
    { name: "Feb", scheduled: 52, completed: 44, cancelled: 8 },
    { name: "Mar", scheduled: 48, completed: 41, cancelled: 7 },
    { name: "Apr", scheduled: 61, completed: 55, cancelled: 6 },
    { name: "May", scheduled: 58, completed: 50, cancelled: 8 },
    { name: "Jun", scheduled: 65, completed: 58, cancelled: 7 },
    { name: "Jul", scheduled: 72, completed: 64, cancelled: 8 },
    { name: "Aug", scheduled: 68, completed: 60, cancelled: 8 },
    { name: "Sep", scheduled: 75, completed: 68, cancelled: 7 },
    { name: "Oct", scheduled: 82, completed: 74, cancelled: 8 },
    { name: "Nov", scheduled: 78, completed: 70, cancelled: 8 },
    { name: "Dec", scheduled: 88, completed: 80, cancelled: 8 },
];

const LOCATION_DATA = [
    { area: "Whitefield", leads: 58, deals: 14, avgPrice: "₹1.8 Cr" },
    { area: "Koramangala", leads: 42, deals: 10, avgPrice: "₹1.2 Cr" },
    { area: "HSR Layout", leads: 35, deals: 8, avgPrice: "₹95 L" },
    { area: "Indiranagar", leads: 28, deals: 7, avgPrice: "₹2.5 Cr" },
    { area: "Electronic City", leads: 22, deals: 5, avgPrice: "₹75 L" },
    { area: "Sarjapur", leads: 32, deals: 6, avgPrice: "₹85 L" },
    { area: "Hebbal", leads: 25, deals: 5, avgPrice: "₹1.5 Cr" },
];

const ATTENDANCE_SUMMARY = [
    { name: "Present", value: 88, fill: "#10B981" },
    { name: "Late", value: 6, fill: "#F59E0B" },
    { name: "Absent", value: 4, fill: "#EF4444" },
    { name: "Leave", value: 2, fill: "#3B82F6" },
];

const tooltipStyle = { backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #E5E7EB", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", fontSize: "12px" };

export default function ReportsPage() {
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
                    { label: "Total Revenue", value: "₹71.4 Cr", change: "+18.5%", positive: true, icon: IndianRupee, color: "text-emerald-600", bg: "bg-emerald-50", iconBg: "bg-emerald-100" },
                    { label: "Deals Closed", value: "142", change: "+12.2%", positive: true, icon: Target, color: "text-primary", bg: "bg-primary/5", iconBg: "bg-primary/10" },
                    { label: "Active Leads", value: "589", change: "+22.8%", positive: true, icon: Users, color: "text-blue-600", bg: "bg-blue-50", iconBg: "bg-blue-100" },
                    { label: "Avg Deal Size", value: "₹85 L", change: "-2.4%", positive: false, icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50", iconBg: "bg-amber-100" },
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
                            <span className={`inline-flex items-center text-[10px] font-bold mt-1 ${kpi.positive ? "text-emerald-600" : "text-red-600"}`}>
                                {kpi.positive ? <ArrowUpRight size={12} className="mr-0.5" /> : <ArrowDownRight size={12} className="mr-0.5" />}
                                {kpi.change} vs last year
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* ═══ Section 1: Revenue ═══ */}
            <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                    <div>
                        <h3 className="text-lg font-bold text-neutral-900">Revenue Overview</h3>
                        <p className="text-xs text-neutral-400 mt-0.5">Monthly revenue, expenses and profit trend</p>
                    </div>
                    <div className="flex gap-4 text-[10px]">
                        <span className="flex items-center gap-1.5"><span className="w-3 h-1 rounded-full bg-emerald-500" /> Revenue</span>
                        <span className="flex items-center gap-1.5"><span className="w-3 h-1 rounded-full bg-red-400" /> Expenses</span>
                        <span className="flex items-center gap-1.5"><span className="w-3 h-1 rounded-full bg-blue-500" /> Profit</span>
                    </div>
                </div>
                {/* Summary */}
                <div className="grid grid-cols-3 gap-4 my-5">
                    {[
                        { label: "Total Revenue", val: "₹71.4 Cr", color: "text-emerald-600" },
                        { label: "Total Expenses", val: "₹30.2 Cr", color: "text-red-500" },
                        { label: "Net Profit", val: "₹41.2 Cr", color: "text-blue-600" },
                    ].map((s) => (
                        <div key={s.label} className="text-center py-3 bg-neutral-50 rounded-xl">
                            <p className={`text-lg font-bold ${s.color}`}>{s.val}</p>
                            <p className="text-[9px] text-neutral-400 uppercase font-semibold">{s.label}</p>
                        </div>
                    ))}
                </div>
                <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="gRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gExpense" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#gRevenue)" />
                            <Area type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#gExpense)" />
                            <Line type="monotone" dataKey="profit" stroke="#3B82F6" strokeWidth={2} dot={false} strokeDasharray="6 3" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ═══ Section 2: Leads Funnel + Source ═══ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Leads Funnel */}
                <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-neutral-900 mb-1">Lead Conversion Funnel</h3>
                    <p className="text-xs text-neutral-400 mb-5">From new lead to deal closed</p>
                    <div className="space-y-3">
                        {LEADS_FUNNEL.map((stage, i) => {
                            const pct = Math.round((stage.count / LEADS_FUNNEL[0].count) * 100);
                            const convRate = i > 0 ? Math.round((stage.count / LEADS_FUNNEL[i - 1].count) * 100) : 100;
                            return (
                                <div key={stage.stage}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-semibold text-neutral-700">{stage.stage}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-bold text-neutral-900">{stage.count}</span>
                                            {i > 0 && <span className="text-[9px] text-neutral-400">{convRate}% conv.</span>}
                                        </div>
                                    </div>
                                    <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: stage.color }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
                        <span className="text-xs text-neutral-500">Overall Conversion</span>
                        <span className="text-sm font-bold text-emerald-600">{Math.round((LEADS_FUNNEL[4].count / LEADS_FUNNEL[0].count) * 100)}%</span>
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
                                    <Pie data={LEAD_SOURCE} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value" strokeWidth={0}>
                                        {LEAD_SOURCE.map((entry) => (
                                            <Cell key={entry.name} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={tooltipStyle} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex-1 space-y-3">
                            {LEAD_SOURCE.map((src) => (
                                <div key={src.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: src.color }} />
                                        <span className="text-xs font-medium text-neutral-700">{src.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-neutral-900">{src.value}%</span>
                                        <div className="w-16 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full" style={{ width: `${src.value}%`, backgroundColor: src.color }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══ Section 3: Agent Performance ═══ */}
            <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-neutral-900 mb-1">Agent Performance</h3>
                <p className="text-xs text-neutral-400 mb-5">Comprehensive agent metrics and comparison</p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Chart */}
                    <div className="lg:col-span-2 h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={AGENT_PERFORMANCE} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
                                <Tooltip contentStyle={tooltipStyle} />
                                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                                <Bar dataKey="leads" name="Leads" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="deals" name="Deals" fill="#10B981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="visits" name="Visits" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Agent Table */}
                    <div className="space-y-3">
                        <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Leaderboard</p>
                        {AGENT_PERFORMANCE.sort((a, b) => b.revenue - a.revenue).map((agent, i) => (
                            <div key={agent.name} className={`flex items-center gap-3 p-3 rounded-xl border ${i === 0 ? "bg-amber-50/50 border-amber-100" : "bg-neutral-50 border-neutral-100"}`}>
                                <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold ${i === 0 ? "bg-amber-500 text-white" : i === 1 ? "bg-neutral-300 text-white" : i === 2 ? "bg-orange-400 text-white" : "bg-neutral-100 text-neutral-500"}`}>
                                    {i + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-neutral-900">{agent.name}</p>
                                    <p className="text-[9px] text-neutral-400">{agent.deals} deals · {agent.leads} leads</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-emerald-600">₹{agent.revenue} Cr</p>
                                    <p className="text-[9px] text-neutral-400">{agent.rate}% att.</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ═══ Section 4: Visits + Property Type ═══ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Site Visits Trends */}
                <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-neutral-900 mb-1">Site Visit Trends</h3>
                    <p className="text-xs text-neutral-400 mb-5">Monthly scheduled vs completed visits</p>
                    <div className="grid grid-cols-3 gap-3 mb-5">
                        {[
                            { label: "Total Scheduled", val: "782", color: "text-blue-600" },
                            { label: "Completed", val: "702", color: "text-emerald-600" },
                            { label: "Success Rate", val: "89.8%", color: "text-violet-600" },
                        ].map((s) => (
                            <div key={s.label} className="text-center py-2.5 bg-neutral-50 rounded-xl">
                                <p className={`text-sm font-bold ${s.color}`}>{s.val}</p>
                                <p className="text-[8px] text-neutral-400 uppercase font-semibold">{s.label}</p>
                            </div>
                        ))}
                    </div>
                    <div className="h-[220px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={MONTHLY_VISITS} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9CA3AF" }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9CA3AF" }} />
                                <Tooltip contentStyle={tooltipStyle} />
                                <Line type="monotone" dataKey="scheduled" stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 3, fill: "#3B82F6" }} />
                                <Line type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={2.5} dot={{ r: 3, fill: "#10B981" }} />
                                <Line type="monotone" dataKey="cancelled" stroke="#EF4444" strokeWidth={1.5} dot={{ r: 2, fill: "#EF4444" }} strokeDasharray="4 3" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Property Type Distribution */}
                <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-neutral-900 mb-1">Property Demand</h3>
                    <p className="text-xs text-neutral-400 mb-5">Most searched property types</p>
                    <div className="flex items-center gap-6">
                        <div className="w-[180px] h-[180px] shrink-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={PROPERTY_TYPE} cx="50%" cy="50%" outerRadius={85} dataKey="value" strokeWidth={0} label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={9}>
                                        {PROPERTY_TYPE.map((entry) => (
                                            <Cell key={entry.name} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={tooltipStyle} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex-1 space-y-3">
                            {PROPERTY_TYPE.map((pt) => (
                                <div key={pt.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded" style={{ backgroundColor: pt.color }} />
                                        <span className="text-xs font-medium text-neutral-700">{pt.name}</span>
                                    </div>
                                    <span className="text-xs font-bold text-neutral-900">{pt.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══ Section 5: Location Analysis + Attendance ═══ */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Location */}
                <div className="lg:col-span-3 bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-neutral-900 mb-1">Location Analysis</h3>
                    <p className="text-xs text-neutral-400 mb-5">Performance by area in Bangalore</p>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-neutral-100">
                                    <th className="text-left text-[10px] font-semibold text-neutral-400 uppercase tracking-wider pb-3">Area</th>
                                    <th className="text-center text-[10px] font-semibold text-neutral-400 uppercase tracking-wider pb-3">Leads</th>
                                    <th className="text-center text-[10px] font-semibold text-neutral-400 uppercase tracking-wider pb-3">Deals</th>
                                    <th className="text-center text-[10px] font-semibold text-neutral-400 uppercase tracking-wider pb-3">Conv %</th>
                                    <th className="text-right text-[10px] font-semibold text-neutral-400 uppercase tracking-wider pb-3">Avg Price</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {LOCATION_DATA.map((loc) => {
                                    const conv = Math.round((loc.deals / loc.leads) * 100);
                                    return (
                                        <tr key={loc.area} className="hover:bg-neutral-50/50 transition-colors">
                                            <td className="py-3">
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={12} className="text-violet-500 shrink-0" />
                                                    <span className="text-xs font-bold text-neutral-900">{loc.area}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 text-center text-xs font-semibold text-neutral-700">{loc.leads}</td>
                                            <td className="py-3 text-center text-xs font-bold text-emerald-600">{loc.deals}</td>
                                            <td className="py-3 text-center">
                                                <div className="inline-flex items-center gap-1.5">
                                                    <div className="w-12 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                                                        <div className={`h-full rounded-full ${conv >= 25 ? "bg-emerald-500" : conv >= 18 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${conv}%` }} />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-neutral-600">{conv}%</span>
                                                </div>
                                            </td>
                                            <td className="py-3 text-right text-xs font-semibold text-neutral-800">{loc.avgPrice}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Attendance Summary */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-neutral-900 mb-1">Attendance Overview</h3>
                    <p className="text-xs text-neutral-400 mb-5">Monthly team attendance rate</p>
                    <div className="h-[180px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="100%" data={ATTENDANCE_SUMMARY} startAngle={90} endAngle={-270}>
                                <RadialBar background dataKey="value" cornerRadius={8} />
                                <Tooltip contentStyle={tooltipStyle} />
                            </RadialBarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3">
                        {ATTENDANCE_SUMMARY.map((att) => (
                            <div key={att.name} className="flex items-center gap-2 p-2 bg-neutral-50 rounded-lg">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: att.fill }} />
                                <span className="text-[10px] text-neutral-600 flex-1">{att.name}</span>
                                <span className="text-xs font-bold text-neutral-900">{att.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
