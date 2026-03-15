"use client";

import { useState, useEffect } from "react";
import { MapPin, Calendar, CheckCircle2, Navigation, Phone, Loader2, ChevronDown } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

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
    leads?: Lead | null;
}

const statusOptions = ["Pending", "In Progress", "Completed", "Cancelled", "Rescheduled"];

const statusBadge: Record<string, string> = {
    Pending: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
    "In Progress": "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
    Completed: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
    Cancelled: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
    Rescheduled: "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100",
};

export default function AgentVisitsPage() {
    const [visits, setVisits] = useState<Visit[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingVisitId, setUpdatingVisitId] = useState<number | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/agent/visits');
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            setVisits(data);
        } catch (err: any) {
            console.error("Fetch Visits Error:", err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (visitId: number, newStatus: string) => {
        setUpdatingVisitId(visitId);

        // Optimistic UI Update
        const previousVisits = [...visits];
        setVisits(prev => prev.map(v => v.id === visitId ? { ...v, status: newStatus } : v));

        try {
            const response = await fetch('/api/agent/visits', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: visitId, status: newStatus }),
            });
            const result = await response.json();
            if (result.error) throw new Error(result.error);
        } catch (err: any) {
            console.error("Failed to update visit status", err.message);
            setVisits(previousVisits); // Revert on failure
        } finally {
            setUpdatingVisitId(null);
        }
    };

    function formatTime(isoString: string) {
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function formatDate(isoString: string) {
        return new Date(isoString).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    }

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">My Visits</h1>
                    <p className="text-sm text-neutral-500 mt-1">Upcoming site visits and inspections</p>
                </div>
                {/* Agent creation of visit flow can be added here if needed, for now it's mostly Admin-driven per PRD */}
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : visits.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-neutral-100 shadow-sm text-center">
                    <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center mb-4">
                        <Calendar size={24} className="text-neutral-400" />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900">No visits scheduled</h3>
                    <p className="text-sm text-neutral-500 mt-2 max-w-sm">You don't have any property visits assigned to you at the moment.</p>
                </div>
            ) : (
                <div className="space-y-4 max-w-4xl">
                    {visits.map((visit) => {
                        const clientName = visit.leads?.name || "Unknown Client";
                        const clientPhone = visit.leads?.phone || "";
                        const location = visit.leads?.location || "Unknown Area";
                        const isUpdating = updatingVisitId === visit.id;

                        return (
                            <div key={visit.id} className={`group bg-white border border-neutral-100 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row gap-5 relative overflow-hidden ${isUpdating ? 'opacity-70 pointer-events-none' : ''}`}>

                                {/* Status Accent Banner */}
                                <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${visit.status === 'Completed' ? 'bg-emerald-500' :
                                        visit.status === 'Cancelled' ? 'bg-red-500' :
                                            visit.status === 'In Progress' ? 'bg-amber-500' :
                                                visit.status === 'Rescheduled' ? 'bg-violet-500' : 'bg-blue-500'
                                    }`} />

                                <div className="flex sm:flex-col items-center justify-center p-4 bg-neutral-50 rounded-xl min-w-[100px] border border-neutral-100 gap-2 sm:gap-1 shrink-0 ml-1.5">
                                    <span className="text-lg font-bold text-neutral-900">{formatTime(visit.scheduled_at)}</span>
                                    <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">{formatDate(visit.scheduled_at)}</span>
                                </div>

                                <div className="flex-1 min-w-0 flex flex-col justify-between">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-neutral-900 text-lg flex items-center gap-2 truncate">
                                                {clientName}
                                                <span className="px-2 py-0.5 bg-neutral-100 text-neutral-500 rounded text-[9px] uppercase tracking-wider font-bold">
                                                    {visit.leads?.property_type || 'Property'}
                                                </span>
                                            </h3>
                                            <p className="text-sm text-neutral-500 mt-1 truncate" title={visit.target_location}>{visit.target_location}</p>
                                        </div>

                                        {/* Dynamic Status Dropdown */}
                                        <div className="relative shrink-0 flex items-center">
                                            {isUpdating && <Loader2 size={12} className="animate-spin text-neutral-400 absolute -left-5" />}
                                            <div className="relative inline-block w-full sm:w-auto">
                                                <select
                                                    value={visit.status}
                                                    onChange={(e) => handleStatusChange(visit.id, e.target.value)}
                                                    className={`appearance-none outline-none cursor-pointer text-xs font-bold px-3 py-1.5 pr-8 rounded-lg border transition-colors w-full ${statusBadge[visit.status] || "bg-neutral-50 border-neutral-200 text-neutral-700"}`}
                                                >
                                                    {statusOptions.map(opt => (
                                                        <option key={opt} value={opt} className="bg-white text-neutral-900">{opt}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                                            </div>
                                        </div>
                                    </div>

                                    {visit.notes && (
                                        <div className="mt-3 px-3 py-2 bg-amber-50/50 rounded-lg border border-amber-100/50">
                                            <p className="text-xs text-amber-800 italic flex gap-1.5">
                                                <span className="font-semibold not-italic">Note:</span> {visit.notes}
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-neutral-100">
                                        <div className="flex items-center gap-1.5 px-3 py-2 bg-neutral-50 rounded-lg text-xs font-medium text-neutral-600 border border-neutral-100/50 truncate max-w-[200px]" title={location}>
                                            <MapPin size={14} className="shrink-0 text-violet-500" />
                                            <span className="truncate">{location}</span>
                                        </div>

                                        <a href={`https://maps.google.com/?q=${encodeURIComponent(visit.target_location + ' ' + location)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-dark transition-colors shadow-sm shadow-primary/20 flex-1 sm:flex-none">
                                            <Navigation size={14} className="shrink-0" /> <span className="hidden sm:inline">Navigate</span>
                                        </a>

                                        <a href={`tel:${clientPhone}`} className="flex items-center justify-center gap-1.5 px-4 py-2 border border-neutral-200 rounded-lg text-xs font-bold hover:bg-neutral-50 transition-colors text-neutral-700 flex-1 sm:flex-none">
                                            <Phone size={14} className="shrink-0 text-emerald-500" /> <span className="hidden sm:inline">Call</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
