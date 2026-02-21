"use client";

import { Search, Filter, MoreVertical, Phone, Mail, MapPin, Star, TrendingUp } from "lucide-react";

const AGENTS = [
    { id: 1, name: "Agent Rahul", role: "Senior Agent", leads: 45, deals: 12, rating: 4.8, status: "Online", image: "R" },
    { id: 2, name: "Agent Priya", role: "Property Specialist", leads: 38, deals: 8, rating: 4.5, status: "In Meeting", image: "P" },
    { id: 3, name: "Agent Amit", role: "Junior Agent", leads: 22, deals: 3, rating: 4.2, status: "Offline", image: "A" },
    { id: 4, name: "Agent Sneha", role: "Senior Agent", leads: 50, deals: 15, rating: 4.9, status: "Online", image: "S" },
    { id: 5, name: "Agent Vikram", role: "Property Specialist", leads: 30, deals: 6, rating: 4.4, status: "Away", image: "V" },
    { id: 6, name: "Agent Neha", role: "Junior Agent", leads: 18, deals: 2, rating: 4.0, status: "Online", image: "N" },
];

export default function AgentsPage() {
    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Agents</h1>
                    <p className="text-sm text-neutral-500 mt-1">Manage your sales team and performance</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
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
                    <button className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25">
                        + Add Agent
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {AGENTS.map((agent) => (
                    <div key={agent.id} className="group bg-white border border-neutral-100 rounded-3xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 card-shadow relative overflow-hidden">

                        {/* Live Status Badge */}
                        <div className={`absolute top-5 right-5 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${agent.status === "Online" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                agent.status === "In Meeting" ? "bg-amber-50 text-amber-700 border-amber-200" :
                                    agent.status === "On Visit" ? "bg-violet-50 text-violet-700 border-violet-200" :
                                        agent.status === "Away" ? "bg-orange-50 text-orange-600 border-orange-200" :
                                            "bg-neutral-50 text-neutral-500 border-neutral-200"
                            }`}>
                            <span className={`w-2 h-2 rounded-full ${agent.status === "Online" ? "bg-emerald-500 animate-pulse" :
                                    agent.status === "In Meeting" ? "bg-amber-500" :
                                        agent.status === "On Visit" ? "bg-violet-500 animate-pulse" :
                                            agent.status === "Away" ? "bg-orange-400" :
                                                "bg-neutral-400"
                                }`} />
                            {agent.status}
                        </div>

                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center text-2xl font-bold text-neutral-600 mb-4 shadow-inner">
                                {agent.image}
                            </div>
                            <h3 className="text-lg font-bold text-neutral-900">{agent.name}</h3>
                            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mt-1">{agent.role}</p>

                            <div className="flex items-center gap-1 mt-2 bg-amber-50 px-2 py-1 rounded-lg">
                                <Star size={12} className="text-amber-500 fill-amber-500" />
                                <span className="text-xs font-bold text-amber-700">{agent.rating}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-6">
                            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-center">
                                <p className="text-xs text-neutral-500 mb-1">Leads</p>
                                <p className="text-lg font-bold text-neutral-900">{agent.leads}</p>
                            </div>
                            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-center">
                                <p className="text-xs text-neutral-500 mb-1">Deals</p>
                                <p className="text-lg font-bold text-neutral-900">{agent.deals}</p>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-6">
                            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-neutral-200 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors">
                                <Mail size={16} />
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-neutral-200 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors">
                                <Phone size={16} />
                            </button>
                            <a href={`/admin/agents/${agent.id}`} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors shadow-md shadow-primary/20">
                                View
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
