"use client";

import { useState, useEffect } from "react";
import { Search, Filter, MoreHorizontal, Phone, MessageSquare, Plus, IndianRupee, MapPin, Loader2, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/lib/auth";

interface Lead {
    id: string;
    name: string;
    source: string;
    budget: string;
    status: string;
    property_type: string;
    priority: string;
    phone: string;
    location: string;
    agent_id: string | null;
    created_at: string;
}

const KANBAN_COLUMNS = ["New Lead", "Contacted", "Site Visit", "Negotiation", "Closed Won", "Follow-up"];

export default function AgentLeadsPage() {
    const { user } = useAuth();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);

    // Add Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            fetchLeads();
        }
    }, [user]);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/agent/leads');
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            setLeads(data);
        } catch (err: any) {
            console.error("Fetch Leads Error:", err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddLeadsubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);

        const newLead = {
            name: formData.get("name") as string,
            phone: formData.get("phone") as string,
            email: formData.get("email") as string,
            source: formData.get("source") as string,
            property_type: formData.get("propertyType") as string,
            budget: formData.get("budget") as string,
            location: formData.get("location") as string,
            status: formData.get("status") as string,
            priority: formData.get("priority") as string,
        };

        try {
            const response = await fetch('/api/agent/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newLead),
            });
            const data = await response.json();

            if (data.error) throw new Error(data.error);

            setLeads([data as Lead, ...leads]);
            setIsAddModalOpen(false);
            e.currentTarget.reset();
        } catch (err: any) {
            console.error("Failed to create lead", err.message);
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="space-y-6 animate-fade-in relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">My Leads</h1>
                    <p className="text-sm text-neutral-500 mt-1">Manage your active conversations and potential deals</p>
                </div>
                <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25 flex items-center gap-2">
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
                        className="w-full pl-9 pr-4 py-2 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                </div>
                <div className="flex gap-2">
                    {['All', 'New Lead', 'Contacted', 'Site Visit', 'Negotiation'].map((status, i) => (
                        <button key={status} className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${i === 0 ? 'bg-neutral-900 text-white shadow-md' : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100'}`}>
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : (
                /* Leads List (Card Style for Agents) */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {leads.map((lead) => (
                        <div key={lead.id} className="group bg-white border border-neutral-200 rounded-3xl p-5 hover:shadow-lg hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 card-shadow cursor-pointer relative overflow-hidden" onClick={() => window.location.href = `/agent/leads/${lead.id}`}>

                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                                        {lead.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-neutral-900 group-hover:text-primary transition-colors">{lead.name}</h3>
                                        <span className="text-[10px] text-neutral-400 block mt-0.5">#{lead.id.slice(0, 6)}</span>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide border ${lead.status === 'New Lead' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                    lead.status === 'Contacted' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                        lead.status === 'Site Visit' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                            'bg-emerald-50 text-emerald-700 border-emerald-100'
                                    }`}>
                                    {lead.status}
                                </span>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-xs">
                                    <IndianRupee size={12} className="text-emerald-500" />
                                    <span className="font-semibold text-neutral-800">{lead.budget}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <MapPin size={12} className="text-violet-500" />
                                    <span className="text-neutral-500">{lead.location}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-neutral-100 flex gap-2">
                                <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-neutral-50 hover:bg-emerald-50 text-neutral-600 hover:text-emerald-600 border border-neutral-100 hover:border-emerald-200 transition-all text-xs font-bold" onClick={(e) => { e.stopPropagation(); window.open(`tel:${lead.phone}`); }}>
                                    <Phone size={14} /> Call
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-neutral-50 hover:bg-primary/10 text-neutral-600 hover:text-primary border border-neutral-100 hover:border-primary/20 transition-all text-xs font-bold" onClick={(e) => e.stopPropagation()}>
                                    <MessageSquare size={14} /> Message
                                </button>
                            </div>
                        </div>
                    ))}

                    {leads.length === 0 && (
                        <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-neutral-100">
                            <h3 className="text-neutral-900 font-bold text-lg mb-1">No leads assigned</h3>
                            <p className="text-neutral-500 text-sm mb-4">You do not have any leads matching the current filters.</p>
                            <button onClick={() => setIsAddModalOpen(true)} className="px-5 py-2.5 bg-primary/10 text-primary rounded-xl text-sm font-semibold hover:bg-primary/20 transition-colors inline-flex items-center gap-2">
                                <Plus size={16} /> Add First Lead
                            </button>
                        </div>
                    )}
                </div>
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
                                                <option value="Walk-in">Walk-in</option>
                                                <option value="Referral">Referral</option>
                                                <option value="Website">Website</option>
                                                <option value="Facebook">Facebook Ads</option>
                                                <option value="Instagram">Instagram</option>
                                                <option value="Other">Other</option>
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
                                            <input required name="budget" type="text" placeholder="e.g. ₹80 Lakhs - ₹1.2 Cr" className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-neutral-700">Preferred Location(s) *</label>
                                        <input required name="location" type="text" placeholder="e.g. Whitefield, Indiranagar" className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                                    </div>
                                </div>

                                {/* Tracking */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold text-neutral-900 border-b border-neutral-100 pb-2">Tracking</h4>
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
                            <button type="submit" form="add-lead-form" disabled={isSubmitting} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                                {isSubmitting ? (
                                    <><Loader2 size={16} className="animate-spin" /> Saving...</>
                                ) : (
                                    "Save Lead"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
