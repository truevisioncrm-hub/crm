"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Download, Phone, MessageSquare, MapPin, IndianRupee, ChevronRight, Users, LayoutGrid, Columns3, GripVertical, UserPlus, Check, X } from "lucide-react";
import Link from "next/link";

interface Lead {
    id: number;
    name: string;
    source: string;
    budget: string;
    status: string;
    date: string;
    priority: string;
    phone: string;
    location: string;
    agent: string;
    type: string;
}

const AGENTS = [
    { name: "Arjun Mehta", avatar: "AM", color: "bg-blue-500" },
    { name: "Priya Singh", avatar: "PS", color: "bg-pink-500" },
    { name: "Rahul Kumar", avatar: "RK", color: "bg-amber-500" },
    { name: "Sneha Patel", avatar: "SP", color: "bg-emerald-500" },
    { name: "Vikash Jain", avatar: "VJ", color: "bg-violet-500" },
];

const INITIAL_LEADS: Lead[] = [
    { id: 1, name: "Ahmed Khan", source: "Facebook", budget: "₹1.5 Cr", status: "New Lead", date: "Just now", priority: "High", phone: "+91 98765 43210", location: "Whitefield", agent: "Arjun Mehta", type: "2BHK" },
    { id: 2, name: "Sara Mirza", source: "Website", budget: "₹85 L", status: "Contacted", date: "2h ago", priority: "Medium", phone: "+91 87654 32109", location: "Koramangala", agent: "Priya Singh", type: "3BHK" },
    { id: 3, name: "Ravi Patel", source: "Referral", budget: "₹2.2 Cr", status: "Site Visit", date: "5h ago", priority: "High", phone: "+91 76543 21098", location: "HSR Layout", agent: "Arjun Mehta", type: "2BHK" },
    { id: 4, name: "Priya K.", source: "99acres", budget: "₹65 L", status: "Negotiation", date: "1d ago", priority: "Low", phone: "+91 65432 10987", location: "Indiranagar", agent: "Rahul Kumar", type: "2BHK" },
    { id: 5, name: "Mohan Singh", source: "Walk-in", budget: "₹1.1 Cr", status: "Closed Won", date: "2d ago", priority: "Medium", phone: "+91 54321 09876", location: "Electronic City", agent: "Sneha Patel", type: "3BHK" },
    { id: 6, name: "Anjali Rao", source: "Facebook", budget: "₹90 L", status: "New Lead", date: "2d ago", priority: "High", phone: "+91 43210 98765", location: "Marathahalli", agent: "Arjun Mehta", type: "2BHK" },
    { id: 7, name: "David John", source: "Website", budget: "₹1.8 Cr", status: "Follow-up", date: "3d ago", priority: "Medium", phone: "+91 32109 87654", location: "Whitefield", agent: "Priya Singh", type: "4BHK" },
    { id: 8, name: "Neha R.", source: "99acres", budget: "₹95 L", status: "New Lead", date: "4d ago", priority: "Low", phone: "+91 21098 76543", location: "HSR Layout", agent: "Rahul Kumar", type: "3BHK" },
    { id: 9, name: "Vikram S.", source: "Walk-in", budget: "₹1.3 Cr", status: "Contacted", date: "4d ago", priority: "High", phone: "+91 10987 65432", location: "Koramangala", agent: "Sneha Patel", type: "3BHK" },
    { id: 10, name: "Fatima B.", source: "Facebook", budget: "₹75 L", status: "Site Visit", date: "5d ago", priority: "Medium", phone: "+91 09876 54321", location: "Whitefield", agent: "Arjun Mehta", type: "2BHK" },
];

const statusStyles: Record<string, string> = {
    "New Lead": "bg-blue-50 text-blue-600 border-blue-100",
    "Contacted": "bg-amber-50 text-amber-600 border-amber-100",
    "Site Visit": "bg-violet-50 text-violet-600 border-violet-100",
    "Negotiation": "bg-pink-50 text-pink-600 border-pink-100",
    "Closed Won": "bg-emerald-50 text-emerald-600 border-emerald-100",
    "Follow-up": "bg-cyan-50 text-cyan-600 border-cyan-100",
};

const columnColors: Record<string, { header: string; dot: string; count: string; dropBg: string }> = {
    "New Lead": { header: "text-blue-700", dot: "bg-blue-500", count: "bg-blue-100 text-blue-700", dropBg: "bg-blue-50 border-blue-300" },
    "Contacted": { header: "text-amber-700", dot: "bg-amber-500", count: "bg-amber-100 text-amber-700", dropBg: "bg-amber-50 border-amber-300" },
    "Site Visit": { header: "text-violet-700", dot: "bg-violet-500", count: "bg-violet-100 text-violet-700", dropBg: "bg-violet-50 border-violet-300" },
    "Negotiation": { header: "text-pink-700", dot: "bg-pink-500", count: "bg-pink-100 text-pink-700", dropBg: "bg-pink-50 border-pink-300" },
    "Closed Won": { header: "text-emerald-700", dot: "bg-emerald-500", count: "bg-emerald-100 text-emerald-700", dropBg: "bg-emerald-50 border-emerald-300" },
    "Follow-up": { header: "text-cyan-700", dot: "bg-cyan-500", count: "bg-cyan-100 text-cyan-700", dropBg: "bg-cyan-50 border-cyan-300" },
};

const priorityDot: Record<string, string> = {
    High: "bg-red-500",
    Medium: "bg-amber-400",
    Low: "bg-neutral-300",
};

const sourceIcon: Record<string, string> = {
    Facebook: "🔵",
    Website: "🌐",
    Referral: "🤝",
    "99acres": "🏠",
    "Walk-in": "🚶",
};

const KANBAN_COLUMNS = ["New Lead", "Contacted", "Site Visit", "Negotiation", "Closed Won", "Follow-up"];

// ─── Agent Picker Dropdown ──────────────────────────────────
function AgentPicker({ currentAgent, onAssign, compact = false }: { currentAgent: string; onAssign: (agent: string) => void; compact?: boolean }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const agentInfo = AGENTS.find((a) => a.name === currentAgent);

    useEffect(() => {
        if (!open) return;
        const close = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, [open]);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(!open); }}
                className={`flex items-center gap-1.5 rounded-lg transition-all ${compact
                    ? "px-1.5 py-1 hover:bg-amber-50 text-[10px]"
                    : "px-2 py-1 hover:bg-amber-50 text-xs"
                    } ${open ? "bg-amber-50 ring-1 ring-amber-200" : ""}`}
                title="Assign agent"
            >
                {agentInfo ? (
                    <div className={`${compact ? "w-4 h-4 text-[7px]" : "w-5 h-5 text-[8px]"} rounded-full ${agentInfo.color} text-white flex items-center justify-center font-bold`}>
                        {agentInfo.avatar}
                    </div>
                ) : (
                    <UserPlus size={compact ? 10 : 12} className="text-amber-500" />
                )}
                <span className="text-neutral-600 truncate max-w-[80px]">{currentAgent || "Unassigned"}</span>
            </button>

            {open && (
                <div className="absolute z-50 top-full left-0 mt-1 w-52 bg-white rounded-xl border border-neutral-200 shadow-xl py-1.5 animate-fade-in">
                    <p className="px-3 py-1.5 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Assign to Agent</p>
                    {AGENTS.map((agent) => (
                        <button
                            key={agent.name}
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAssign(agent.name); setOpen(false); }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-neutral-50 transition-colors ${agent.name === currentAgent ? "bg-primary/5" : ""}`}
                        >
                            <div className={`w-6 h-6 rounded-full ${agent.color} text-white flex items-center justify-center text-[9px] font-bold`}>
                                {agent.avatar}
                            </div>
                            <span className="text-xs font-medium text-neutral-800 flex-1">{agent.name}</span>
                            {agent.name === currentAgent && <Check size={14} className="text-primary" />}
                        </button>
                    ))}
                    {currentAgent && (
                        <>
                            <div className="border-t border-neutral-100 my-1" />
                            <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAssign(""); setOpen(false); }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-red-50 transition-colors text-red-500"
                            >
                                <X size={14} />
                                <span className="text-xs font-medium">Unassign</span>
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── Lead Card (Grid View) ──────────────────────────────────
function LeadCard({ lead, onAssignAgent }: { lead: Lead; onAssignAgent: (leadId: number, agent: string) => void }) {
    return (
        <Link
            href={`/admin/leads/${lead.id}`}
            className="group bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 cursor-pointer relative overflow-hidden block"
        >
            <div className={`absolute top-0 left-0 right-0 h-1 ${priorityDot[lead.priority]} opacity-60 rounded-t-2xl`} />
            <div className="flex items-start justify-between mb-4 pt-1">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 text-sm rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center font-bold text-primary border border-primary/10">
                        {lead.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-neutral-900 group-hover:text-primary transition-colors">{lead.name}</h3>
                        <p className="text-[10px] text-neutral-400 mt-0.5">ID #{1000 + lead.id}</p>
                    </div>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${statusStyles[lead.status] || "bg-neutral-50 text-neutral-600 border-neutral-100"}`}>
                    {lead.status}
                </span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2">
                    <IndianRupee size={13} className="text-emerald-500 shrink-0" />
                    <span className="text-xs font-semibold text-neutral-800 truncate">{lead.budget}</span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-violet-500 shrink-0" />
                    <span className="text-xs text-neutral-500 truncate">{lead.location}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs shrink-0">{sourceIcon[lead.source] || "📋"}</span>
                    <span className="text-xs text-neutral-500 truncate">{lead.source}</span>
                </div>
                {/* Agent Picker (clickable) */}
                <div onClick={(e) => e.preventDefault()}>
                    <AgentPicker currentAgent={lead.agent} onAssign={(agent) => onAssignAgent(lead.id, agent)} />
                </div>
            </div>
            <div className="border-t border-neutral-100 -mx-5 mb-3" />
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1" onClick={(e) => e.preventDefault()}>
                    <button className="p-1.5 rounded-lg text-neutral-300 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                        <Phone size={14} />
                    </button>
                    <button className="p-1.5 rounded-lg text-neutral-300 hover:text-primary hover:bg-primary/5 transition-colors">
                        <MessageSquare size={14} />
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-neutral-400">{lead.date}</span>
                    <ChevronRight size={12} className="text-neutral-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
            </div>
        </Link>
    );
}

// ─── Draggable Kanban Card ──────────────────────────────────
function DraggableCard({ lead, onAssignAgent }: { lead: Lead; onAssignAgent: (leadId: number, agent: string) => void }) {
    return (
        <div
            draggable
            onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", String(lead.id));
                e.dataTransfer.effectAllowed = "move";
                const el = e.currentTarget;
                requestAnimationFrame(() => { el.style.opacity = "0.4"; });
            }}
            onDragEnd={(e) => {
                e.currentTarget.style.opacity = "1";
            }}
            className="group bg-white rounded-2xl border border-neutral-100 p-4 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-200 cursor-grab active:cursor-grabbing active:shadow-xl active:scale-[1.02] relative overflow-hidden select-none"
        >
            {/* Priority bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${priorityDot[lead.priority]} opacity-60 rounded-t-2xl`} />

            {/* Drag handle + Header */}
            <div className="flex items-start gap-2 mb-3 pt-1">
                <GripVertical size={14} className="text-neutral-300 shrink-0 mt-0.5 group-hover:text-neutral-500 transition-colors" />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 text-xs rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center font-bold text-primary border border-primary/10 shrink-0">
                            {lead.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-xs font-bold text-neutral-900 truncate">{lead.name}</h3>
                            <p className="text-[9px] text-neutral-400">#{1000 + lead.id}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className="space-y-1.5 mb-3 pl-5">
                <div className="flex items-center gap-2">
                    <IndianRupee size={11} className="text-emerald-500 shrink-0" />
                    <span className="text-[11px] font-semibold text-neutral-800 truncate">{lead.budget}</span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin size={11} className="text-violet-500 shrink-0" />
                    <span className="text-[11px] text-neutral-500 truncate">{lead.location}</span>
                </div>
                {/* Agent Picker */}
                <AgentPicker compact currentAgent={lead.agent} onAssign={(agent) => onAssignAgent(lead.id, agent)} />
            </div>

            {/* Footer */}
            <div className="border-t border-neutral-100 -mx-4 mb-2" />
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <button onClick={(e) => e.stopPropagation()} className="p-1 rounded-md text-neutral-300 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                        <Phone size={11} />
                    </button>
                    <button onClick={(e) => e.stopPropagation()} className="p-1 rounded-md text-neutral-300 hover:text-primary hover:bg-primary/5 transition-colors">
                        <MessageSquare size={11} />
                    </button>
                </div>
                <Link
                    href={`/admin/leads/${lead.id}`}
                    onClick={(e) => e.stopPropagation()}
                    draggable={false}
                    className="text-[9px] text-neutral-400 hover:text-primary flex items-center gap-1 transition-colors"
                >
                    View <ChevronRight size={10} />
                </Link>
            </div>
        </div>
    );
}

// ─── Kanban Column ──────────────────────────────────────────
function KanbanColumn({
    status,
    leads,
    isOver,
    onDragOver,
    onDragLeave,
    onDrop,
    onAssignAgent,
}: {
    status: string;
    leads: Lead[];
    isOver: boolean;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragLeave: () => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    onAssignAgent: (leadId: number, agent: string) => void;
}) {
    const colors = columnColors[status] || { header: "text-neutral-700", dot: "bg-neutral-400", count: "bg-neutral-100 text-neutral-700", dropBg: "bg-neutral-50 border-neutral-300" };

    return (
        <div className="flex flex-col min-w-[280px] max-w-[320px] flex-1">
            <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
                    <h3 className={`text-sm font-bold ${colors.header}`}>{status}</h3>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${colors.count}`}>
                    {leads.length}
                </span>
            </div>
            <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={`flex-1 rounded-2xl border-2 border-dashed p-3 space-y-3 min-h-[400px] transition-all duration-200 ${isOver ? `${colors.dropBg} scale-[1.01]` : "bg-neutral-50/50 border-neutral-100"}`}
            >
                {leads.length === 0 && (
                    <div className={`flex flex-col items-center justify-center h-32 text-xs transition-colors ${isOver ? "text-neutral-600 font-medium" : "text-neutral-400"}`}>
                        {isOver ? "Drop here ✓" : "No leads"}
                    </div>
                )}
                {leads.map((lead) => (
                    <DraggableCard key={lead.id} lead={lead} onAssignAgent={onAssignAgent} />
                ))}
            </div>
        </div>
    );
}

// ─── Main Page ──────────────────────────────────────────────
export default function LeadsPage() {
    const [view, setView] = useState<"cards" | "board">("cards");
    const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
    const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetStatus: string) => {
        e.preventDefault();
        setDragOverColumn(null);
        const raw = e.dataTransfer.getData("text/plain");
        if (!raw) return;
        const leadId = Number(raw);
        if (Number.isNaN(leadId)) return;
        setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: targetStatus } : l)));
    };

    const handleAssignAgent = (leadId: number, agent: string) => {
        setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, agent } : l)));
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Leads</h1>
                    <p className="text-sm text-neutral-500 mt-1">Track and manage your potential customers</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm font-semibold hover:bg-neutral-50 transition-colors shadow-sm">
                        <Download size={16} /> Export
                    </button>
                    <button className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25">
                        + Add Lead
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: "Total Leads", value: leads.length.toString(), change: "+12%", color: "text-primary" },
                    { label: "New Leads", value: leads.filter((l) => l.status === "New Lead").length.toString(), change: "+8%", color: "text-blue-600" },
                    { label: "Site Visits", value: leads.filter((l) => l.status === "Site Visit").length.toString(), change: "+22%", color: "text-violet-600" },
                    { label: "Closed Won", value: leads.filter((l) => l.status === "Closed Won").length.toString(), change: "+5%", color: "text-emerald-600" },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
                        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">{stat.label}</p>
                        <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                        <span className="text-xs text-emerald-500 font-medium">{stat.change} this month</span>
                    </div>
                ))}
            </div>

            {/* Filters + View Toggle */}
            <div className="p-4 bg-white border border-neutral-100 rounded-2xl shadow-sm flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input type="text" placeholder="Search leads..." className="w-full pl-9 pr-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
                <div className="h-8 w-px bg-neutral-200 hidden sm:block" />
                <div className="flex bg-neutral-100 rounded-xl p-1 gap-1">
                    <button onClick={() => setView("cards")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${view === "cards" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}>
                        <LayoutGrid size={14} /> Cards
                    </button>
                    <button onClick={() => setView("board")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${view === "board" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}>
                        <Columns3 size={14} /> Board
                    </button>
                </div>
            </div>

            {/* Content */}
            {view === "cards" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {leads.map((lead) => (
                        <LeadCard key={lead.id} lead={lead} onAssignAgent={handleAssignAgent} />
                    ))}
                </div>
            ) : (
                <div className="overflow-x-auto pb-4 no-scrollbar">
                    <div className="flex gap-4 min-w-max">
                        {KANBAN_COLUMNS.map((status) => (
                            <KanbanColumn
                                key={status}
                                status={status}
                                leads={leads.filter((l) => l.status === status)}
                                isOver={dragOverColumn === status}
                                onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; setDragOverColumn(status); }}
                                onDragLeave={() => setDragOverColumn(null)}
                                onDrop={(e) => handleDrop(e, status)}
                                onAssignAgent={handleAssignAgent}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
