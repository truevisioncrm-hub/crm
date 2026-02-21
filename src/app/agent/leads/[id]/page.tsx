"use client";

import { ArrowLeft, Phone, MessageSquare, MapPin, IndianRupee, Home, Calendar, Clock, AlertCircle, FileText } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

const LEADS = [
    { id: 1, name: "Ahmed Khan", phone: "+91 98765 43210", email: "ahmed@email.com", source: "Facebook", budget: "₹10-15L", type: "2BHK", status: "New", statusColor: "bg-primary-light text-primary", progress: 10, alert: "No contact yet — respond ASAP", location: "Whitefield", date: "Feb 12, 2026" },
    { id: 2, name: "Sara Mirza", phone: "+91 87654 32109", email: "sara@email.com", source: "Website", budget: "₹20-30L", type: "3BHK", status: "Contacted", statusColor: "bg-warning-light text-warning", progress: 35, alert: "", location: "Koramangala", date: "Feb 10, 2026" },
    { id: 3, name: "Ravi Patel", phone: "+91 76543 21098", email: "ravi@email.com", source: "99acres", budget: "₹8-12L", type: "2BHK", status: "Site Visit", statusColor: "bg-info-light text-info", progress: 55, alert: "Visit scheduled today", location: "HSR Layout", date: "Feb 8, 2026" },
    { id: 4, name: "Priya Kapoor", phone: "+91 65432 10987", email: "priyak@email.com", source: "Referral", budget: "₹15-20L", type: "2BHK", status: "Negotiation", statusColor: "bg-accent-light text-accent", progress: 75, alert: "", location: "Indiranagar", date: "Feb 5, 2026" },
    { id: 5, name: "Mohan Singh", phone: "+91 54321 09876", email: "mohan@email.com", source: "WhatsApp", budget: "₹25-35L", type: "3BHK", status: "Closed Won", statusColor: "bg-success-light text-success", progress: 100, alert: "", location: "Electronic City", date: "Feb 2, 2026" },
];

const ACTIVITY = [
    { action: "Lead assigned to you", time: "3 days ago", type: "primary" },
    { action: "First call attempted — no answer", time: "2 days ago", type: "warning" },
    { action: "Follow-up call — client interested in 2BHK Whitefield", time: "1 day ago", type: "success" },
    { action: "Site visit scheduled at Prestige Lakeside", time: "5 hours ago", type: "info" },
];

const NOTES = [
    { text: "Client prefers east-facing flat with good ventilation. Budget is slightly flexible for a gated community.", time: "1 day ago" },
    { text: "Sent Prestige Lakeside brochure via WhatsApp. Client confirmed receipt.", time: "2 days ago" },
];

const SITE_VISITS = [
    { property: "Prestige Lakeside Villa", location: "Whitefield", date: "Tomorrow, 3:00 PM", status: "Scheduled" },
];

const progressColor = (p: number) => p < 30 ? "bg-primary" : p < 60 ? "bg-warning" : p < 100 ? "bg-accent" : "bg-success";
const activityDot: Record<string, string> = { success: "bg-success", info: "bg-info", warning: "bg-warning", primary: "bg-primary" };

export default function AgentLeadDetailPage() {
    const router = useRouter();
    const params = useParams();
    const lead = LEADS.find((l) => l.id === Number(params.id)) || LEADS[0];

    return (
        <div className="space-y-6 animate-fade-in">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-xs text-neutral-400 hover:text-neutral-800 transition-colors">
                <ArrowLeft size={14} /> Back to My Leads
            </button>

            <div className="p-5 card-shadow" style={{ background: "#FFFFFF", border: "1px solid var(--card-border)" }}>
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-lg font-bold text-neutral-900">{lead.name}</h1>
                            <span className={`px-2 py-0.5 text-[10px] font-bold ${lead.statusColor}`}>{lead.status}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 flex-wrap">
                            <span className="text-xs text-neutral-500 flex items-center gap-1"><Phone size={11} />{lead.phone}</span>
                            <span className="text-xs text-neutral-500 flex items-center gap-1"><MessageSquare size={11} />{lead.email}</span>
                            <span className="text-xs text-neutral-500 flex items-center gap-1"><MapPin size={11} />{lead.location}</span>
                            <span className="text-xs text-neutral-400 flex items-center gap-1"><Calendar size={11} />{lead.date}</span>
                        </div>
                        {lead.alert && (
                            <div className="flex items-center gap-1.5 mt-3 text-xs text-danger font-medium">
                                <AlertCircle size={12} />{lead.alert}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-white bg-success hover:opacity-90 transition-opacity">
                            <Phone size={14} /> Call
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-white bg-primary hover:opacity-90 transition-opacity">
                            <MessageSquare size={14} /> Message
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Budget", value: lead.budget, icon: IndianRupee, color: "text-success" },
                    { label: "Property Type", value: lead.type, icon: Home, color: "text-primary" },
                    { label: "Source", value: lead.source, icon: FileText, color: "text-info" },
                    { label: "Progress", value: `${lead.progress}%`, icon: Clock, color: "text-accent" },
                ].map((info) => {
                    const Icon = info.icon;
                    return (
                        <div key={info.label} className="p-5 card-shadow" style={{ background: "#FFFFFF", border: "1px solid var(--card-border)" }}>
                            <Icon size={16} className={`${info.color} mb-2`} strokeWidth={1.5} />
                            <p className="text-sm font-bold text-neutral-900">{info.value}</p>
                            <p className="text-[10px] text-neutral-400 uppercase tracking-wider mt-0.5">{info.label}</p>
                        </div>
                    );
                })}
            </div>

            <div className="p-4 card-shadow" style={{ background: "#FFFFFF", border: "1px solid var(--card-border)" }}>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Lead Progress</span>
                    <span className="text-xs font-bold text-neutral-800">{lead.progress}%</span>
                </div>
                <div className="h-2 w-full bg-neutral-100">
                    <div className={`h-full ${progressColor(lead.progress)} opacity-60 transition-all`} style={{ width: `${lead.progress}%` }} />
                </div>
                <div className="flex items-center justify-between mt-2">
                    {["New", "Contacted", "Site Visit", "Negotiation", "Closed"].map((stage) => (
                        <span key={stage} className="text-[9px] text-neutral-400">{stage}</span>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2 p-5 card-shadow" style={{ background: "#FFFFFF", border: "1px solid var(--card-border)" }}>
                    <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4">Activity Timeline</h3>
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

                <div className="lg:col-span-3 p-5 space-y-6 card-shadow" style={{ background: "#FFFFFF", border: "1px solid var(--card-border)" }}>
                    <div>
                        <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4">Notes</h3>
                        <div className="space-y-3">
                            {NOTES.map((note, i) => (
                                <div key={i} className="p-3 bg-neutral-50" style={{ border: "1px solid var(--card-border)" }}>
                                    <p className="text-xs text-neutral-700 leading-relaxed">{note.text}</p>
                                    <p className="text-[10px] text-neutral-400 mt-2">{note.time}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4">Site Visits</h3>
                        <div className="space-y-2">
                            {SITE_VISITS.map((visit, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-neutral-50" style={{ border: "1px solid var(--card-border)" }}>
                                    <div>
                                        <p className="text-xs font-medium text-neutral-800">{visit.property}</p>
                                        <p className="text-[10px] text-neutral-400 mt-0.5 flex items-center gap-1"><MapPin size={8} />{visit.location}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-neutral-400">{visit.date}</p>
                                        <span className="text-[10px] font-bold text-success">{visit.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
