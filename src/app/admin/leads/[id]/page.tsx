"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Phone, MessageSquare, MapPin, IndianRupee, Home, Calendar, Clock, User, FileText, Edit, Share2, CheckCircle2, XCircle, PhoneCall, Eye, Navigation, Mail, Bell, ArrowRightLeft, Zap, BedDouble, Bath, Maximize, Loader2, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";

interface Agent {
    id: string;
    full_name: string;
    avatar_url: string | null;
}

interface Lead {
    id: string;
    name: string;
    email: string | null;
    source: string;
    budget: string;
    status: string;
    property_type: string;
    priority: string;
    phone: string;
    location: string;
    agent_id: string | null;
    created_at: string;
    users?: Agent | null; // Assigned agent
}

interface LeadActivity {
    id: string;
    lead_id: string;
    activity_type: string;
    message: string | null;
    metadata: any;
    agent_id: string | null;
    created_at: string;
    users?: Agent | null; // Agent who did the action
}

const statusStyles: Record<string, string> = {
    "New Lead": "bg-blue-50 text-blue-600 border-blue-100",
    "Contacted": "bg-amber-50 text-amber-600 border-amber-100",
    "Site Visit": "bg-violet-50 text-violet-600 border-violet-100",
    "Negotiation": "bg-pink-50 text-pink-600 border-pink-100",
    "Closed Won": "bg-emerald-50 text-emerald-600 border-emerald-100",
    "Follow-up": "bg-cyan-50 text-cyan-600 border-cyan-100",
};

const timelineIconMap: Record<string, React.ElementType> = {
    created: Zap,
    assigned: ArrowRightLeft,
    notification: Bell,
    call: PhoneCall,
    "call-success": Phone,
    message: MessageSquare,
    status: CheckCircle2,
    note: FileText,
    view: Eye,
    visit: Calendar,
};

const timelineIconColors: Record<string, { bg: string; text: string }> = {
    created: { bg: "bg-primary/10", text: "text-primary" },
    assigned: { bg: "bg-violet-100", text: "text-violet-600" },
    notification: { bg: "bg-amber-100", text: "text-amber-600" },
    call: { bg: "bg-red-100", text: "text-red-500" },
    "call-success": { bg: "bg-emerald-100", text: "text-emerald-600" },
    message: { bg: "bg-blue-100", text: "text-blue-600" },
    status: { bg: "bg-emerald-100", text: "text-emerald-600" },
    note: { bg: "bg-neutral-100", text: "text-neutral-600" },
    view: { bg: "bg-sky-100", text: "text-sky-600" },
    visit: { bg: "bg-violet-100", text: "text-violet-600" },
};

const priorityColors: Record<string, string> = { High: "bg-red-500", Medium: "bg-amber-400", Low: "bg-neutral-300" };

const PIPELINE_STAGES = ["New Lead", "Contacted", "Site Visit", "Negotiation", "Closed Won", "Follow-up"];

export default function LeadDetailPage() {
    const router = useRouter();
    const params = useParams();
    const leadId = params.id as string;

    const [lead, setLead] = useState<Lead | null>(null);
    const [activities, setActivities] = useState<LeadActivity[]>([]);
    const [matchingProperties, setMatchingProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Notes logic
    const [newNote, setNewNote] = useState("");
    const [isSavingNote, setIsSavingNote] = useState(false);

    useEffect(() => {
        if (!leadId) return;
        fetchData();
    }, [leadId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/leads/${leadId}`);
            const data = await response.json();
            if (data.error) throw new Error(data.error);

            if (data.lead) setLead(data.lead);
            if (data.properties) setMatchingProperties(data.properties);
            if (data.activities) setActivities(data.activities);
        } catch (err: any) {
            console.error("Fetch Lead Detail Error:", err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddNote = async () => {
        if (!newNote.trim()) return;
        setIsSavingNote(true);

        try {
            const response = await fetch(`/api/leads/${leadId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ note: newNote }),
            });
            const data = await response.json();

            if (data.error) throw new Error(data.error);

            setActivities([data, ...activities]);
            setNewNote("");
        } catch (err: any) {
            console.error("Add Note Error:", err.message);
        } finally {
            setIsSavingNote(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
    }

    if (!lead) {
        return (
            <div className="flex flex-col justify-center items-center h-[70vh] gap-4">
                <XCircle className="w-12 h-12 text-neutral-300" />
                <h2 className="text-xl font-bold text-neutral-700">Lead not found</h2>
                <button onClick={() => router.back()} className="text-sm font-semibold text-primary hover:underline">Return to list</button>
            </div>
        );
    }

    const currentStageIdx = PIPELINE_STAGES.indexOf(lead.status) > -1 ? PIPELINE_STAGES.indexOf(lead.status) : 0;
    const progress = Math.max(10, Math.round(((currentStageIdx + 1) / PIPELINE_STAGES.length) * 100));

    // Filter true "notes" vs automatic timeline activities
    const notesOnly = activities.filter(a => a.activity_type === "note");

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            {/* Back Button */}
            <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-800 transition-colors font-medium w-max">
                <ArrowLeft size={16} /> Back to Leads
            </button>

            {/* Hero Card */}
            <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1 ${priorityColors[lead.priority] || "bg-neutral-300"} opacity-60`} />
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pt-2">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-lg font-bold text-primary border border-primary/10 shrink-0">
                            {lead.name.charAt(0)}
                        </div>
                        <div>
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-xl font-bold text-neutral-900">{lead.name}</h1>
                                <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${statusStyles[lead.status] || "bg-neutral-50 text-neutral-600"}`}>{lead.status}</span>
                                <span className="flex items-center gap-1.5">
                                    <span className={`w-2 h-2 rounded-full ${priorityColors[lead.priority] || "bg-neutral-300"}`} />
                                    <span className="text-xs text-neutral-400 uppercase font-medium">{lead.priority} priority</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-4 mt-2 flex-wrap">
                                <span className="text-xs text-neutral-500 flex items-center gap-1.5"><Phone size={12} />{lead.phone}</span>
                                {lead.email && <span className="text-xs text-neutral-500 flex items-center gap-1.5"><Mail size={12} />{lead.email}</span>}
                                <span className="text-xs text-neutral-500 flex items-center gap-1.5"><MapPin size={12} />{lead.location}</span>
                                <span className="text-xs text-neutral-400 flex items-center gap-1.5"><Calendar size={12} />{new Date(lead.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pipeline Progress */}
                <div className="mt-6 pt-5 border-t border-neutral-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Pipeline Progress</span>
                        <span className="text-xs font-bold text-primary">{progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden mb-3">
                        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="flex items-center gap-1">
                        {PIPELINE_STAGES.map((stage, i) => {
                            const isActive = i <= currentStageIdx;
                            const isCurrent = i === currentStageIdx;
                            return (
                                <div key={stage} className="flex-1 flex items-center gap-1">
                                    <div className={`flex-1 h-1.5 rounded-full transition-all ${isActive ? "bg-primary" : "bg-neutral-200"}`} />
                                    {isCurrent && <span className="text-[8px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded whitespace-nowrap">{stage}</span>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Budget", value: lead.budget, icon: IndianRupee, color: "text-emerald-500", bg: "bg-emerald-50" },
                    { label: "Property Type", value: lead.property_type, icon: Home, color: "text-primary", bg: "bg-primary/5" },
                    { label: "Assigned Agent", value: lead.users?.full_name || "Unassigned", icon: User, color: "text-violet-500", bg: "bg-violet-50" },
                    { label: "Source", value: lead.source, icon: FileText, color: "text-blue-500", bg: "bg-blue-50" },
                ].map((info) => {
                    const Icon = info.icon;
                    return (
                        <div key={info.label} className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
                            <div className={`w-9 h-9 ${info.bg} rounded-xl flex items-center justify-center mb-3`}>
                                <Icon size={16} className={info.color} strokeWidth={2} />
                            </div>
                            <p className="text-sm font-bold text-neutral-900 truncate">{info.value}</p>
                            <p className="text-xs text-neutral-400 uppercase tracking-wider mt-1">{info.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Matching Properties Target Deck */}
            {matchingProperties.length > 0 && (
                <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                            <Zap size={16} className="text-amber-500" /> Matching Inventory
                        </h3>
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg uppercase tracking-wider">
                            {matchingProperties.length} Matches Found
                        </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {matchingProperties.map(prop => (
                            <div key={prop.id} className="border border-neutral-100 rounded-xl p-4 flex flex-col hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 transition-all group bg-neutral-50/50">
                                <div className="flex justify-between items-start mb-2 gap-2">
                                    <h4 className="font-bold text-neutral-900 text-sm line-clamp-1 group-hover:text-primary transition-colors pr-2" title={prop.title}>{prop.title}</h4>
                                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 shrink-0 uppercase tracking-widest border border-emerald-100">{prop.status}</span>
                                </div>
                                <p className="text-xs text-neutral-500 flex items-center gap-1.5 mb-4 truncate"><MapPin size={12} className="shrink-0 text-neutral-400" /> {prop.location}</p>
                                <div className="mt-auto flex items-center justify-between pt-3 border-t border-neutral-200/50">
                                    <span className="font-bold text-primary text-sm tracking-tight">{prop.price}</span>
                                    <span className="text-[10px] font-bold text-neutral-500 uppercase bg-white px-2 py-1 rounded-md border border-neutral-200">{prop.type}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Activity Timeline + Notes/Visits */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {/* Full Activity Timeline */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm flex flex-col max-h-[700px]">
                    <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Activity Timeline</h3>
                    <p className="text-[10px] text-neutral-400 mb-5">{activities.length} events tracked</p>

                    <div className="space-y-0.5 overflow-y-auto pr-1 flex-1 custom-scrollbar">
                        {activities.length === 0 && <p className="text-sm text-neutral-400 text-center py-6">No activity recorded yet.</p>}

                        {activities.map((act, i) => {
                            const Icon = timelineIconMap[act.activity_type] || FileText;
                            const colors = timelineIconColors[act.activity_type] || { bg: "bg-neutral-100", text: "text-neutral-500" };
                            return (
                                <div key={act.id} className="flex gap-3 group">
                                    <div className="flex flex-col items-center pt-0.5">
                                        <div className={`w-7 h-7 rounded-lg ${colors.bg} flex items-center justify-center shrink-0`}>
                                            <Icon size={13} className={colors.text} />
                                        </div>
                                        {i < activities.length - 1 && <div className="w-px flex-1 bg-neutral-100 mt-1 min-h-[16px]" />}
                                    </div>
                                    <div className="pb-5 flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-neutral-800 leading-snug">{act.activity_type}</p>
                                        {act.message && <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">{act.message}</p>}
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <p className="text-[10px] text-neutral-400 flex items-center gap-1">
                                                <Clock size={9} />{new Date(act.created_at).toLocaleString()}
                                            </p>
                                            {act.users?.full_name && (
                                                <>
                                                    <span className="w-1 h-1 rounded-full bg-neutral-200" />
                                                    <span className="text-[10px] text-neutral-500 font-medium">by {act.users.full_name}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Notes Block */}
                <div className="lg:col-span-3 space-y-4">
                    {/* Add Note Input & Notes List */}
                    <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm flex flex-col max-h-[700px]">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Internal Notes</h3>
                        </div>

                        {/* Input Area */}
                        <div className="mb-6 relative">
                            <textarea
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                placeholder="Add a note about this lead..."
                                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none min-h-[100px] custom-scrollbar"
                            />
                            <div className="flex justify-end mt-2">
                                <button
                                    onClick={handleAddNote}
                                    disabled={!newNote.trim() || isSavingNote}
                                    className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-1.5"
                                >
                                    {isSavingNote ? <Loader2 size={12} className="animate-spin" /> : <Plus size={14} />}
                                    Save Note
                                </button>
                            </div>
                        </div>

                        {/* List */}
                        <div className="space-y-3 overflow-y-auto flex-1 custom-scrollbar pr-1">
                            {notesOnly.length === 0 && <p className="text-sm text-neutral-400 text-center py-4">No internal notes added yet.</p>}

                            {notesOnly.map((note) => (
                                <div key={note.id} className="p-4 bg-neutral-50 rounded-xl border border-neutral-100 relative">
                                    <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">{note.message}</p>
                                    <div className="flex items-center gap-2 mt-3">
                                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[8px] font-bold text-primary border border-primary/20 overflow-hidden">
                                            {note.users?.avatar_url ? <Image src={note.users.avatar_url} alt="Avatar" width={24} height={24} className="w-full h-full object-cover" /> : (note.users?.full_name?.charAt(0) || "?")}
                                        </div>
                                        <span className="text-xs text-neutral-500 font-medium">{note.users?.full_name || "System"}</span>
                                        <span className="text-neutral-300">•</span>
                                        <span className="text-xs text-neutral-400">{new Date(note.created_at).toLocaleString()}</span>
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
