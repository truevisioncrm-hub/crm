"use client";

import { MapPin, Calendar, CheckCircle2, Navigation, Phone } from "lucide-react";

const MY_VISITS = [
    { id: 1, client: "Ravi Patel", property: "Prestige Lakeside Villa", location: "Whitefield", time: "10:00 AM", date: "Today", status: "Scheduled" },
    { id: 2, client: "Sara Mirza", property: "Brigade Panorama", location: "Koramangala", time: "2:30 PM", date: "Today", status: "Scheduled" },
    { id: 3, client: "Mohan", property: "Sobha City", location: "Hebbal", time: "11:00 AM", date: "Tomorrow", status: "Scheduled" },
];

export default function AgentVisitsPage() {
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">My Visits</h1>
                    <p className="text-sm text-neutral-500 mt-1">Upcoming site visits and inspections</p>
                </div>
                <button className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25">
                    + Schedule New
                </button>
            </div>

            {/* Timeline */}
            <div className="space-y-4 max-w-3xl">
                {MY_VISITS.map((visit) => (
                    <div key={visit.id} className="group bg-white border border-neutral-100 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 card-shadow flex flex-col sm:flex-row gap-5">
                        <div className="flex sm:flex-col items-center justify-center p-4 bg-neutral-50 rounded-xl min-w-[80px] border border-neutral-100 gap-2 sm:gap-0">
                            <span className="text-lg font-bold text-neutral-900">{visit.time}</span>
                            <span className="text-[10px] font-semibold text-neutral-500 uppercase mt-0.5">{visit.date}</span>
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-neutral-900 text-lg">{visit.client}</h3>
                                    <p className="text-sm text-neutral-500 mt-0.5">{visit.property}</p>
                                </div>
                                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wide">
                                    {visit.status}
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 mt-4">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-medium text-neutral-600">
                                    <MapPin size={14} /> {visit.location}
                                </div>
                                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-dark transition-colors shadow-sm">
                                    <Navigation size={12} /> Start Navigation
                                </button>
                                <button className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 rounded-lg text-xs font-bold hover:bg-neutral-50 transition-colors text-neutral-600">
                                    <Phone size={12} /> Call Client
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
