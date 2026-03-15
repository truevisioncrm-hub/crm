"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Phone, Mail, Target, TrendingUp, Users, Calendar, Clock, Loader2, XCircle } from "lucide-react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";

interface Agent {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
    assigned_area: string | null;
    avatar_url: string | null;
    created_at: string;
    status: string;
    liveStatus: string;
}

interface Lead {
    id: string;
    name: string;
    budget: string;
    status: string;
    property_type: string;
}

interface Activity {
    id: string;
    activity_type: string;
    message: string;
    metadata: any;
    created_at: string;
}

const statusStyles: Record<string, string> = {
    "New Lead": "bg-blue-50 text-blue-600",
    "Contacted": "bg-amber-50 text-amber-600",
    "Site Visit": "bg-violet-50 text-violet-600",
    "Negotiation": "bg-pink-50 text-pink-600",
    "Closed Won": "bg-emerald-50 text-emerald-600",
    "Follow-up": "bg-cyan-50 text-cyan-600",
};

const activityDot: Record<string, string> = {
    success: "bg-emerald-500",
    note: "bg-neutral-400",
    status: "bg-blue-500",
    created: "bg-primary"
};

const statusDot: Record<string, string> = {
    Online: "bg-emerald-500",
    "On Visit": "bg-violet-500",
    "On Break": "bg-amber-500",
    Offline: "bg-neutral-400",
    Inactive: "bg-red-400"
};

export default function AgentDetailPage() {
    const router = useRouter();
    const params = useParams();
    const agentId = params.id as string;

    const [data, setData] = useState<{ agent: Agent; leads: Lead[]; activities: Activity[] } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!agentId) return;
        fetchData();
    }, [agentId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/agents/${agentId}`);
            const result = await response.json();
            if (result.error) throw new Error(result.error);
            setData(result);
        } catch (err: any) {
            console.error("Fetch Agent Error:", err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-[70vh]"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
    }

    if (!data) {
        return (
            <div className="flex flex-col justify-center items-center h-[70vh] gap-4 text-center">
                <XCircle className="w-12 h-12 text-neutral-300" />
                <h2 className="text-xl font-bold text-neutral-700">Agent not found</h2>
                <button onClick={() => router.back()} className="text-sm font-semibold text-primary hover:underline">Return to list</button>
            </div>
        );
    }

    const { agent, leads, activities } = data;

    return (
        <div className="space-y-6 animate-fade-in">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-800 transition-colors font-medium">
                <ArrowLeft size={16} /> Back to Agents
            </button>

            <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-20 h-20 rounded-2xl bg-neutral-100 flex items-center justify-center text-2xl font-bold text-neutral-600 shrink-0 uppercase overflow-hidden">
                    {agent.avatar_url ? <Image src={agent.avatar_url} alt="Avatar" width={96} height={96} className="w-full h-full object-cover" /> : agent.full_name?.charAt(0) || '?'}
                </div>
                <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                        <h1 className="text-xl font-bold text-neutral-900">{agent.full_name}</h1>
                        <div className="flex items-center justify-center md:justify-start gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-50 border border-neutral-100 w-max mx-auto md:mx-0">
                            <span className={`w-2 h-2 rounded-full ${statusDot[agent.liveStatus] || "bg-neutral-400"}`} />
                            <span className="text-xs font-bold text-neutral-600">{agent.liveStatus}</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3">
                        <span className="text-sm text-neutral-500 flex items-center gap-1.5"><MapPin size={14} className="text-neutral-400" />{agent.assigned_area || "No Area Assigned"}</span>
                        <span className="text-sm text-neutral-500 flex items-center gap-1.5"><Phone size={14} className="text-neutral-400" />{agent.phone || "No Phone"}</span>
                        <span className="text-sm text-neutral-500 flex items-center gap-1.5"><Mail size={14} className="text-neutral-400" />{agent.email}</span>
                        <span className="text-sm text-neutral-400 flex items-center gap-1.5"><Calendar size={14} className="text-neutral-400" />Joined {new Date(agent.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Active Leads", value: leads.filter(l => l.status !== 'Closed Won').length, icon: Users, color: "text-primary", bg: "bg-primary/5" },
                    { label: "Closed Deals", value: leads.filter(l => l.status === 'Closed Won').length, icon: Target, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Conversion Rate", value: leads.length > 0 ? `${Math.round((leads.filter(l => l.status === 'Closed Won').length / leads.length) * 100)}%` : "0%", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
                    { label: "Total Handled", value: leads.length, icon: MapPin, color: "text-violet-600", bg: "bg-violet-50" },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
                        <div className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                            <stat.icon size={18} className={stat.color} />
                        </div>
                        <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
                        <p className="text-xs text-neutral-400 uppercase tracking-wider font-semibold mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-neutral-900 mb-5">Assigned Leads ({leads.length})</h3>
                    <div className="space-y-1">
                        {leads.length === 0 && <p className="text-sm text-neutral-400 text-center py-8">No leads assigned to this agent.</p>}
                        {leads.map((lead) => (
                            <div key={lead.id} className="flex items-center justify-between py-4 border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50 px-2 rounded-xl transition-colors cursor-pointer" onClick={() => router.push(`/admin/leads/${lead.id}`)}>
                                <div>
                                    <p className="text-sm font-bold text-neutral-800">{lead.name}</p>
                                    <p className="text-xs text-neutral-400 mt-0.5 font-medium">{lead.budget} • {lead.property_type}</p>
                                </div>
                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${statusStyles[lead.status] || "bg-neutral-50 text-neutral-600"}`}>
                                    {lead.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-neutral-900 mb-5">Recent Activity</h3>
                    <div className="space-y-6">
                        {activities.length === 0 && <p className="text-sm text-neutral-400 text-center py-8">No recent activity recorded.</p>}
                        {activities.map((act, i) => (
                            <div key={act.id} className="flex gap-3">
                                <div className="flex flex-col items-center">
                                    <div className={`w-2 h-2 rounded-full ${activityDot[act.activity_type] || "bg-neutral-300"} mt-1.5`} />
                                    {i < activities.length - 1 && <div className="w-px flex-1 bg-neutral-100 mt-2" />}
                                </div>
                                <div className="pb-2">
                                    <p className="text-xs font-bold text-neutral-800">{act.activity_type}</p>
                                    <p className="text-[11px] text-neutral-500 mt-0.5 line-clamp-2">{act.message}</p>
                                    <p className="text-[10px] text-neutral-400 mt-1 flex items-center gap-1"><Clock size={10} />{new Date(act.created_at).toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
