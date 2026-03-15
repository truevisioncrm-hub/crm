"use client";

import { useState, useEffect } from "react";
import { MapPin, Calendar, Clock, Phone, Navigation, CheckCircle2, XCircle, PlayCircle, CalendarClock, LayoutGrid, Columns3, User, Home, MessageSquare, GripVertical, Loader2, Plus, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface Agent {
    id: string;
    name: string;
    avatar_url: string | null;
}

interface Lead {
    id: number;
    name: string;
    phone: string;
    location: string;
    property_type: string;
}

interface Visit {
    id: number;
    target_location: string;
    scheduled_at: string;
    status: string;
    notes: string | null;
    agent_id: string | null;
    lead_id: number | null;
    users?: Agent | null;
    leads?: Lead | null;
}

const KANBAN_COLUMNS = ["Pending", "In Progress", "Completed", "Cancelled", "Rescheduled"];

const columnConfig: Record<string, { dot: string; count: string; header: string; dropBg: string; cardAccent: string }> = {
    Pending: { dot: "bg-blue-500", count: "bg-blue-100 text-blue-700", header: "text-blue-700", dropBg: "bg-blue-50 border-blue-300", cardAccent: "border-l-blue-500" },
    "In Progress": { dot: "bg-amber-500", count: "bg-amber-100 text-amber-700", header: "text-amber-700", dropBg: "bg-amber-50 border-amber-300", cardAccent: "border-l-amber-500" },
    Completed: { dot: "bg-emerald-500", count: "bg-emerald-100 text-emerald-700", header: "text-emerald-700", dropBg: "bg-emerald-50 border-emerald-300", cardAccent: "border-l-emerald-500" },
    Cancelled: { dot: "bg-red-500", count: "bg-red-100 text-red-700", header: "text-red-700", dropBg: "bg-red-50 border-red-300", cardAccent: "border-l-red-400" },
    Rescheduled: { dot: "bg-violet-500", count: "bg-violet-100 text-violet-700", header: "text-violet-700", dropBg: "bg-violet-50 border-violet-300", cardAccent: "border-l-violet-500" },
};

const statusBadge: Record<string, string> = {
    Pending: "bg-blue-50 text-blue-600 border-blue-100",
    "In Progress": "bg-amber-50 text-amber-600 border-amber-100",
    Completed: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Cancelled: "bg-red-50 text-red-600 border-red-100",
    Rescheduled: "bg-violet-50 text-violet-600 border-violet-100",
};

const statusIcon: Record<string, React.ReactNode> = {
    Pending: <CalendarClock size={12} />,
    "In Progress": <PlayCircle size={12} />,
    Completed: <CheckCircle2 size={12} />,
    Cancelled: <XCircle size={12} />,
    Rescheduled: <Calendar size={12} />,
};

function formatTime(isoString: string) {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(isoString: string) {
    return new Date(isoString).toLocaleDateString([], { month: 'short', day: 'numeric' });
}

// ─── Visit Card (Grid View) ────────────────────────────────
function VisitCard({ visit }: { visit: Visit }) {
    const clientName = visit.leads?.name || "Unknown Client";
    const clientPhone = visit.leads?.phone || "No Phone";
    const propertyType = visit.leads?.property_type || "Property";
    const location = visit.leads?.location || "Unknown Area";

    return (
        <div className="group bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 relative overflow-hidden flex flex-col h-full">
            {/* Status accent */}
            <div className={`absolute top-0 left-0 bottom-0 w-1 rounded-l-2xl ${columnConfig[visit.status]?.dot || "bg-neutral-300"}`} />

            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-sm font-bold text-primary border border-primary/10 shrink-0">
                        {clientName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-sm font-bold text-neutral-900 truncate">{clientName}</h3>
                        <p className="text-[10px] text-neutral-400 mt-0.5">{clientPhone}</p>
                    </div>
                </div>
                <span className={`inline-flex shrink-0 items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${statusBadge[visit.status] || "bg-neutral-50 text-neutral-600 border-neutral-100"}`}>
                    {statusIcon[visit.status]} {visit.status}
                </span>
            </div>

            <div className="space-y-2 mb-4 flex-1">
                <div className="flex items-center gap-2">
                    <Home size={13} className="text-primary shrink-0" />
                    <span className="text-xs font-semibold text-neutral-800 truncate" title={visit.target_location}>{visit.target_location}</span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-violet-500 shrink-0" />
                    <span className="text-xs text-neutral-500 truncate">{location}</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-neutral-400 shrink-0" />
                        <span className="text-xs text-neutral-500">{formatDate(visit.scheduled_at)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-neutral-400 shrink-0" />
                        <span className="text-xs text-neutral-500">{formatTime(visit.scheduled_at)}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <User size={13} className="text-amber-500 shrink-0" />
                    <span className="text-xs text-neutral-500 truncate">{visit.users?.name || "Unassigned"}</span>
                </div>
            </div>

            {visit.notes && (
                <div className="px-3 py-2 bg-neutral-50 rounded-lg border border-neutral-100 mb-3">
                    <p className="text-[10px] text-neutral-500 italic line-clamp-2">&quot;{visit.notes}&quot;</p>
                </div>
            )}

            <div className="border-t border-neutral-100 -mx-5 mb-3" />
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <a href={`tel:${clientPhone}`} className="p-1.5 rounded-lg text-neutral-300 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                        <Phone size={14} />
                    </a>
                    <a href={`https://maps.google.com/?q=${encodeURIComponent(visit.target_location + ' ' + location)}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-neutral-300 hover:text-blue-500 hover:bg-blue-50 transition-colors" title="Open in Google Maps">
                        <Navigation size={14} />
                    </a>
                </div>
                <span className="text-[10px] text-neutral-400">{propertyType}</span>
            </div>
        </div>
    );
}

// ─── Draggable Visit Card (Kanban) ──────────────────────────
function DraggableVisitCard({ visit }: { visit: Visit }) {
    const clientName = visit.leads?.name || "Unknown Client";
    const clientPhone = visit.leads?.phone || "No Phone";
    const location = visit.leads?.location || "Unknown Area";

    return (
        <div
            draggable
            onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", String(visit.id));
                e.dataTransfer.effectAllowed = "move";
                const el = e.currentTarget;
                requestAnimationFrame(() => { el.style.opacity = "0.4"; });
            }}
            onDragEnd={(e) => { e.currentTarget.style.opacity = "1"; }}
            className={`group bg-white rounded-2xl border border-neutral-100 border-l-4 ${columnConfig[visit.status]?.cardAccent || ""} p-4 shadow-sm hover:shadow-lg transition-all duration-200 cursor-grab active:cursor-grabbing active:shadow-xl active:scale-[1.02] relative select-none`}
        >
            {/* Header */}
            <div className="flex items-start gap-2 mb-3">
                <GripVertical size={14} className="text-neutral-300 shrink-0 mt-0.5 group-hover:text-neutral-500 transition-colors" />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 text-[10px] rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center font-bold text-primary border border-primary/10 shrink-0">
                                {clientName.charAt(0)}
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-xs font-bold text-neutral-900 truncate">{clientName}</h3>
                                <p className="text-[9px] text-neutral-400 truncate">{clientPhone}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Property */}
            <div className="space-y-1.5 mb-3 pl-5">
                <div className="flex items-center gap-1.5">
                    <Home size={11} className="text-primary shrink-0" />
                    <span className="text-[11px] font-semibold text-neutral-800 truncate" title={visit.target_location}>{visit.target_location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <MapPin size={11} className="text-violet-500 shrink-0" />
                    <span className="text-[11px] text-neutral-500 truncate">{location}</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                        <Calendar size={10} className="text-neutral-400 shrink-0" />
                        <span className="text-[10px] text-neutral-500">{formatDate(visit.scheduled_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock size={10} className="text-neutral-400 shrink-0" />
                        <span className="text-[10px] text-neutral-500">{formatTime(visit.scheduled_at)}</span>
                    </div>
                </div>
            </div>

            {/* Agent */}
            <div className="pl-5 mb-3">
                <div className="flex items-center gap-1.5">
                    <User size={10} className="text-amber-500 shrink-0" />
                    <span className="text-[10px] text-neutral-500 truncate">{visit.users?.name || "Unassigned"}</span>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-neutral-100 -mx-4 mb-2" />
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <a href={`tel:${clientPhone}`} onClick={(e) => e.stopPropagation()} className="p-1 rounded-md text-neutral-300 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                        <Phone size={11} />
                    </a>
                    <a href={`https://maps.google.com/?q=${encodeURIComponent(visit.target_location + ' ' + location)}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="p-1 rounded-md text-neutral-300 hover:text-blue-500 hover:bg-blue-50 transition-colors" title="Open in Google Maps">
                        <Navigation size={11} />
                    </a>
                </div>
                <span className="text-[9px] text-neutral-400">{visit.leads?.property_type || "N/A"}</span>
            </div>
        </div>
    );
}

// ─── Kanban Column ──────────────────────────────────────────
function VisitColumn({
    status, visits, isOver, onDragOver, onDragLeave, onDrop,
}: {
    status: string; visits: Visit[]; isOver: boolean;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragLeave: () => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}) {
    const colors = columnConfig[status] || { dot: "bg-neutral-500", count: "bg-neutral-100 text-neutral-700", header: "text-neutral-700", dropBg: "bg-neutral-50 border-neutral-300", cardAccent: "border-l-neutral-300" };

    return (
        <div className="flex flex-col min-w-[280px] max-w-[320px] flex-1">
            <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
                    <h3 className={`text-sm font-bold ${colors.header}`}>{status}</h3>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${colors.count}`}>
                    {visits.length}
                </span>
            </div>
            <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={`flex-1 rounded-2xl border-2 border-dashed p-3 space-y-3 min-h-[400px] transition-all duration-200 ${isOver ? `${colors.dropBg} scale-[1.01]` : "bg-neutral-50/50 border-neutral-100"}`}
            >
                {visits.length === 0 && (
                    <div className={`flex flex-col items-center justify-center h-32 text-xs transition-colors ${isOver ? "text-neutral-600 font-medium" : "text-neutral-400"}`}>
                        {isOver ? "Drop here ✓" : "No visits"}
                    </div>
                )}
                {visits.map((visit) => (
                    <DraggableVisitCard key={visit.id} visit={visit} />
                ))}
            </div>
        </div>
    );
}

// ─── Main Page ──────────────────────────────────────────────
export default function VisitsPage() {
    const [view, setView] = useState<"cards" | "board">("board");
    const [visits, setVisits] = useState<Visit[]>([]);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);

        try {
            const response = await fetch('/api/admin/visits');
            const data = await response.json();
            if (data.error) throw new Error(data.error);

            if (data.agents) setAgents(data.agents);
            if (data.leads) setLeads(data.leads);
            if (data.visits) setVisits(data.visits);
        } catch (err: any) {
            console.error("Fetch Data Error:", err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>, targetStatus: string) => {
        e.preventDefault();
        setDragOverColumn(null);
        const raw = e.dataTransfer.getData("text/plain");
        if (!raw) return;
        const visitId = Number(raw);
        if (Number.isNaN(visitId)) return;

        // Optimistic UI Update
        const previousVisits = [...visits];
        setVisits((prev) => prev.map((v) => (v.id === visitId ? { ...v, status: targetStatus } : v)));

        try {
            const response = await fetch('/api/admin/visits', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: visitId, status: targetStatus }),
            });
            const result = await response.json();
            if (result.error) throw new Error(result.error);
        } catch (err: any) {
            console.error("Failed to update status", err.message);
            setVisits(previousVisits); // Revert
        }
    };

    const handleAddVisit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);

        const dateRaw = formData.get("date") as string;
        const timeRaw = formData.get("time") as string;

        // Combine date & time
        let scheduledAt = new Date().toISOString();
        if (dateRaw && timeRaw) {
            scheduledAt = new Date(`${dateRaw}T${timeRaw}`).toISOString();
        }

        const newVisit = {
            target_location: formData.get("target_location") as string,
            scheduled_at: scheduledAt,
            status: "Pending", // Default Enum value
            notes: formData.get("notes") as string,
            agent_id: formData.get("agent_id") as string || null,
            lead_id: Number(formData.get("lead_id")) || null,
        };

        try {
            const response = await fetch('/api/admin/visits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newVisit),
            });
            const data = await response.json();

            if (data.error) throw new Error(data.error);

            setVisits([...visits, data as unknown as Visit]);
            setIsModalOpen(false);
            e.currentTarget.reset();
        } catch (err: any) {
            console.error(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Site Visits</h1>
                    <p className="text-sm text-neutral-500 mt-1">Schedule, track and manage property visits</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setIsModalOpen(true)} className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25 flex items-center gap-2">
                        <Plus size={18} /> Schedule Visit
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : (
                <>
                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                        {KANBAN_COLUMNS.map((col) => {
                            const count = visits.filter((v) => v.status === col).length;
                            const colors = columnConfig[col] || { dot: "bg-neutral-500", header: "text-neutral-700" };
                            return (
                                <div key={col} className="bg-white rounded-2xl border border-neutral-100 p-4 shadow-sm">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                                        <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">{col}</p>
                                    </div>
                                    <p className={`text-2xl font-bold ${colors.header}`}>{count}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Filters + View Toggle */}
                    <div className="p-4 bg-white border border-neutral-100 rounded-2xl shadow-sm flex flex-wrap items-center gap-4">
                        <div className="relative flex-1 min-w-[200px]">
                            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <input type="text" placeholder="Search visits by client, property, agent..." className="w-full pl-9 pr-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
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
                            {visits.map((visit) => (
                                <VisitCard key={visit.id} visit={visit} />
                            ))}
                            {visits.length === 0 && (
                                <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-neutral-100">
                                    <p className="text-neutral-500">No visits scheduled.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto pb-4 no-scrollbar">
                            <div className="flex gap-4 min-w-max">
                                {KANBAN_COLUMNS.map((status) => (
                                    <VisitColumn
                                        key={status}
                                        status={status}
                                        visits={visits.filter((v) => v.status === status)}
                                        isOver={dragOverColumn === status}
                                        onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; setDragOverColumn(status); }}
                                        onDragLeave={() => setDragOverColumn(null)}
                                        onDrop={(e) => handleDrop(e, status)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Schedule Visit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-6 border-b border-neutral-100 shrink-0">
                            <div>
                                <h3 className="text-xl font-bold text-neutral-900">Schedule Visit</h3>
                                <p className="text-sm text-neutral-500 mt-1">Assign a property visit to an agent.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                            <form id="schedule-visit-form" onSubmit={handleAddVisit} className="space-y-5">
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-neutral-700">Client / Lead *</label>
                                        <select required name="lead_id" className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer">
                                            <option value="">-- Select a Lead --</option>
                                            {leads.map(lead => <option key={lead.id} value={lead.id}>{lead.name} ({lead.property_type})</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-neutral-700">Property / Target Location *</label>
                                        <input required name="target_location" type="text" placeholder="e.g. Prestige Lakeside Villa" className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-neutral-700">Date *</label>
                                            <input required name="date" type="date" className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-neutral-700">Time *</label>
                                            <input required name="time" type="time" className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-neutral-700">Assign to Agent</label>
                                        <select name="agent_id" className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer">
                                            <option value="">-- Unassigned --</option>
                                            {agents.map(agent => <option key={agent.id} value={agent.id}>{agent.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-neutral-700">Internal Notes</label>
                                        <textarea name="notes" rows={2} placeholder="Any specific instructions for the agent..." className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all custom-scrollbar resize-none"></textarea>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="p-6 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-neutral-600 hover:bg-neutral-200 transition-colors">
                                Cancel
                            </button>
                            <button type="submit" form="schedule-visit-form" disabled={isSubmitting} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                                {isSubmitting ? (
                                    <><Loader2 size={16} className="animate-spin" /> Saving...</>
                                ) : (
                                    "Confirm Visit"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
