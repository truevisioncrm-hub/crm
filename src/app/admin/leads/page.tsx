"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Download, Phone, MessageSquare, MapPin, IndianRupee, ChevronRight, Users, LayoutGrid, Columns3, GripVertical, UserPlus, Check, X, Loader2, ChevronLeft, Warehouse, RefreshCw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Types
interface Agent {
    id: string;
    full_name: string;
    avatar_url: string | null;
}

interface Lead {
    id: string;
    name: string;
    source: string;
    budget_min: number;
    budget_max: number;
    budget: string;
    location: string;
    status: string;
    property_type: string;
    priority: string;
    phone: string;
    area_interest: string;
    assigned_agent_id: string | null;
    agent_id: string | null;
    created_at: string;
    users?: Agent | null;
    profiles?: Agent | null;
}

// Styles
const statusStyles: Record<string, string> = {
    "new": "bg-blue-50 text-blue-600 border-blue-100",
    "contacted": "bg-amber-50 text-amber-600 border-amber-100",
    "meeting_scheduled": "bg-violet-50 text-violet-600 border-violet-100",
    "site_visit": "bg-pink-50 text-pink-600 border-pink-100",
    "negotiation": "bg-pink-50 text-pink-600 border-pink-100",
    "documentation": "bg-cyan-50 text-cyan-600 border-cyan-100",
    "closed_won": "bg-emerald-50 text-emerald-600 border-emerald-100",
};

const columnColors: Record<string, { header: string; dot: string; count: string; dropBg: string }> = {
    "new": { header: "text-blue-700", dot: "bg-blue-500", count: "bg-blue-100 text-blue-700", dropBg: "bg-blue-50 border-blue-300" },
    "contacted": { header: "text-amber-700", dot: "bg-amber-500", count: "bg-amber-100 text-amber-700", dropBg: "bg-amber-50 border-amber-300" },
    "meeting_scheduled": { header: "text-violet-700", dot: "bg-violet-500", count: "bg-violet-100 text-violet-700", dropBg: "bg-violet-50 border-violet-300" },
    "site_visit": { header: "text-pink-700", dot: "bg-pink-500", count: "bg-pink-100 text-pink-700", dropBg: "bg-pink-50 border-pink-300" },
    "negotiation": { header: "text-pink-700", dot: "bg-pink-500", count: "bg-pink-100 text-pink-700", dropBg: "bg-pink-50 border-pink-300" },
    "documentation": { header: "text-cyan-700", dot: "bg-cyan-500", count: "bg-cyan-100 text-cyan-700", dropBg: "bg-cyan-50 border-cyan-300" },
};

const priorityDot: Record<string, string> = {
    urgent: "bg-red-500",
    high: "bg-red-400",
    normal: "bg-amber-400",
    low: "bg-neutral-300",
};

const sourceIcon: Record<string, string> = {
    facebook: "🔵",
    website: "🌐",
    referral: "🤝",
    "99acres": "🏠",
    manual: "🚶",
    propertyfinder: "🏢",
    property_finder: "🏢",
};

const KANBAN_COLUMNS = ["new", "contacted", "meeting_scheduled", "site_visit", "negotiation", "documentation", "closed_won"];

const colorsList = ["bg-blue-500", "bg-pink-500", "bg-amber-500", "bg-emerald-500", "bg-violet-500"];

function getAgentColor(name: string) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colorsList[Math.abs(hash) % colorsList.length];
}

// ─── Custom Custom Hook for Debounced Search ────────────────
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

// ─── Agent Picker Dropdown ──────────────────────────────────
function AgentPicker({ currentAgentId, currentAgentName, currentAgentAvatar, agents, onAssign, compact = false }: { currentAgentId: string | null; currentAgentName: string | null; currentAgentAvatar: string | null; agents: Agent[]; onAssign: (agentId: string | null) => void; compact?: boolean }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const close = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, [open]);

    return (
        <div ref={ref} className="relative z-20">
            <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(!open); }}
                className={`flex items-center gap-1.5 rounded-lg transition-all ${compact
                    ? "px-1.5 py-1 hover:bg-amber-50 text-[10px]"
                    : "px-2 py-1 hover:bg-amber-50 text-xs"
                    } ${open ? "bg-amber-50 ring-1 ring-amber-200" : ""}`}
                title="Assign agent"
            >
                {currentAgentName ? (
                    <div className={`${compact ? "w-4 h-4 text-[7px]" : "w-5 h-5 text-[8px]"} rounded-full ${getAgentColor(currentAgentName)} text-white flex items-center justify-center font-bold overflow-hidden`}>
                        {currentAgentAvatar ? <Image src={currentAgentAvatar} alt="Avatar" width={20} height={20} className="w-full h-full object-cover" /> : currentAgentName.charAt(0)}
                    </div>
                ) : (
                    <UserPlus size={compact ? 10 : 12} className="text-amber-500" />
                )}
                <span className="text-neutral-600 truncate max-w-[80px]">{currentAgentName || "Unassigned"}</span>
            </button>

            {open && (
                <div className="absolute z-50 top-full left-0 mt-1 w-52 bg-white rounded-xl border border-neutral-200 shadow-xl py-1.5 animate-fade-in">
                    <p className="px-3 py-1.5 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Assign to Agent</p>
                    {agents.map((agent) => (
                        <button
                            key={agent.id}
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAssign(agent.id); setOpen(false); }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-neutral-50 transition-colors ${agent.id === currentAgentId ? "bg-primary/5" : ""}`}
                        >
                            <div className={`w-6 h-6 rounded-full ${getAgentColor(agent.full_name)} text-white flex items-center justify-center text-[9px] font-bold overflow-hidden`}>
                                {agent.avatar_url ? <Image src={agent.avatar_url} alt="Avatar" width={24} height={24} className="w-full h-full object-cover" /> : agent.full_name.charAt(0)}
                            </div>
                            <span className="text-xs font-medium text-neutral-800 flex-1">{agent.full_name}</span>
                            {agent.id === currentAgentId && <Check size={14} className="text-primary" />}
                        </button>
                    ))}
                    {currentAgentId && (
                        <>
                            <div className="border-t border-neutral-100 my-1" />
                            <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAssign(null); setOpen(false); }}
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
function LeadCard({ lead, agents, onAssignAgent }: { lead: Lead; agents: Agent[]; onAssignAgent: (params: { leadId: string, agentId: string | null }) => void }) {
    return (
        <Link
            href={`/admin/leads/${lead.id}`}
            className="group bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 cursor-pointer relative overflow-hidden block"
        >
            <div className={`absolute top-0 left-0 right-0 h-1 ${priorityDot[lead.priority] || "bg-neutral-300"} opacity-60 rounded-t-2xl`} />
            <div className="flex items-start justify-between mb-4 pt-1">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 text-sm rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center font-bold text-primary border border-primary/10">
                        {lead.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-neutral-900 group-hover:text-primary transition-colors truncate max-w-[140px]">{lead.name}</h3>
                        <p className="text-[10px] text-neutral-400 mt-0.5">#{lead.id.slice(0, 6)}</p>
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
                <div onClick={(e) => e.preventDefault()}>
                    <AgentPicker
                        currentAgentId={lead.assigned_agent_id || lead.agent_id}
                        currentAgentName={lead.profiles?.full_name || lead.users?.full_name || null}
                        currentAgentAvatar={lead.profiles?.avatar_url || lead.users?.avatar_url || null}
                        agents={agents}
                        onAssign={(agentId) => onAssignAgent({ leadId: lead.id, agentId })}
                    />
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
                    <span className="text-[10px] text-neutral-400">
                        {new Date(lead.created_at).toLocaleDateString()}
                    </span>
                    <ChevronRight size={12} className="text-neutral-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
            </div>
        </Link>
    );
}

// ─── Main Page ──────────────────────────────────────────────
export default function LeadsPage() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const [view, setView] = useState<"cards" | "board">("cards");
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 300);
    const [statusFilter, setStatusFilter] = useState("all");
    const [activeTab, setActiveTab] = useState<"crm" | "pf">("crm");

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [budgetSelect, setBudgetSelect] = useState("₹20-40 Lakhs");
    const [budgetCustom, setBudgetCustom] = useState("");
    const [locationSelect, setLocationSelect] = useState("");
    const [locationCustom, setLocationCustom] = useState("");

    // PF Leads Query
    const pfLeadsQuery = useQuery({
        queryKey: ['pf-leads'],
        queryFn: async () => {
            const res = await fetch('/api/admin/propertyfinder/leads');
            if (!res.ok) throw new Error('Failed to fetch PF leads');
            return res.json();
        },
        enabled: activeTab === 'pf',
        staleTime: 5 * 60 * 1000,
    });

    const pfSyncMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch('/api/admin/propertyfinder/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'leads' }),
            });
            if (!res.ok) throw new Error('Sync failed');
            return res.json();
        },
        onSuccess: (result) => {
            const count = result.results?.leads?.count || 0;
            if (count > 0) {
                toast.success(`${count} lead(s) imported from Property Finder!`);
                queryClient.invalidateQueries({ queryKey: ['leads'] });
            } else {
                toast.info(result.results?.leads?.message || 'All PF leads already imported');
            }
        },
        onError: (err: any) => toast.error(err.message || 'Import failed'),
    });

    // Queries
    const { data, isLoading } = useQuery({
        queryKey: ['leads', user?.org_id, page, debouncedSearch, statusFilter],
        queryFn: async () => {
            if (!user?.org_id) return null;
            const searchParams = new URLSearchParams();
            searchParams.set('page', page.toString());
            searchParams.set('limit', '30'); // Changed to 30 for better grid layout
            if (debouncedSearch) searchParams.set('search', debouncedSearch);
            if (statusFilter !== 'all') searchParams.set('status', statusFilter);

            const res = await fetch(`/api/admin/leads?${searchParams.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch leads");
            return res.json();
        },
        enabled: !!user?.org_id,
        staleTime: 60000,
        placeholderData: (previousData) => previousData, // Equivalent to keepPreviousData in v5
    });

    const leads = data?.leads || [];
    const agents = data?.agents || [];
    const pagination = data?.pagination || { total: 0, page: 1, limit: 30, totalPages: 1 };

    // Mutations
    const assignAgentMutation = useMutation({
        mutationFn: async ({ leadId, agentId }: { leadId: string, agentId: string | null }) => {
            const res = await fetch('/api/admin/leads', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: leadId, assigned_agent_id: agentId }),
            });
            if (!res.ok) throw new Error("Failed to assign agent");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leads'] });
        }
    });

    const sweepLeadsMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch('/api/admin/leads', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sweep: true }),
            });
            const result = await res.json();
            if (!res.ok || result.error) throw new Error(result.error || "Sweep failed");
            return result;
        },
        onSuccess: (result) => {
            if (result.count === 0) {
                toast.info("No stale leads found.");
            } else {
                toast.success(`Successfully swept ${result.count} stale leads back to the Admin pool.`);
                queryClient.invalidateQueries({ queryKey: ['leads'] });
            }
        },
        onError: (err: any) => {
            console.error(err.message);
            toast.error("Error running sweep.");
        }
    });

    const addLeadMutation = useMutation({
        mutationFn: async (newLead: any) => {
            const res = await fetch('/api/admin/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newLead),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "Failed to create lead");
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leads'] });
            setIsAddModalOpen(false);
            setPage(1); // Go back to first page to see the newly added lead
            toast.success("Lead created successfully!");
        },
        onError: (err: any) => {
            console.error("Add lead error:", err);
            toast.error(err.message || "Failed to create lead. Please try again.");
        }
    });


    // Handlers
    const handleAddLeadsubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const budgetValue = budgetSelect === "custom" ? budgetCustom : budgetSelect;
        const locationValue = locationSelect === "custom" ? locationCustom : locationSelect;
        const priorityText = formData.get("priority") as string;
        const noteText = formData.get("note") as string;
        const newLead: Record<string, any> = {
            name: formData.get("name") as string,
            phone: formData.get("phone") as string,
            email: (formData.get("email") as string) || null,
            source: formData.get("source") as string,
            property_type: formData.get("propertyType") as string,
            area_interest: locationValue || null,
            status: formData.get("status") as string,
            custom_notes: [budgetValue ? `Budget: ${budgetValue}` : '', priorityText ? `Priority: ${priorityText}` : '', noteText ? `Note: ${noteText}` : ''].filter(Boolean).join(' | ') || null,
            assigned_agent_id: (formData.get("agentId") as string) || null,
        };
        addLeadMutation.mutate(newLead);
    };

    const handleSweepStaleLeads = async () => {
        toast.warning("Sweep Stale Leads?", {
            description: "This will unassign all 'New Leads' older than 2 hours. Do you wish to proceed?",
            action: {
                label: "Proceed",
                onClick: () => sweepLeadsMutation.mutate()
            },
            cancel: {
                label: "Cancel",
                onClick: () => console.log("Sweep cancelled")
            }
        });
    };


    // Reset page when search or filters change
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, statusFilter]);

    return (
        <div className="space-y-6 animate-fade-in relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Leads</h1>
                    <p className="text-sm text-neutral-500 mt-1">Track and manage your potential customers</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button onClick={handleSweepStaleLeads} disabled={sweepLeadsMutation.isPending} className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm font-semibold hover:bg-rose-100 transition-colors shadow-sm disabled:opacity-50">
                        {sweepLeadsMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Users size={16} />}
                        Sweep <span className="hidden sm:inline">Stale Leads</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm font-semibold hover:bg-neutral-50 transition-colors shadow-sm hidden sm:flex">
                        <Download size={16} /> Export
                    </button>
                    <button onClick={() => setIsAddModalOpen(true)} className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25">
                        + Add Lead
                    </button>
                </div>
            </div>

            {/* Tab Switcher: CRM vs PF */}
            <div className="flex bg-neutral-100 rounded-xl p-1 gap-1 w-fit">
                <button
                    onClick={() => setActiveTab('crm')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'crm' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
                >
                    <Users size={15} /> CRM Leads
                </button>
                <button
                    onClick={() => setActiveTab('pf')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'pf' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
                >
                    <Warehouse size={15} /> PF Leads
                    {pfLeadsQuery.data?.data?.length > 0 && (
                        <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-md">
                            {pfLeadsQuery.data.data.length}
                        </span>
                    )}
                </button>
            </div>

            {/* ─── PF Leads Tab ─── */}
            {activeTab === 'pf' ? (
                <div className="space-y-6">
                    {/* PF Header */}
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-neutral-500">Fresh leads from Property Finder API</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => pfLeadsQuery.refetch()}
                                disabled={pfLeadsQuery.isFetching}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm font-semibold hover:bg-neutral-50 transition-colors shadow-sm disabled:opacity-50"
                            >
                                <RefreshCw size={14} className={pfLeadsQuery.isFetching ? 'animate-spin' : ''} /> Refresh
                            </button>
                            <button
                                onClick={() => pfSyncMutation.mutate()}
                                disabled={pfSyncMutation.isPending}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25 disabled:opacity-50"
                            >
                                {pfSyncMutation.isPending ? (
                                    <><Loader2 size={14} className="animate-spin" /> Importing...</>
                                ) : (
                                    <><Download size={14} /> Import All to CRM</>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* PF Leads Content */}
                    {pfLeadsQuery.isLoading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        </div>
                    ) : pfLeadsQuery.error ? (
                        <div className="py-12 text-center border-2 border-dashed border-red-200 rounded-2xl">
                            <p className="text-red-500 font-medium">Failed to load PF leads. Check API credentials.</p>
                        </div>
                    ) : (pfLeadsQuery.data?.data || []).length === 0 ? (
                        <div className="py-12 text-center border-2 border-dashed border-neutral-200 rounded-2xl">
                            <p className="text-neutral-500">No leads found in Property Finder.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {(pfLeadsQuery.data?.data || []).map((lead: any) => {
                                const phone = lead.sender?.contacts?.find((c: any) => c.type === 'phone')?.value || lead.sender?.contacts?.[0]?.value || '';
                                const channelIcons: Record<string, string> = { call: '📞', whatsapp: '💬', email: '📧', sms: '💬' };
                                return (
                                    <div key={lead.id} className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 flex items-center justify-center text-lg">
                                                    {channelIcons[lead.channel] || '📋'}
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-bold text-neutral-900">{phone || 'Unknown'}</h3>
                                                    <p className="text-[10px] text-neutral-400 capitalize">{lead.channel} lead</p>
                                                </div>
                                            </div>
                                            <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 capitalize">
                                                {lead.status}
                                            </span>
                                        </div>
                                        <div className="space-y-2 mb-3">
                                            {lead.listing?.reference && (
                                                <div className="flex items-center gap-2 text-xs text-neutral-500">
                                                    <span>🏠</span>
                                                    <span className="font-mono text-[10px]">Listing: {lead.listing.reference.slice(0, 16)}</span>
                                                </div>
                                            )}
                                            {lead.call?.talkTime > 0 && (
                                                <div className="flex items-center gap-2 text-xs text-neutral-500">
                                                    <Phone size={12} /> Talk: {lead.call.talkTime}s
                                                </div>
                                            )}
                                        </div>
                                        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                                            <span className="text-[10px] text-neutral-400">
                                                {new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                            <span className="text-[10px] font-mono text-neutral-300">{lead.id?.slice(0, 20)}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            ) : (
                <>
                    {/* Filters + View Toggle */}
                    <div className="p-4 bg-white border border-neutral-100 rounded-2xl shadow-sm flex flex-wrap items-center gap-4">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search leads by name..."
                                className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                        >
                            <option value="all">All Statuses</option>
                            {KANBAN_COLUMNS.map(col => <option value={col} key={col}>{col}</option>)}
                        </select>

                        <div className="h-8 w-px bg-neutral-200 hidden sm:block" />
                        <div className="flex bg-neutral-100 rounded-xl p-1 gap-1">
                            <button onClick={() => setView("cards")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${view === "cards" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}>
                                <LayoutGrid size={14} /> Cards
                            </button>
                            {/* Kanban requires full dataset or specific API structure, disabling for paginated view */}
                            <button disabled title="Kanban only available without pagination" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all opacity-50 cursor-not-allowed text-neutral-500`}>
                                <Columns3 size={14} /> Board
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {leads.map((lead: Lead) => (
                                    <LeadCard
                                        key={lead.id}
                                        lead={lead}
                                        agents={agents}
                                        onAssignAgent={assignAgentMutation.mutate}
                                    />
                                ))}
                                {leads.length === 0 && (
                                    <div className="col-span-full py-12 text-center border-2 border-dashed border-neutral-200 rounded-2xl">
                                        <p className="text-neutral-500">No leads found matching your criteria.</p>
                                    </div>
                                )}
                            </div>

                            {/* Server-side Pagination Controls */}
                            {pagination.totalPages > 1 && (
                                <div className="flex items-center justify-between bg-white border border-neutral-100 p-4 rounded-2xl shadow-sm">
                                    <span className="text-sm text-neutral-500 font-medium">
                                        Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={pagination.page === 1}
                                            className="p-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 disabled:opacity-50 transition-colors"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>
                                        <span className="text-sm font-bold w-10 text-center">{pagination.page} / {pagination.totalPages}</span>
                                        <button
                                            onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                            disabled={pagination.page === pagination.totalPages}
                                            className="p-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 disabled:opacity-50 transition-colors"
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* Add Lead Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-6 border-b border-neutral-100 shrink-0">
                            <div>
                                <h3 className="text-xl font-bold text-neutral-900">Add New Lead</h3>
                                <p className="text-sm text-neutral-500 mt-1">Enter the details of the prospective buyer/tenant.</p>
                            </div>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                            <form id="add-lead-form" onSubmit={handleAddLeadsubmit} className="space-y-6">
                                {/* Basic Info */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold text-neutral-900 border-b border-neutral-100 pb-2">Basic Information</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-neutral-700">Full Name *</label>
                                            <input required name="name" type="text" placeholder="e.g. Rahul Sharma" className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-neutral-700">Phone Number *</label>
                                            <input required name="phone" type="tel" placeholder="e.g. +91 9876543210" className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-neutral-700">Email Address (Optional)</label>
                                            <input name="email" type="email" placeholder="e.g. rahul@example.com" className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-neutral-700">Lead Source *</label>
                                            <select required name="source" className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer">
                                                <option value="website">Website</option>
                                                <option value="facebook">Facebook Ads</option>
                                                <option value="instagram">Instagram</option>
                                                <option value="99acres">99acres</option>
                                                <option value="property_finder">Property Finder</option>
                                                <option value="whatsapp">WhatsApp</option>
                                                <option value="referral">Referral</option>
                                                <option value="manual">Walk-in / Manual</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Requirements */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold text-neutral-900 border-b border-neutral-100 pb-2">Requirements</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-neutral-700">Property Type *</label>
                                            <select required name="propertyType" className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer">
                                                <option value="1BHK">1 BHK Apartment</option>
                                                <option value="2BHK">2 BHK Apartment</option>
                                                <option value="3BHK">3 BHK Apartment</option>
                                                <option value="4BHK+">4 BHK+ / Penthouse</option>
                                                <option value="Villa">Villa / Row House</option>
                                                <option value="Plot">Plot / Land</option>
                                                <option value="Commercial">Commercial</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-neutral-700">Budget Range *</label>
                                            <select required value={budgetSelect} onChange={(e) => setBudgetSelect(e.target.value)} className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer">
                                                <option value="₹10-20 Lakhs">₹10-20 Lakhs</option>
                                                <option value="₹20-40 Lakhs">₹20-40 Lakhs</option>
                                                <option value="₹40-60 Lakhs">₹40-60 Lakhs</option>
                                                <option value="₹60-80 Lakhs">₹60-80 Lakhs</option>
                                                <option value="₹80L - 1 Cr">₹80 Lakhs - 1 Cr</option>
                                                <option value="₹1 - 1.5 Cr">₹1 - 1.5 Cr</option>
                                                <option value="₹1.5 - 2 Cr">₹1.5 - 2 Cr</option>
                                                <option value="₹2 - 3 Cr">₹2 - 3 Cr</option>
                                                <option value="₹3 - 5 Cr">₹3 - 5 Cr</option>
                                                <option value="₹5 Cr+">₹5 Cr+</option>
                                                <option value="custom">✏️ Custom</option>
                                            </select>
                                            {budgetSelect === "custom" && (
                                                <input required value={budgetCustom} onChange={(e) => setBudgetCustom(e.target.value)} type="text" placeholder="Enter custom budget, e.g. ₹85 Lakhs" className="w-full mt-2 px-4 py-2 bg-white border border-primary/30 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-neutral-700">Preferred Location(s) *</label>
                                        <select required value={locationSelect} onChange={(e) => setLocationSelect(e.target.value)} className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer">
                                            <option value="" disabled>Select location...</option>
                                            <option value="Whitefield">Whitefield</option>
                                            <option value="Indiranagar">Indiranagar</option>
                                            <option value="Koramangala">Koramangala</option>
                                            <option value="HSR Layout">HSR Layout</option>
                                            <option value="Marathahalli">Marathahalli</option>
                                            <option value="Electronic City">Electronic City</option>
                                            <option value="Sarjapur Road">Sarjapur Road</option>
                                            <option value="Hebbal">Hebbal</option>
                                            <option value="Yelahanka">Yelahanka</option>
                                            <option value="JP Nagar">JP Nagar</option>
                                            <option value="Bannerghatta Road">Bannerghatta Road</option>
                                            <option value="Rajajinagar">Rajajinagar</option>
                                            <option value="custom">✏️ Custom</option>
                                        </select>
                                        {locationSelect === "custom" && (
                                            <input required value={locationCustom} onChange={(e) => setLocationCustom(e.target.value)} type="text" placeholder="Enter custom location" className="w-full mt-2 px-4 py-2 bg-white border border-primary/30 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                                        )}
                                    </div>
                                </div>

                                {/* Tracking */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold text-neutral-900 border-b border-neutral-100 pb-2">Tracking & Assignment</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-neutral-700">Initial Status *</label>
                                            <select required name="status" className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer">
                                                {KANBAN_COLUMNS.map(col => <option key={col} value={col}>{col}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-neutral-700">Priority Level *</label>
                                            <select required name="priority" className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer">
                                                <option value="High">High Priority (Hot)</option>
                                                <option value="Medium">Medium Priority (Warm)</option>
                                                <option value="Low">Low Priority (Cold)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-neutral-700">Assign to Agent</label>
                                        <select name="agentId" defaultValue="" className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer">
                                            <option value="">-- Unassigned (Admin Pool) --</option>
                                            {agents.map((agent: Agent) => <option key={agent.id} value={agent.id}>{agent.full_name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-neutral-700">Initial Note (Optional)</label>
                                        <textarea name="note" rows={3} placeholder="Add any specific requirements or conversation history..." className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all custom-scrollbar resize-none"></textarea>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="p-6 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
                            <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-neutral-600 hover:bg-neutral-200 transition-colors">
                                Cancel
                            </button>
                            <button type="submit" form="add-lead-form" disabled={addLeadMutation.isPending} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                                {addLeadMutation.isPending ? (
                                    <><Loader2 size={16} className="animate-spin" /> Saving...</>
                                ) : (
                                    "Create Lead"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
