"use client";

import { ArrowUpRight, ArrowDownRight, Users, Target, TrendingUp, MoreHorizontal, Calendar, Download, Filter } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// Mock Data
const MOM_DATA = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 },
];

const LEAD_DISTRIBUTION = [
    { name: 'Facebook', value: 400, color: '#1B4332' },
    { name: 'Website', value: 300, color: '#2D6A4F' },
    { name: 'Referral', value: 300, color: '#40916C' },
    { name: 'Other', value: 200, color: '#52B788' },
];

const RECENT_TRANSACTIONS = [
    { id: 1, name: "Ahmed Khan", property: "Prestige Villa", date: "Today, 2:00 PM", amount: "₹1.2 Cr", status: "Completed" },
    { id: 2, name: "Sara Mirza", property: "Brigade Tower", date: "Yesterday, 4:30 PM", amount: "₹85 L", status: "Pending" },
    { id: 3, name: "Ravi Patel", property: "Sobha City", date: "Feb 12, 2026", amount: "₹2.1 Cr", status: "Completed" },
    { id: 4, name: "Priya K.", property: "Godrej Woods", date: "Feb 10, 2026", amount: "₹95 L", status: "Cancelled" },
];

export default function AdminDashboard() {
    return (
        <div className="grid grid-cols-12 gap-6 animate-fade-in">
            {/* Left Column - Main Content (8 cols) */}
            <div className="col-span-12 lg:col-span-8 space-y-6">

                {/* Header Section */}
                <div className="flex items-end justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900">Dashboard Overview</h1>
                        <p className="text-sm text-neutral-500 mt-1">Welcome back, Admin. Here's what's happening today.</p>
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

                {/* Main Stats Card with Chart */}
                <div className="p-6 bg-white border border-neutral-100 rounded-2xl shadow-sm card-shadow">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <p className="text-sm font-medium text-neutral-500 mb-1">Total Revenue</p>
                            <h2 className="text-3xl font-bold text-neutral-900">₹4.2 Cr</h2>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                    <ArrowUpRight size={12} className="mr-1" /> +12.5%
                                </span>
                                <span className="text-xs text-neutral-400">vs last month</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <select className="bg-neutral-50 border border-neutral-200 text-xs font-medium rounded-lg px-2 py-1.5 focus:ring-0">
                                <option>This Month</option>
                                <option>Last Month</option>
                            </select>
                            <button className="p-1.5 hover:bg-neutral-50 rounded-lg text-neutral-400"><MoreHorizontal size={16} /></button>
                        </div>
                    </div>

                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={MOM_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#1B4332" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#1B4332" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1B4332', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    itemStyle={{ color: '#fff', fontSize: '12px' }}
                                    labelStyle={{ display: 'none' }}
                                    cursor={{ stroke: '#1B4332', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#1B4332" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Leads Table */}
                <div className="bg-white border border-neutral-100 rounded-2xl shadow-sm card-shadow overflow-hidden">
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
                                {RECENT_TRANSACTIONS.map((item) => (
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

            </div>

            {/* Right Column - Widgets (4 cols) */}
            <div className="col-span-12 lg:col-span-4 space-y-6">

                {/* Secondary Cards */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-primary/5 border border-primary/10 rounded-2xl">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mb-3 shadow-sm text-primary">
                            <Users size={16} />
                        </div>
                        <p className="text-xl font-bold text-neutral-900">124</p>
                        <p className="text-xs text-neutral-500 mt-1">Total Agents</p>
                    </div>
                    <div className="p-5 bg-white border border-neutral-100 rounded-2xl shadow-sm card-shadow">
                        <div className="w-8 h-8 bg-neutral-50 rounded-lg flex items-center justify-center mb-3 text-neutral-600">
                            <Target size={16} />
                        </div>
                        <p className="text-xl font-bold text-neutral-900">85%</p>
                        <p className="text-xs text-neutral-500 mt-1">Target Met</p>
                    </div>
                </div>

                {/* Lead Distribution Chart */}
                <div className="p-6 bg-white border border-neutral-100 rounded-2xl shadow-sm card-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-neutral-900">Lead Sources</h3>
                        <button className="p-1 hover:bg-neutral-50 rounded-lg text-neutral-400"><MoreHorizontal size={16} /></button>
                    </div>
                    <div className="h-[220px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={LEAD_DISTRIBUTION}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {LEAD_DISTRIBUTION.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <p className="text-2xl font-bold text-neutral-900">1.2k</p>
                            <p className="text-[10px] uppercase tracking-wide text-neutral-400">Total</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4 justify-center">
                        {LEAD_DISTRIBUTION.map((item) => (
                            <div key={item.name} className="flex items-center gap-1.5 px-2 py-1 bg-neutral-50 rounded-lg">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-xs font-medium text-neutral-600">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Schedule/Visits Widget */}
                <div className="p-6 bg-white border border-neutral-100 rounded-2xl shadow-sm card-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-neutral-900">Today's Visits</h3>
                        <div className="bg-neutral-100 px-2 py-1 rounded-lg text-xs font-semibold text-neutral-600">
                            3 Pending
                        </div>
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-4 items-start group">
                                <div className="flex flex-col items-center">
                                    <span className="text-xs font-bold text-neutral-900">10:00</span>
                                    <span className="text-[10px] text-neutral-400 uppercase">AM</span>
                                    <div className="w-px h-full bg-neutral-200 mt-2 group-last:hidden" />
                                </div>
                                <div className="flex-1 pb-4 group-last:pb-0">
                                    <div className="p-3 bg-neutral-50 group-hover:bg-primary/5 transition-colors rounded-xl border border-transparent group-hover:border-primary/10">
                                        <p className="text-xs font-bold text-neutral-900">Site Visit at Whitefield</p>
                                        <p className="text-[11px] text-neutral-500 mt-0.5">With Client: Rohan Gupta</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
