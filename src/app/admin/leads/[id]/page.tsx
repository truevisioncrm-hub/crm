"use client";

import { ArrowLeft, Phone, MessageSquare, MapPin, IndianRupee, Home, Calendar, Clock, User, FileText, Edit, Share2, CheckCircle2, XCircle, PhoneCall, Eye, Navigation, Mail, Bell, ArrowRightLeft, Zap, BedDouble, Bath, Maximize } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

const LEADS = [
    { id: 1, name: "Ahmed Khan", phone: "+91 98765 43210", email: "ahmed@email.com", source: "Facebook", agent: "Arjun Mehta", budget: "₹10-15L", budgetMin: 10, budgetMax: 15, type: "2BHK", status: "New", statusColor: "bg-blue-50 text-blue-600 border-blue-100", priority: "high", location: "Whitefield", date: "Feb 12, 2026", progress: 15 },
    { id: 2, name: "Sara Mirza", phone: "+91 87654 32109", email: "sara@email.com", source: "Website", agent: "Priya Singh", budget: "₹20-30L", budgetMin: 20, budgetMax: 30, type: "3BHK", status: "Contacted", statusColor: "bg-amber-50 text-amber-600 border-amber-100", priority: "medium", location: "Koramangala", date: "Feb 10, 2026", progress: 30 },
    { id: 3, name: "Ravi Patel", phone: "+91 76543 21098", email: "ravi@email.com", source: "99acres", agent: "Arjun Mehta", budget: "₹8-12L", budgetMin: 8, budgetMax: 12, type: "2BHK", status: "Site Visit", statusColor: "bg-violet-50 text-violet-600 border-violet-100", priority: "high", location: "HSR Layout", date: "Feb 8, 2026", progress: 55 },
    { id: 4, name: "Priya Kapoor", phone: "+91 65432 10987", email: "priyak@email.com", source: "Referral", agent: "Rahul Kumar", budget: "₹15-20L", budgetMin: 15, budgetMax: 20, type: "2BHK", status: "Negotiation", statusColor: "bg-pink-50 text-pink-600 border-pink-100", priority: "high", location: "Indiranagar", date: "Feb 5, 2026", progress: 75 },
    { id: 5, name: "Mohan Singh", phone: "+91 54321 09876", email: "mohan@email.com", source: "WhatsApp", agent: "Sneha Patel", budget: "₹25-35L", budgetMin: 25, budgetMax: 35, type: "3BHK", status: "Closed Won", statusColor: "bg-emerald-50 text-emerald-600 border-emerald-100", priority: "low", location: "Electronic City", date: "Feb 2, 2026", progress: 100 },
    { id: 6, name: "Karan M.", phone: "+91 43210 98765", email: "karan@email.com", source: "Facebook", agent: "Arjun Mehta", budget: "₹12-18L", budgetMin: 12, budgetMax: 18, type: "2BHK", status: "Contacted", statusColor: "bg-amber-50 text-amber-600 border-amber-100", priority: "medium", location: "Marathahalli", date: "Feb 11, 2026", progress: 30 },
    { id: 7, name: "Neha R.", phone: "+91 32109 87654", email: "neha@email.com", source: "Website", agent: "Priya Singh", budget: "₹30-40L", budgetMin: 30, budgetMax: 40, type: "4BHK", status: "New", statusColor: "bg-blue-50 text-blue-600 border-blue-100", priority: "low", location: "Whitefield", date: "Feb 13, 2026", progress: 10 },
    { id: 8, name: "Vijay K.", phone: "+91 21098 76543", email: "vijay@email.com", source: "99acres", agent: "Rahul Kumar", budget: "₹18-25L", budgetMin: 18, budgetMax: 25, type: "3BHK", status: "New", statusColor: "bg-blue-50 text-blue-600 border-blue-100", priority: "medium", location: "HSR Layout", date: "Feb 12, 2026", progress: 10 },
];

// Full activity timeline with types for icons
const FULL_TIMELINE = [
    { action: "Lead created from Facebook campaign", detail: "Auto-captured from FB Lead Ad — Campaign: Whitefield Premium Homes", time: "Feb 12, 09:15 AM", type: "created", icon: Zap },
    { action: "Auto-assigned to Arjun Mehta", detail: "Round-robin distribution — Agent had lowest active leads (12)", time: "Feb 12, 09:16 AM", type: "assigned", icon: ArrowRightLeft },
    { action: "Assignment notification sent", detail: "Push notification + email sent to agent", time: "Feb 12, 09:16 AM", type: "notification", icon: Bell },
    { action: "First call attempted — no answer", detail: "Agent tried calling, rang for 45 seconds. Marked as Ringing - No Response.", time: "Feb 12, 02:30 PM", type: "call", icon: PhoneCall },
    { action: "SMS follow-up sent", detail: "Template: 'Hi {{name}}, we have exciting properties in {{location}}...'", time: "Feb 12, 02:35 PM", type: "message", icon: MessageSquare },
    { action: "Follow-up call — Connected!", detail: "Call duration: 8 min 42 sec. Client interested in 2BHK, east-facing. Budget ₹10-15L.", time: "Feb 13, 10:00 AM", type: "call-success", icon: Phone },
    { action: "Status changed: New → Contacted", detail: "Agent updated status after successful call", time: "Feb 13, 10:09 AM", type: "status", icon: CheckCircle2 },
    { action: "Note added by Arjun Mehta", detail: "Client prefers east-facing apartment with gated community. Budget flexible up to ₹18L.", time: "Feb 13, 10:12 AM", type: "note", icon: FileText },
    { action: "Brochure sent via WhatsApp", detail: "Prestige Lakeside Villa brochure — 4 pages, PDF", time: "Feb 13, 11:30 AM", type: "message", icon: Mail },
    { action: "Client viewed brochure", detail: "Opened at 12:45 PM, viewed for 3 minutes", time: "Feb 13, 12:45 PM", type: "view", icon: Eye },
    { action: "Site visit scheduled", detail: "Prestige Lakeside Villa, Whitefield — Tomorrow 3:00 PM", time: "Feb 14, 09:00 AM", type: "visit", icon: Calendar },
    { action: "Reminder sent to client", detail: "WhatsApp reminder: Visit tomorrow at 3 PM at Prestige Lakeside Villa", time: "Feb 14, 06:00 PM", type: "notification", icon: Bell },
];

const NOTES = [
    { text: "Client prefers east-facing apartment with gated community. Budget flexible up to ₹18L if property is premium.", author: "Arjun Mehta", time: "1 day ago" },
    { text: "Requested brochure for Prestige Lakeside — sent via WhatsApp.", author: "Arjun Mehta", time: "2 days ago" },
    { text: "Client also interested in nearby schools — family with 2 kids.", author: "Arjun Mehta", time: "2 days ago" },
];

const SITE_VISITS = [
    { property: "Prestige Lakeside Villa", location: "Whitefield", date: "Tomorrow, 3:00 PM", status: "Scheduled", mapLink: "https://maps.google.com/?q=Whitefield+Bangalore" },
    { property: "Godrej Platinum", location: "HSR Layout", date: "Feb 18, 11:00 AM", status: "Pending", mapLink: "https://maps.google.com/?q=HSR+Layout+Bangalore" },
];

// Matching properties from inventory
const MATCHING_PROPERTIES = [
    { id: 1, title: "Prestige Lakeside Villa", location: "Whitefield", price: "₹14.5 L", type: "2BHK", beds: 2, baths: 2, area: "1,200", match: 95, agent: "Arjun Mehta" },
    { id: 2, title: "Brigade Horizon", location: "Whitefield", price: "₹12.8 L", type: "2BHK", beds: 2, baths: 2, area: "1,150", match: 88, agent: "Priya Singh" },
    { id: 3, title: "Sobha Dream Acres", location: "Panathur", price: "₹11.2 L", type: "2BHK", beds: 2, baths: 2, area: "1,100", match: 82, agent: "Arjun Mehta" },
    { id: 4, title: "Godrej Platinum", location: "HSR Layout", price: "₹15.5 L", type: "2BHK", beds: 2, baths: 3, area: "1,350", match: 78, agent: "Rahul Kumar" },
];

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

const priorityColors: Record<string, string> = { high: "bg-red-500", medium: "bg-amber-400", low: "bg-neutral-300" };

const PIPELINE_STAGES = ["New", "Contacted", "Site Visit", "Negotiation", "Documentation", "Closed Won"];

export default function LeadDetailPage() {
    const router = useRouter();
    const params = useParams();
    const lead = LEADS.find((l) => l.id === Number(params.id)) || LEADS[0];
    const currentStageIdx = PIPELINE_STAGES.indexOf(lead.status);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Back Button */}
            <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-800 transition-colors font-medium">
                <ArrowLeft size={16} /> Back to Leads
            </button>

            {/* Hero Card */}
            <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-lg font-bold text-primary border border-primary/10">
                            {lead.name.charAt(0)}
                        </div>
                        <div>
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-xl font-bold text-neutral-900">{lead.name}</h1>
                                <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${lead.statusColor}`}>{lead.status}</span>
                                <span className="flex items-center gap-1.5">
                                    <span className={`w-2 h-2 rounded-full ${priorityColors[lead.priority]}`} />
                                    <span className="text-xs text-neutral-400 uppercase font-medium">{lead.priority} priority</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-4 mt-2 flex-wrap">
                                <span className="text-xs text-neutral-500 flex items-center gap-1.5"><Phone size={12} />{lead.phone}</span>
                                <span className="text-xs text-neutral-500 flex items-center gap-1.5"><Mail size={12} />{lead.email}</span>
                                <span className="text-xs text-neutral-500 flex items-center gap-1.5"><MapPin size={12} />{lead.location}</span>
                                <span className="text-xs text-neutral-400 flex items-center gap-1.5"><Calendar size={12} />{lead.date}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <button className="p-2.5 rounded-xl text-neutral-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors border border-neutral-100"><Phone size={16} /></button>
                        <button className="p-2.5 rounded-xl text-neutral-400 hover:text-primary hover:bg-primary/5 transition-colors border border-neutral-100"><MessageSquare size={16} /></button>
                        <button className="p-2.5 rounded-xl text-neutral-400 hover:text-blue-600 hover:bg-blue-50 transition-colors border border-neutral-100"><Share2 size={16} /></button>
                        <button className="p-2.5 rounded-xl text-neutral-400 hover:text-amber-600 hover:bg-amber-50 transition-colors border border-neutral-100"><Edit size={16} /></button>
                    </div>
                </div>

                {/* Pipeline Progress */}
                <div className="mt-5 pt-5 border-t border-neutral-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Pipeline Progress</span>
                        <span className="text-xs font-bold text-primary">{lead.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden mb-3">
                        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${lead.progress}%` }} />
                    </div>
                    <div className="flex items-center gap-1">
                        {PIPELINE_STAGES.map((stage, i) => {
                            const isActive = i <= currentStageIdx;
                            const isCurrent = i === currentStageIdx;
                            return (
                                <div key={stage} className="flex-1 flex items-center gap-1">
                                    <div className={`flex-1 h-1.5 rounded-full transition-all ${isActive ? "bg-primary" : "bg-neutral-100"}`} />
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
                    { label: "Property Type", value: lead.type, icon: Home, color: "text-primary", bg: "bg-primary/5" },
                    { label: "Assigned Agent", value: lead.agent, icon: User, color: "text-violet-500", bg: "bg-violet-50" },
                    { label: "Source", value: lead.source, icon: FileText, color: "text-blue-500", bg: "bg-blue-50" },
                ].map((info) => {
                    const Icon = info.icon;
                    return (
                        <div key={info.label} className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
                            <div className={`w-9 h-9 ${info.bg} rounded-xl flex items-center justify-center mb-3`}>
                                <Icon size={16} className={info.color} strokeWidth={2} />
                            </div>
                            <p className="text-sm font-bold text-neutral-900">{info.value}</p>
                            <p className="text-xs text-neutral-400 uppercase tracking-wider mt-1">{info.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Activity Timeline + Notes/Visits */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {/* Full Activity Timeline */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm">
                    <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Activity Timeline</h3>
                    <p className="text-[10px] text-neutral-400 mb-5">{FULL_TIMELINE.length} events tracked</p>
                    <div className="space-y-0.5 max-h-[600px] overflow-y-auto pr-1">
                        {FULL_TIMELINE.map((act, i) => {
                            const Icon = act.icon;
                            const colors = timelineIconColors[act.type] || { bg: "bg-neutral-100", text: "text-neutral-500" };
                            return (
                                <div key={i} className="flex gap-3 group">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-7 h-7 rounded-lg ${colors.bg} flex items-center justify-center shrink-0`}>
                                            <Icon size={13} className={colors.text} />
                                        </div>
                                        {i < FULL_TIMELINE.length - 1 && <div className="w-px flex-1 bg-neutral-100 mt-1 min-h-[16px]" />}
                                    </div>
                                    <div className="pb-5 flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-neutral-800 leading-snug">{act.action}</p>
                                        <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">{act.detail}</p>
                                        <p className="text-[10px] text-neutral-400 mt-1.5 flex items-center gap-1"><Clock size={9} />{act.time}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Notes + Site Visits */}
                <div className="lg:col-span-3 space-y-4">
                    {/* Notes */}
                    <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Notes</h3>
                            <button className="text-xs font-semibold text-primary hover:underline">+ Add Note</button>
                        </div>
                        <div className="space-y-3">
                            {NOTES.map((note, i) => (
                                <div key={i} className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                                    <p className="text-sm text-neutral-700 leading-relaxed">{note.text}</p>
                                    <div className="flex items-center gap-2 mt-3">
                                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[8px] font-bold text-primary">{note.author.charAt(0)}</div>
                                        <span className="text-xs text-neutral-500 font-medium">{note.author}</span>
                                        <span className="text-neutral-300">•</span>
                                        <span className="text-xs text-neutral-400">{note.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Site Visits with Google Maps */}
                    <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Site Visits</h3>
                            <button className="text-xs font-semibold text-primary hover:underline">+ Schedule Visit</button>
                        </div>
                        <div className="space-y-3">
                            {SITE_VISITS.map((visit, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                                    <div>
                                        <p className="text-sm font-medium text-neutral-800">{visit.property}</p>
                                        <p className="text-xs text-neutral-400 mt-1 flex items-center gap-1"><MapPin size={10} />{visit.location}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <p className="text-xs text-neutral-500">{visit.date}</p>
                                            <span className={`text-xs font-bold ${visit.status === "Scheduled" ? "text-emerald-500" : "text-amber-500"}`}>{visit.status}</span>
                                        </div>
                                        <a href={visit.mapLink} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors" title="Open in Google Maps">
                                            <Navigation size={14} />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Matching Properties (Lead-to-Inventory) */}
            <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-bold text-neutral-900">Matching Properties</h3>
                    <span className="text-xs text-neutral-400">Based on {lead.type} · {lead.budget} · {lead.location}</span>
                </div>
                <p className="text-xs text-neutral-400 mb-5">Auto-suggested properties matching this lead&apos;s requirements</p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {MATCHING_PROPERTIES.map((prop) => (
                        <div key={prop.id} className="border border-neutral-100 rounded-2xl p-4 hover:shadow-lg hover:border-primary/20 transition-all duration-300 relative group">
                            {/* Match Badge */}
                            <div className={`absolute top-3 right-3 px-2 py-0.5 rounded-lg text-[9px] font-bold ${prop.match >= 90 ? "bg-emerald-100 text-emerald-700" : prop.match >= 80 ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>
                                {prop.match}% match
                            </div>

                            {/* Image placeholder */}
                            <div className="h-24 bg-neutral-100 rounded-xl mb-3 flex items-center justify-center">
                                <Home size={24} className="text-neutral-300" />
                            </div>

                            <h4 className="text-sm font-bold text-neutral-900 mb-1 truncate">{prop.title}</h4>
                            <p className="text-xs text-neutral-500 flex items-center gap-1 mb-2"><MapPin size={10} />{prop.location}</p>

                            <p className="text-lg font-bold text-primary mb-3">{prop.price}</p>

                            <div className="flex items-center gap-3 text-[10px] text-neutral-500 mb-3">
                                <span className="flex items-center gap-1"><BedDouble size={10} />{prop.beds}</span>
                                <span className="flex items-center gap-1"><Bath size={10} />{prop.baths}</span>
                                <span className="flex items-center gap-1"><Maximize size={10} />{prop.area} sqft</span>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                                <span className="text-[10px] text-neutral-400 flex items-center gap-1"><User size={10} />{prop.agent}</span>
                                <button className="text-[10px] font-bold text-primary hover:underline">View →</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
