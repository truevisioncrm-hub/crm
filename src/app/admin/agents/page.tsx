"use client";

import { useEffect, useState } from "react";
import { Search, Filter, MoreVertical, Phone, Mail, MapPin, Star, TrendingUp, UserPlus, X } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

interface AgentData {
    id: string;
    full_name: string;
    email: string;
    role: string;
    assigned_area: string | null;
    avatar_url: string | null;
    phone: string | null;
    status: string;
    leads_count?: number;
    deals_won?: number;
}

export default function AgentsPage() {
    const [agents, setAgents] = useState<AgentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Form states
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPhone, setNewPhone] = useState("");
    const [formLoading, setFormLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        fetchAgents();
    }, []);

    const fetchAgents = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/agents');
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            setAgents(data);
        } catch {
            // Fetch failed silently
        } finally {
            setLoading(false);
        }
    };

    const handleAddAgent = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        setErrorMsg("");

        try {
            const response = await fetch('/api/admin/agents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ full_name: newName, email: newEmail, phone: newPhone }),
            });
            const data = await response.json();

            if (data.error) throw new Error(data.error);

            setAgents([data, ...agents]);
            setIsAddModalOpen(false);
            setNewName("");
            setNewEmail("");
            setNewPhone("");
        } catch (err: any) {
            setErrorMsg(err.message);
        } finally {
            setFormLoading(false);
        }
    };

    const toggleAgentStatus = async (id: string, currentStatus: string) => {
        try {
            const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
            const response = await fetch('/api/admin/agents', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus }),
            });

            const result = await response.json();
            if (result.error) throw new Error(result.error);

            setAgents(agents.map(a => a.id === id ? { ...a, status: newStatus } : a));
        } catch {
            // Toggle failed silently
        }
    };

    return (
        <div className="space-y-8 animate-fade-in relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Agents</h1>
                    <p className="text-sm text-neutral-500 mt-1">Manage your sales team and performance</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative hidden md:block">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Search agents..."
                            className="pl-9 pr-4 py-2 border border-neutral-200 rounded-xl text-sm w-64 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm font-semibold hover:bg-neutral-50 transition-colors shadow-sm">
                        <Filter size={16} /> Filter
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25 flex items-center gap-2"
                    >
                        <UserPlus size={16} /> Add Agent
                    </button>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            )}

            {/* Grid */}
            {!loading && agents.length === 0 && (
                <div className="text-center p-12 bg-white rounded-3xl border border-neutral-100">
                    <p className="text-neutral-500">No agents found. Add your first agent to get started.</p>
                </div>
            )}

            {!loading && agents.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {agents.map((agent) => (
                        <div key={agent.id} className={`group bg-white border border-neutral-100 rounded-3xl p-6 hover:shadow-xl transition-all duration-300 card-shadow relative overflow-hidden ${agent.status !== 'active' ? 'opacity-60 saturate-50' : 'hover:-translate-y-1'}`}>

                            {/* Actions Dropdown */}
                            <div className="absolute top-4 left-4">
                                <button
                                    onClick={() => toggleAgentStatus(agent.id, agent.status)}
                                    className={`text-[10px] px-2 py-1 rounded-md font-bold transition-colors ${agent.status === 'active' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                                >
                                    {agent.status === 'active' ? 'Deactivate' : 'Activate'}
                                </button>
                            </div>

                            {/* Status Badge */}
                            <div className={`absolute top-5 right-5 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${agent.status === 'active' ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-neutral-50 text-neutral-500 border-neutral-200"}`}>
                                <span className={`w-2 h-2 rounded-full ${agent.status === 'active' ? "bg-emerald-500" : "bg-neutral-400"}`} />
                                {agent.status === 'active' ? "Active" : "Archived"}
                            </div>

                            <div className="flex flex-col items-center text-center mt-6">
                                {agent.avatar_url ? (
                                    <Image src={agent.avatar_url} alt={agent.full_name} width={80} height={80} className="w-20 h-20 rounded-2xl mb-4 object-cover shadow-sm" />
                                ) : (
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center text-2xl font-bold text-neutral-600 mb-4 shadow-inner uppercase">
                                        {agent.full_name.charAt(0)}
                                    </div>
                                )}

                                <h3 className="text-lg font-bold text-neutral-900">{agent.full_name}</h3>
                                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mt-1">{agent.role}</p>
                            </div>

                            {/* Live Stats hooked into Supabase Leads */}
                            <div className="grid grid-cols-2 gap-3 mt-6">
                                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-center">
                                    <p className="text-xs text-neutral-500 mb-1">Total Leads</p>
                                    <p className="text-lg font-bold text-neutral-900">{agent.leads_count || 0}</p>
                                </div>
                                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-center">
                                    <p className="text-xs text-neutral-500 mb-1">Deals Won</p>
                                    <p className="text-lg font-bold text-emerald-600">{agent.deals_won || 0}</p>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-6">
                                <a href={`mailto:${agent.email}`} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-neutral-200 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors">
                                    <Mail size={16} />
                                </a>
                                <a href={`tel:${agent.phone || ''}`} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-neutral-200 text-sm font-semibold text-neutral-600 transition-colors ${agent.phone ? 'hover:bg-neutral-50 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}>
                                    <Phone size={16} />
                                </a>
                                <a href={`/admin/agents/${agent.id}`} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors shadow-md shadow-primary/20">
                                    View
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Agent Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative">
                        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
                            <h2 className="text-xl font-bold text-neutral-900">Add New Agent</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 bg-neutral-100 rounded-full hover:bg-neutral-200 text-neutral-500 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleAddAgent} className="p-6 space-y-4">
                            {errorMsg && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
                                    {errorMsg}
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-neutral-700">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="e.g. Rahul Kumar"
                                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-neutral-700">Email Address</label>
                                <input
                                    required
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder="rahul@truevision.com"
                                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-neutral-700">Phone Number (Optional)</label>
                                <input
                                    type="tel"
                                    value={newPhone}
                                    onChange={(e) => setNewPhone(e.target.value)}
                                    placeholder="+91 98765 43210"
                                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="w-full py-3.5 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25"
                                >
                                    {formLoading ? 'Creating...' : 'Create Agent Account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
