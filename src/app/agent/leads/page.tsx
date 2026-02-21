"use client";

import { Search, Filter, MoreHorizontal, Phone, MessageSquare, Plus } from "lucide-react";

const MY_LEADS = [
    { id: 1, name: "Ahmed Khan", budget: "₹1.5 Cr", status: "New Lead", date: "Just now", priority: "High" },
    { id: 2, name: "Sara Mirza", budget: "₹85 L", status: "Contacted", date: "2h ago", priority: "Medium" },
    { id: 3, name: "Ravi Patel", budget: "₹2.2 Cr", status: "Site Visit", date: "5h ago", priority: "High" },
    { id: 4, name: "Priya K.", budget: "₹65 L", status: "Negotiation", date: "1d ago", priority: "Low" },
];

export default function AgentLeadsPage() {
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">My Leads</h1>
                    <p className="text-sm text-neutral-500 mt-1">Manage your active conversations and potential deals</p>
                </div>
                <button className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25 flex items-center gap-2">
                    <Plus size={16} /> Add New Lead
                </button>
            </div>

            {/* Filters Bar */}
            <div className="p-4 bg-white border border-neutral-200 rounded-2xl shadow-sm flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Search my leads..."
                        className="w-full pl-9 pr-4 py-2 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                </div>
                <div className="flex gap-2">
                    {['All', 'New', 'Contacted', 'Site Visit', 'Negotiation'].map((status, i) => (
                        <button key={status} className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${i === 0 ? 'bg-neutral-900 text-white' : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100'}`}>
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Leads List (Card Style for Agents) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {MY_LEADS.map((lead) => (
                    <div key={lead.id} className="group bg-white border border-neutral-200 rounded-3xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 card-shadow cursor-pointer" onClick={() => window.location.href = `/agent/leads/${lead.id}`}>

                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-sm font-bold text-neutral-600">
                                    {lead.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-neutral-900">{lead.name}</h3>
                                    <span className="text-xs text-neutral-500 block">Budget: {lead.budget}</span>
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide ${lead.status === 'New Lead' ? 'bg-blue-50 text-blue-700' :
                                    lead.status === 'Contacted' ? 'bg-amber-50 text-amber-700' :
                                        lead.status === 'Site Visit' ? 'bg-purple-50 text-purple-700' :
                                            'bg-emerald-50 text-emerald-700'
                                }`}>
                                {lead.status}
                            </span>
                        </div>

                        <div className="pt-4 border-t border-neutral-100 flex gap-2">
                            <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-neutral-50 hover:bg-primary text-neutral-600 hover:text-white transition-colors text-xs font-bold" onClick={(e) => e.stopPropagation()}>
                                <Phone size={14} /> Call
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-neutral-50 hover:bg-primary text-neutral-600 hover:text-white transition-colors text-xs font-bold" onClick={(e) => e.stopPropagation()}>
                                <MessageSquare size={14} /> Message
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
