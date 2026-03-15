"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Phone, MessageSquare, MapPin, IndianRupee, Home, Calendar, Clock, User, FileText, Edit, Share2, CheckCircle2, XCircle, PhoneCall, Eye, Navigation, Mail, Bell, ArrowRightLeft, Zap, BedDouble, Bath, Maximize, Loader2, Plus } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

interface Agent {
    id: string;
    name: string;
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
    users?: Agent | null; 
}

interface LeadActivity {
    id: string;
    lead_id: string;
    action: string;
    detail: string | null;
    type: string;
    agent_id: string | null;
    created_at: string;
    users?: Agent | null;
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

export default function AgentLeadDetailPage() {
    const router = useRouter();
    const params = useParams();
    const leadId = params.id as string;

    const [lead, setLead] = useState<Lead | null>(null);
    const [activities, setActivities] = useState<LeadActivity[]>([]);
    const [loading, setLoading] = useState(true);
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
    const notesOnly = activities.filter(a => a.type === "note");

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-800 transition-colors font-medium w-max">
                <ArrowLeft size={16} /> Back to My Leads
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
                            </div>
                            <div className="flex items-center gap-4 mt-2 flex-wrap">
                                <span className="text-xs text-neutral-500 flex items-center gap-1"><Phone size={12} />{lead.phone}</span>
                                <span className="text-xs text-neutral-500 flex items-center gap-1"><MapPin size={12} />{lead.location}</span>
                                <span className="text-xs text-neutral-400 flex items-center gap-1"><Calendar size={12} />{new Date(lead.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20">
                            <Phone size={14} /> Call
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">
                            <MessageSquare size={14} /> Message
                        </button>
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
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Budget", value: lead.budget, icon: IndianRupee, color: "text-emerald-500", bg: "bg-emerald-50" },
                    { label: "Property Type", value: lead.property_type, icon: Home, color: "text-primary", bg: "bg-primary/5" },
                    { label: "Source", value: lead.source, icon: FileText, color: "text-blue-500", bg: "bg-blue-50" },
                    { label: "Priority", value: lead.priority, icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
                ].map((info) => {
                    const Icon = info.icon;
                    return (
                        <div key={info.label} className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
                            <Icon size={16} className={`${info.color} mb-3`} strokeWidth={2} />
                            <p className="text-sm font-bold text-neutral-900 truncate">{info.value}</p>
                            <p className="text-xs text-neutral-400 uppercase tracking-wider mt-1">{info.label}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm flex flex-col max-h-[600px]">
                    <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-5">Activity Timeline</h3>
                    <div className="space-y-0.5 overflow-y-auto pr-1 flex-1 custom-scrollbar">
                        {activities.map((act, i) => {
                            const Icon = timelineIconMap[act.type] || FileText;
                            const colors = timelineIconColors[act.type] || { bg: "bg-neutral-100", text: "text-neutral-500" };
                            return (
                                <div key={act.id} className="flex gap-3 group">
                                    <div className="flex flex-col items-center pt-0.5">
                                        <div className={`w-7 h-7 rounded-lg ${colors.bg} flex items-center justify-center shrink-0`}>
                                            <Icon size={13} className={colors.text} />
                                        </div>
                                        {i < activities.length - 1 && <div className="w-px flex-1 bg-neutral-100 mt-1 min-h-[16px]" />}
                                    </div>
                                    <div className="pb-5 flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-neutral-800 leading-snug">{act.action}</p>
                                        {act.detail && <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">{act.detail}</p>}
                                        <p className="text-[10px] text-neutral-400 mt-1">{new Date(act.created_at).toLocaleString()}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="lg:col-span-3 space-y-4">
                    <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm flex flex-col max-h-[600px]">
                        <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-5">Internal Notes</h3>
                        <div className="mb-6 relative">
                            <textarea
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                placeholder="Add a note about this lead..."
                                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none min-h-[100px]"
                            />
                            <div className="flex justify-end mt-2">
                                <button onClick={handleAddNote} disabled={!newNote.trim() || isSavingNote} className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-1.5">
                                    {isSavingNote ? <Loader2 size={12} className="animate-spin" /> : <Plus size={14} />}
                                    Save Note
                                </button>
                            </div>
                        </div>
                        <div className="space-y-3 overflow-y-auto flex-1 custom-scrollbar pr-1">
                            {notesOnly.map((note) => (
                                <div key={note.id} className="p-4 bg-neutral-50 rounded-xl border border-neutral-100 relative">
                                    <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">{note.detail}</p>
                                    <div className="flex items-center gap-2 mt-3">
                                        <span className="text-xs text-neutral-500 font-medium">{note.users?.name || "Me"}</span>
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
