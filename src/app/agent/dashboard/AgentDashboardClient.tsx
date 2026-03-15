"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowUpRight, Target, TrendingUp, Users, LogOut, Calendar, Clock, MapPin } from "lucide-react";
import { useAuth } from "@/lib/auth";

export function AgentDashboardClient({ initialStats, initialLiveStatus, attendanceId, checkInTime, performanceData, upcomingVisits }: any) {
    const { user, logout } = useAuth();
    const [liveStatus, setLiveStatus] = useState<string>(initialLiveStatus);

    const handleCheckout = async () => {
        if (!attendanceId) return;

        try {
            const response = await fetch('/api/agent/dashboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ attendanceId, checkOut: true }),
            });

            if (response.ok) {
                setLiveStatus('Offline');
                logout();
            }
        } catch {
            // Checkout failed silently
        }
    };

    const updateStatus = async (status: string) => {
        setLiveStatus(status);
        if (!attendanceId) return;

        try {
            await fetch('/api/agent/dashboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ attendanceId, status }),
            });
        } catch {
            // Status update failed silently
        }
    };

    return (
        <div className="grid grid-cols-12 gap-6 animate-fade-in">
            {/* Header */}
            <div className="col-span-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Agent Dashboard</h1>
                    <p className="text-sm text-neutral-500 mt-1">
                        Welcome back, {user?.name?.split(' ')[0] || 'Agent'}. {checkInTime ? `You checked in at ${checkInTime}.` : ''}
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-neutral-200 shadow-sm">
                        <div className={`w-2 h-2 rounded-full ${liveStatus === 'present' || liveStatus === 'Online' ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-400'}`} />
                        <select
                            value={liveStatus}
                            onChange={(e) => updateStatus(e.target.value)}
                            className="text-xs font-bold text-neutral-700 bg-transparent border-none outline-none focus:ring-0 cursor-pointer p-0"
                        >
                            <option value="present">Status: Online</option>
                            <option value="On Visit">Status: On Visit</option>
                            <option value="On Break">Status: On Break</option>
                            <option value="Offline">Status: Offline</option>
                        </select>
                    </div>

                    <button
                        onClick={handleCheckout}
                        className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors"
                    >
                        <LogOut size={14} /> Check Out
                    </button>
                </div>
            </div>

            {/* Left Column - Main Stats (8 cols) */}
            <div className="col-span-12 lg:col-span-8 space-y-6">

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: "My Leads", value: String(initialStats.myLeads), change: null, icon: Users, color: "bg-blue-50 text-blue-600" },
                        { label: "Deals Closed", value: String(initialStats.dealsClosed), change: null, icon: Target, color: "bg-emerald-50 text-emerald-600" },
                        { label: "Commission", value: "—", change: null, icon: TrendingUp, color: "bg-amber-50 text-amber-600" },
                    ].map((stat) => (
                        <div key={stat.label} className="p-6 bg-white border border-neutral-100 rounded-2xl shadow-sm card-shadow hover:-translate-y-1 transition-transform duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${stat.color}`}>
                                    <stat.icon size={20} />
                                </div>
                                {stat.change && (
                                    <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                                        <ArrowUpRight size={12} className="mr-1" /> {stat.change}
                                    </span>
                                )}
                            </div>
                            <h3 className="text-3xl font-bold text-neutral-900">{stat.value}</h3>
                            <p className="text-xs font-medium text-neutral-500 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Performance Chart */}
                <div className="p-6 bg-white border border-neutral-100 rounded-2xl shadow-sm card-shadow">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-neutral-900">Weekly Performance</h3>
                        <select className="bg-neutral-50 border border-neutral-200 text-xs font-medium rounded-lg px-2 py-1.5 focus:ring-0">
                            <option>This Week</option>
                            <option>Last Week</option>
                        </select>
                    </div>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2D6A4F" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#2D6A4F" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1B4332', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    itemStyle={{ color: '#fff', fontSize: '12px' }}
                                    cursor={{ stroke: '#1B4332', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#2D6A4F" strokeWidth={3} fillOpacity={1} fill="url(#colorPerf)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            {/* Right Column - Schedule (4 cols) */}
            <div className="col-span-12 lg:col-span-4 space-y-6">

                {/* Upcoming Visits */}
                <div className="p-6 bg-white border border-neutral-100 rounded-2xl shadow-sm card-shadow h-full">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-neutral-900">Today's Schedule</h3>
                        <button className="p-1.5 hover:bg-neutral-50 rounded-lg text-neutral-400"><Calendar size={18} /></button>
                    </div>

                    <div className="space-y-6 relative">
                        {/* Vertical Line */}
                        <div className="absolute left-[19px] top-2 bottom-2 w-px bg-neutral-100" />

                        {(upcomingVisits.length === 0) && (
                            <p className="text-center text-sm text-neutral-500 py-10 relative z-10 bg-white">No visits scheduled today.</p>
                        )}

                        {upcomingVisits.map((item: any, i: number) => (
                            <div key={i} className="relative flex gap-4 group">
                                <div className="w-10 h-10 rounded-full bg-white border-4 border-neutral-50 flex items-center justify-center z-10 shadow-sm mt-1">
                                    <Clock size={14} className="text-primary" />
                                </div>
                                <div className="flex-1 pb-2">
                                    <span className="text-xs font-bold text-neutral-400 block mb-1">{item.time}</span>
                                    <div className="p-3 bg-neutral-50 rounded-xl group-hover:bg-primary/5 transition-colors border border-transparent group-hover:border-primary/10">
                                        <h4 className="text-sm font-bold text-neutral-900">{item.title}</h4>
                                        {item.client && <p className="text-xs text-neutral-500 mt-0.5">w/ {item.client}</p>}
                                        {item.location && (
                                            <div className="flex items-center gap-1 mt-2 text-[10px] font-semibold text-neutral-400 uppercase tracking-wide">
                                                <MapPin size={10} /> {item.location_address || item.location}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-6 py-2.5 rounded-xl border border-neutral-200 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors">
                        View Full Calendar
                    </button>
                </div>

            </div>
        </div>
    );
}
