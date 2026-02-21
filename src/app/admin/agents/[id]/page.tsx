"use client";

import { ArrowLeft, MapPin, Phone, Mail, Target, TrendingUp, Users, Calendar, Clock } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

const AGENTS = [
    { id: 1, name: "Arjun Mehta", status: "Online", leads: 12, closed: 4, rate: "85%", area: "Whitefield", phone: "+91 98765 43210", email: "arjun@truevision.com", joinDate: "Jan 2024" },
    { id: 2, name: "Priya Singh", status: "Online", leads: 8, closed: 2, rate: "72%", area: "Koramangala", phone: "+91 87654 32109", email: "priya@truevision.com", joinDate: "Mar 2024" },
    { id: 3, name: "Rahul Kumar", status: "Busy", leads: 15, closed: 5, rate: "78%", area: "HSR Layout", phone: "+91 76543 21098", email: "rahul@truevision.com", joinDate: "Feb 2024" },
    { id: 4, name: "Sneha Patel", status: "Online", leads: 10, closed: 3, rate: "90%", area: "Indiranagar", phone: "+91 65432 10987", email: "sneha@truevision.com", joinDate: "Dec 2023" },
    { id: 5, name: "Karan Verma", status: "Offline", leads: 5, closed: 2, rate: "92%", area: "Electronic City", phone: "+91 54321 09876", email: "karan@truevision.com", joinDate: "Apr 2024" },
    { id: 6, name: "Anita Desai", status: "Online", leads: 9, closed: 4, rate: "88%", area: "Marathahalli", phone: "+91 43210 98765", email: "anita@truevision.com", joinDate: "Jan 2024" },
];

const ASSIGNED_LEADS = [
    { name: "Ahmed Khan", budget: "₹10-15L", type: "2BHK", status: "New", statusColor: "bg-primary-light text-primary" },
    { name: "Ravi Patel", budget: "₹8-12L", type: "2BHK", status: "Site Visit", statusColor: "bg-info-light text-info" },
    { name: "Priya Kapoor", budget: "₹15-20L", type: "2BHK", status: "Negotiation", statusColor: "bg-accent-light text-accent" },
    { name: "Mohan Singh", budget: "₹25-35L", type: "3BHK", status: "Closed Won", statusColor: "bg-success-light text-success" },
];

const ACTIVITY = [
    { action: "Closed deal with Mohan Singh", time: "2 hours ago", type: "success" },
    { action: "Scheduled site visit for Ravi Patel", time: "5 hours ago", type: "info" },
    { action: "Called Ahmed Khan", time: "1 day ago", type: "default" },
    { action: "Updated Priya Kapoor status to Negotiation", time: "2 days ago", type: "accent" },
    { action: "Added new lead — Sara Mirza", time: "3 days ago", type: "primary" },
];

const activityDot: Record<string, string> = { success: "bg-success", info: "bg-info", default: "bg-neutral-400", accent: "bg-accent", primary: "bg-primary" };
const statusDot: Record<string, string> = { Online: "bg-success", Busy: "bg-warning", Offline: "bg-neutral-400" };

export default function AgentDetailPage() {
    const router = useRouter();
    const params = useParams();
    const agent = AGENTS.find((a) => a.id === Number(params.id)) || AGENTS[0];

    return (
        <div className="space-y-6 animate-fade-in">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-xs text-neutral-400 hover:text-neutral-800 transition-colors">
                <ArrowLeft size={14} /> Back to Agents
            </button>

            <div className="flex items-start gap-4 p-5 card-shadow" style={{ background: "#FFFFFF", border: "1px solid var(--card-border)" }}>
                <div className="w-14 h-14 flex items-center justify-center text-lg font-bold shrink-0" style={{ background: "rgba(27, 67, 50, 0.08)", color: "#1B4332" }}>
                    {agent.name.split(" ").map(w => w[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                        <h1 className="text-lg font-bold text-neutral-900">{agent.name}</h1>
                        <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 ${statusDot[agent.status]} animate-pulse-dot`} />
                            <span className="text-xs text-neutral-400">{agent.status}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                        <span className="text-xs text-neutral-500 flex items-center gap-1"><MapPin size={11} />{agent.area}</span>
                        <span className="text-xs text-neutral-500 flex items-center gap-1"><Phone size={11} />{agent.phone}</span>
                        <span className="text-xs text-neutral-500 flex items-center gap-1"><Mail size={11} />{agent.email}</span>
                        <span className="text-xs text-neutral-400 flex items-center gap-1"><Calendar size={11} />Joined {agent.joinDate}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Leads", value: agent.leads, icon: Users, color: "text-primary" },
                    { label: "Closed Deals", value: agent.closed, icon: Target, color: "text-success" },
                    { label: "Conversion Rate", value: agent.rate, icon: TrendingUp, color: "text-accent" },
                    { label: "Site Visits", value: "3", icon: MapPin, color: "text-info" },
                ].map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="p-5 card-shadow" style={{ background: "#FFFFFF", border: "1px solid var(--card-border)" }}>
                            <Icon size={16} className={`${stat.color} mb-2`} strokeWidth={1.5} />
                            <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
                            <p className="text-[10px] text-neutral-400 uppercase tracking-wider mt-0.5">{stat.label}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-3 p-5 card-shadow" style={{ background: "#FFFFFF", border: "1px solid var(--card-border)" }}>
                    <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4">Assigned Leads</h3>
                    <div className="space-y-0">
                        {ASSIGNED_LEADS.map((lead) => (
                            <div key={lead.name} className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid var(--card-border)" }}>
                                <div>
                                    <p className="text-xs font-medium text-neutral-800">{lead.name}</p>
                                    <p className="text-[10px] text-neutral-400 mt-0.5">{lead.budget} • {lead.type}</p>
                                </div>
                                <span className={`px-2 py-0.5 text-[10px] font-bold ${lead.statusColor}`}>{lead.status}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-2 p-5 card-shadow" style={{ background: "#FFFFFF", border: "1px solid var(--card-border)" }}>
                    <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {ACTIVITY.map((act, i) => (
                            <div key={i} className="flex gap-3">
                                <div className="flex flex-col items-center">
                                    <div className={`w-2 h-2 ${activityDot[act.type]} shrink-0 mt-1`} />
                                    {i < ACTIVITY.length - 1 && <div className="w-px flex-1 bg-card-border mt-1" />}
                                </div>
                                <div className="pb-4">
                                    <p className="text-xs text-neutral-700">{act.action}</p>
                                    <p className="text-[10px] text-neutral-400 mt-0.5 flex items-center gap-1"><Clock size={8} />{act.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
