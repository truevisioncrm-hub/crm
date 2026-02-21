"use client";

import { useState } from "react";
import { MapPin, Calendar, Clock, Phone, Navigation, MoreVertical, CheckCircle2, XCircle, PlayCircle, CalendarClock, LayoutGrid, Columns3, User, Home, MessageSquare, GripVertical } from "lucide-react";

interface Visit {
    id: number;
    client: string;
    property: string;
    location: string;
    time: string;
    date: string;
    status: string;
    agent: string;
    phone: string;
    type: string;
    notes: string;
}

const INITIAL_VISITS: Visit[] = [
    { id: 1, client: "Ravi Patel", property: "Prestige Lakeside Villa", location: "Whitefield", time: "10:00 AM", date: "Feb 18", status: "Scheduled", agent: "Arjun Mehta", phone: "+91 76543 21098", type: "2BHK Villa", notes: "Client prefers east-facing" },
    { id: 2, client: "Sara Mirza", property: "Brigade Panorama", location: "Koramangala", time: "2:30 PM", date: "Feb 18", status: "Upcoming", agent: "Priya Singh", phone: "+91 87654 32109", type: "3BHK Apt", notes: "Budget flexible up to ₹1.5 Cr" },
    { id: 3, client: "Mohan Singh", property: "Sobha City Heights", location: "Hebbal", time: "11:00 AM", date: "Feb 19", status: "Upcoming", agent: "Rahul Kumar", phone: "+91 54321 09876", type: "Penthouse", notes: "Second visit, very interested" },
    { id: 4, client: "Anjali Rao", property: "Godrej Woods", location: "Sarjapur", time: "4:00 PM", date: "Feb 19", status: "Scheduled", agent: "Sneha Patel", phone: "+91 43210 98765", type: "2BHK Apt", notes: "First-time buyer" },
    { id: 5, client: "Ahmed Khan", property: "Embassy One", location: "Indiranagar", time: "10:30 AM", date: "Feb 17", status: "Ongoing", agent: "Arjun Mehta", phone: "+91 98765 43210", type: "5BHK Villa", notes: "High-value client, VIP treatment" },
    { id: 6, client: "David John", property: "Prestige Golfshire", location: "Devanahalli", time: "3:00 PM", date: "Feb 17", status: "Ongoing", agent: "Priya Singh", phone: "+91 32109 87654", type: "Mansion", notes: "Bringing family along" },
    { id: 7, client: "Priya K.", property: "Brigade Panorama", location: "Koramangala", time: "11:00 AM", date: "Feb 15", status: "Succeeded", agent: "Rahul Kumar", phone: "+91 65432 10987", type: "2BHK Apt", notes: "Loved the property, moving to negotiation" },
    { id: 8, client: "Vikram S.", property: "Prestige Lakeside Villa", location: "Whitefield", time: "2:00 PM", date: "Feb 14", status: "Succeeded", agent: "Sneha Patel", phone: "+91 10987 65432", type: "Villa", notes: "Ready to book, requesting discount" },
    { id: 9, client: "Fatima B.", property: "Sobha City Heights", location: "Hebbal", time: "10:00 AM", date: "Feb 13", status: "Cancelled", agent: "Arjun Mehta", phone: "+91 09876 54321", type: "Penthouse", notes: "Client had emergency, will reschedule" },
    { id: 10, client: "Neha R.", property: "Godrej Woods", location: "Sarjapur", time: "4:30 PM", date: "Feb 12", status: "Cancelled", agent: "Rahul Kumar", phone: "+91 21098 76543", type: "3BHK Apt", notes: "Budget constraints, not interested" },
    { id: 11, client: "Meera Gupta", property: "Embassy One", location: "Indiranagar", time: "9:30 AM", date: "Feb 20", status: "Scheduled", agent: "Priya Singh", phone: "+91 99887 76655", type: "Villa", notes: "NRI client, need translator" },
    { id: 12, client: "Anil Kapoor", property: "Prestige Golfshire", location: "Devanahalli", time: "1:00 PM", date: "Feb 16", status: "Succeeded", agent: "Arjun Mehta", phone: "+91 88776 65544", type: "Mansion", notes: "Closed the deal, booking done" },
];

const KANBAN_COLUMNS = ["Upcoming", "Ongoing", "Scheduled", "Cancelled", "Succeeded"];

const columnConfig: Record<string, { dot: string; count: string; header: string; dropBg: string; cardAccent: string }> = {
    Upcoming: { dot: "bg-blue-500", count: "bg-blue-100 text-blue-700", header: "text-blue-700", dropBg: "bg-blue-50 border-blue-300", cardAccent: "border-l-blue-500" },
    Ongoing: { dot: "bg-amber-500", count: "bg-amber-100 text-amber-700", header: "text-amber-700", dropBg: "bg-amber-50 border-amber-300", cardAccent: "border-l-amber-500" },
    Scheduled: { dot: "bg-violet-500", count: "bg-violet-100 text-violet-700", header: "text-violet-700", dropBg: "bg-violet-50 border-violet-300", cardAccent: "border-l-violet-500" },
    Cancelled: { dot: "bg-red-500", count: "bg-red-100 text-red-700", header: "text-red-700", dropBg: "bg-red-50 border-red-300", cardAccent: "border-l-red-400" },
    Succeeded: { dot: "bg-emerald-500", count: "bg-emerald-100 text-emerald-700", header: "text-emerald-700", dropBg: "bg-emerald-50 border-emerald-300", cardAccent: "border-l-emerald-500" },
};

const statusBadge: Record<string, string> = {
    Upcoming: "bg-blue-50 text-blue-600 border-blue-100",
    Ongoing: "bg-amber-50 text-amber-600 border-amber-100",
    Scheduled: "bg-violet-50 text-violet-600 border-violet-100",
    Cancelled: "bg-red-50 text-red-600 border-red-100",
    Succeeded: "bg-emerald-50 text-emerald-600 border-emerald-100",
};

const statusIcon: Record<string, React.ReactNode> = {
    Upcoming: <CalendarClock size={12} />,
    Ongoing: <PlayCircle size={12} />,
    Scheduled: <Calendar size={12} />,
    Cancelled: <XCircle size={12} />,
    Succeeded: <CheckCircle2 size={12} />,
};

// ─── Visit Card (Grid View) ────────────────────────────────
function VisitCard({ visit }: { visit: Visit }) {
    return (
        <div className="group bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 relative overflow-hidden">
            {/* Status accent */}
            <div className={`absolute top-0 left-0 bottom-0 w-1 rounded-l-2xl ${columnConfig[visit.status]?.dot || "bg-neutral-300"}`} />

            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-sm font-bold text-primary border border-primary/10">
                        {visit.client.charAt(0)}
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-neutral-900">{visit.client}</h3>
                        <p className="text-[10px] text-neutral-400 mt-0.5">{visit.phone}</p>
                    </div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${statusBadge[visit.status] || "bg-neutral-50 text-neutral-600 border-neutral-100"}`}>
                    {statusIcon[visit.status]} {visit.status}
                </span>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                    <Home size={13} className="text-primary shrink-0" />
                    <span className="text-xs font-semibold text-neutral-800 truncate">{visit.property}</span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-violet-500 shrink-0" />
                    <span className="text-xs text-neutral-500">{visit.location}</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-neutral-400" />
                        <span className="text-xs text-neutral-500">{visit.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-neutral-400" />
                        <span className="text-xs text-neutral-500">{visit.time}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <User size={13} className="text-amber-500 shrink-0" />
                    <span className="text-xs text-neutral-500">{visit.agent}</span>
                </div>
            </div>

            {visit.notes && (
                <div className="px-3 py-2 bg-neutral-50 rounded-lg border border-neutral-100 mb-3">
                    <p className="text-[10px] text-neutral-500 italic">&quot;{visit.notes}&quot;</p>
                </div>
            )}

            <div className="border-t border-neutral-100 -mx-5 mb-3" />
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded-lg text-neutral-300 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                        <Phone size={14} />
                    </button>
                    <button className="p-1.5 rounded-lg text-neutral-300 hover:text-primary hover:bg-primary/5 transition-colors">
                        <MessageSquare size={14} />
                    </button>
                    <a href={`https://maps.google.com/?q=${encodeURIComponent(visit.property + ' ' + visit.location + ' Bangalore')}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-neutral-300 hover:text-blue-500 hover:bg-blue-50 transition-colors" title="Open in Google Maps">
                        <Navigation size={14} />
                    </a>
                </div>
                <span className="text-[10px] text-neutral-400">{visit.type}</span>
            </div>
        </div>
    );
}

// ─── Draggable Visit Card (Kanban) ──────────────────────────
function DraggableVisitCard({ visit }: { visit: Visit }) {
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
                                {visit.client.charAt(0)}
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-xs font-bold text-neutral-900 truncate">{visit.client}</h3>
                                <p className="text-[9px] text-neutral-400 truncate">{visit.phone}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Property */}
            <div className="space-y-1.5 mb-3 pl-5">
                <div className="flex items-center gap-1.5">
                    <Home size={11} className="text-primary shrink-0" />
                    <span className="text-[11px] font-semibold text-neutral-800 truncate">{visit.property}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <MapPin size={11} className="text-violet-500 shrink-0" />
                    <span className="text-[11px] text-neutral-500">{visit.location}</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                        <Calendar size={10} className="text-neutral-400" />
                        <span className="text-[10px] text-neutral-500">{visit.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock size={10} className="text-neutral-400" />
                        <span className="text-[10px] text-neutral-500">{visit.time}</span>
                    </div>
                </div>
            </div>

            {/* Agent + Notes */}
            <div className="pl-5 mb-3">
                <div className="flex items-center gap-1.5 mb-2">
                    <User size={10} className="text-amber-500 shrink-0" />
                    <span className="text-[10px] text-neutral-500">{visit.agent}</span>
                </div>
                {visit.notes && (
                    <div className="px-2 py-1.5 bg-neutral-50 rounded-lg border border-neutral-100">
                        <p className="text-[9px] text-neutral-400 italic leading-relaxed">&quot;{visit.notes}&quot;</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="border-t border-neutral-100 -mx-4 mb-2" />
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <button onClick={(e) => e.stopPropagation()} className="p-1 rounded-md text-neutral-300 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                        <Phone size={11} />
                    </button>
                    <a href={`https://maps.google.com/?q=${encodeURIComponent(visit.property + ' ' + visit.location + ' Bangalore')}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="p-1 rounded-md text-neutral-300 hover:text-blue-500 hover:bg-blue-50 transition-colors" title="Open in Google Maps">
                        <Navigation size={11} />
                    </a>
                </div>
                <span className="text-[9px] text-neutral-400">{visit.type}</span>
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
    const colors = columnConfig[status];
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
    const [visits, setVisits] = useState<Visit[]>(INITIAL_VISITS);
    const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetStatus: string) => {
        e.preventDefault();
        setDragOverColumn(null);
        const raw = e.dataTransfer.getData("text/plain");
        if (!raw) return;
        const visitId = Number(raw);
        if (Number.isNaN(visitId)) return;
        setVisits((prev) => prev.map((v) => (v.id === visitId ? { ...v, status: targetStatus } : v)));
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Site Visits</h1>
                    <p className="text-sm text-neutral-500 mt-1">Schedule, track and manage property visits</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25">
                        + Schedule Visit
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {KANBAN_COLUMNS.map((col) => {
                    const count = visits.filter((v) => v.status === col).length;
                    const colors = columnConfig[col];
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
        </div>
    );
}
