"use client";

import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft, MapPin, BedDouble, Bath, Maximize, Heart, Share2, Phone, MessageSquare,
    Calendar, IndianRupee, Home, User, FileText, Clock, CheckCircle, Eye, Star, Compass,
    Car, Trees, Dumbbell, Shield, Waves
} from "lucide-react";

const PROPERTIES = [
    { id: 1, title: "Prestige Lakeside Villa", location: "Whitefield, Bangalore", price: "₹4.5 Cr", pricePerSqft: "₹12,857", type: "Villa", beds: 4, baths: 5, area: "3,500", status: "Available", facing: "East", floor: "Ground + 2", parking: 2, furnished: "Semi-Furnished", ownership: "Freehold", ageYears: 2, description: "Luxurious lakeside villa with panoramic views, modern interiors, Italian marble flooring, modular kitchen with chimney, and private garden. Located in the heart of Whitefield with excellent connectivity to IT hubs.", builder: "Prestige Group", rera: "PRM/KA/RERA/1251/2024", agent: "Arjun Mehta" },
    { id: 2, title: "Brigade Panorama", location: "Koramangala, Bangalore", price: "₹1.2 Cr", pricePerSqft: "₹10,000", type: "Apartment", beds: 2, baths: 2, area: "1,200", status: "Reserved", facing: "North", floor: "14th of 22", parking: 1, furnished: "Unfurnished", ownership: "Freehold", ageYears: 0, description: "Brand new 2BHK apartment in the prime location of Koramangala. Features include a spacious living room, balcony with city view, modern amenities, and walking distance to restaurants and metro.", builder: "Brigade Group", rera: "PRM/KA/RERA/1389/2024", agent: "Priya Singh" },
    { id: 3, title: "Sobha City Heights", location: "Hebbal, Bangalore", price: "₹2.8 Cr", pricePerSqft: "₹13,333", type: "Penthouse", beds: 3, baths: 3, area: "2,100", status: "Available", facing: "South-East", floor: "Top Floor", parking: 2, furnished: "Fully Furnished", ownership: "Freehold", ageYears: 1, description: "Exclusive sky penthouse with private terrace, infinity-edge pool access, floor-to-ceiling windows, smart home automation, and breathtaking views of Hebbal lake.", builder: "Sobha Limited", rera: "PRM/KA/RERA/1567/2024", agent: "Arjun Mehta" },
    { id: 4, title: "Godrej Woods", location: "Sarjapur, Bangalore", price: "₹95 L", pricePerSqft: "₹8,636", type: "Apartment", beds: 2, baths: 2, area: "1,100", status: "Sold", facing: "West", floor: "8th of 15", parking: 1, furnished: "Semi-Furnished", ownership: "Freehold", ageYears: 3, description: "Affordable luxury apartment in Sarjapur Road. Features include a club house, swimming pool, jogging track, and proximity to top schools and hospitals.", builder: "Godrej Properties", rera: "PRM/KA/RERA/0982/2023", agent: "Rahul Kumar" },
    { id: 5, title: "Embassy One", location: "Indiranagar, Bangalore", price: "₹5.5 Cr", pricePerSqft: "₹13,095", type: "Villa", beds: 5, baths: 6, area: "4,200", status: "Available", facing: "North-East", floor: "Ground + 2", parking: 3, furnished: "Fully Furnished", ownership: "Freehold", ageYears: 1, description: "Ultra-premium villa in Indiranagar with designer interiors, private pool, home theater, rooftop lounge, and manicured garden. Walking distance to 100 Feet Road.", builder: "Embassy Group", rera: "PRM/KA/RERA/1701/2024", agent: "Sneha Patel" },
    { id: 6, title: "Prestige Golfshire", location: "Devanahalli, Bangalore", price: "₹8.5 Cr", pricePerSqft: "₹14,167", type: "Mansion", beds: 6, baths: 7, area: "6,000", status: "Available", facing: "South", floor: "Ground + 3", parking: 4, furnished: "Fully Furnished", ownership: "Freehold", ageYears: 0, description: "Majestic mansion inside the Prestige Golfshire township. Sprawling gardens, private pool, wine cellar, staff quarters, and panoramic views of the championship golf course.", builder: "Prestige Group", rera: "PRM/KA/RERA/1845/2024", agent: "Arjun Mehta" },
];

const AMENITIES = [
    { label: "Swimming Pool", icon: Waves },
    { label: "Gym", icon: Dumbbell },
    { label: "Parking", icon: Car },
    { label: "Garden", icon: Trees },
    { label: "Security", icon: Shield },
    { label: "Clubhouse", icon: Home },
];

const ENQUIRIES = [
    { name: "Rahul Sharma", date: "2 hours ago", message: "Interested in a site visit this weekend." },
    { name: "Meera Gupta", date: "1 day ago", message: "Can you share the floor plan?" },
    { name: "Anil Kapoor", date: "3 days ago", message: "What is the possession date?" },
];

const VISITS = [
    { client: "Ahmed Khan", date: "Feb 18, 2026", time: "10:30 AM", status: "Scheduled" },
    { client: "Sara Mirza", date: "Feb 15, 2026", time: "2:00 PM", status: "Completed" },
    { client: "David John", date: "Feb 12, 2026", time: "11:00 AM", status: "Completed" },
];

export default function PropertyDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = Number(params.id);
    const property = PROPERTIES.find((p) => p.id === id) || PROPERTIES[0];

    const statusColor = property.status === "Available" ? "bg-emerald-500" : property.status === "Reserved" ? "bg-amber-500" : "bg-red-500";

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Back */}
            <button onClick={() => router.back()} className="flex items-center gap-2 text-xs text-neutral-400 hover:text-neutral-800 transition-colors">
                <ArrowLeft size={14} /> Back to Sell
            </button>

            {/* Hero Card */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
                {/* Image Area */}
                <div className="h-56 sm:h-72 bg-neutral-200 relative">
                    <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-xl text-xs font-bold text-neutral-900 shadow">
                        {property.type}
                    </div>
                    <div className={`absolute top-5 right-5 ${statusColor} text-white px-4 py-1.5 rounded-xl text-xs font-bold shadow`}>
                        {property.status}
                    </div>
                    {/* Bottom gradient */}
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white drop-shadow-lg">{property.title}</h1>
                            <div className="flex items-center gap-1.5 text-white/80 text-sm mt-1">
                                <MapPin size={14} /> {property.location}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors">
                                <Heart size={18} />
                            </button>
                            <button className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors">
                                <Share2 size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Price + Quick Info */}
                <div className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div>
                            <p className="text-3xl font-bold text-primary">{property.price}</p>
                            <p className="text-xs text-neutral-400 mt-0.5">{property.pricePerSqft} / sqft</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/25">
                                <Phone size={16} /> Call Owner
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25">
                                <MessageSquare size={16} /> Message
                            </button>
                        </div>
                    </div>

                    {/* Specs Row */}
                    <div className="flex flex-wrap gap-3">
                        {[
                            { icon: BedDouble, label: `${property.beds} Bedrooms` },
                            { icon: Bath, label: `${property.baths} Bathrooms` },
                            { icon: Maximize, label: `${property.area} sqft` },
                            { icon: Compass, label: `${property.facing} Facing` },
                            { icon: Home, label: property.floor },
                            { icon: Car, label: `${property.parking} Parking` },
                        ].map((spec) => {
                            const Icon = spec.icon;
                            return (
                                <div key={spec.label} className="flex items-center gap-2 bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-2.5">
                                    <Icon size={16} className="text-neutral-400" />
                                    <span className="text-xs font-medium text-neutral-700">{spec.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Furnished", value: property.furnished, icon: Home, color: "text-primary" },
                    { label: "Ownership", value: property.ownership, icon: FileText, color: "text-emerald-600" },
                    { label: "Property Age", value: property.ageYears === 0 ? "New" : `${property.ageYears} Years`, icon: Calendar, color: "text-amber-600" },
                    { label: "Listed By", value: property.agent, icon: User, color: "text-violet-600" },
                ].map((info) => {
                    const Icon = info.icon;
                    return (
                        <div key={info.label} className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
                            <div className={`w-9 h-9 rounded-xl ${info.color} bg-opacity-10 flex items-center justify-center mb-3`} style={{ backgroundColor: "currentColor", opacity: 0.08 }}>
                                <Icon size={18} className={info.color} style={{ opacity: 1 }} />
                            </div>
                            <p className="text-sm font-bold text-neutral-900">{info.value}</p>
                            <p className="text-[10px] text-neutral-400 uppercase tracking-wider mt-0.5">{info.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Two Column: Description + Details | Enquiries + Visits */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Description */}
                    <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-neutral-900 mb-3">About this Property</h3>
                        <p className="text-sm text-neutral-600 leading-relaxed">{property.description}</p>

                        <div className="mt-5 pt-5 border-t border-neutral-100">
                            <div className="flex items-center gap-2 mb-2">
                                <Shield size={14} className="text-emerald-500" />
                                <span className="text-xs font-semibold text-emerald-600">RERA Verified</span>
                            </div>
                            <p className="text-[11px] text-neutral-400">RERA No: {property.rera}</p>
                            <p className="text-[11px] text-neutral-400">Builder: {property.builder}</p>
                        </div>
                    </div>

                    {/* Amenities */}
                    <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-neutral-900 mb-4">Amenities</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {AMENITIES.map((amenity) => {
                                const Icon = amenity.icon;
                                return (
                                    <div key={amenity.label} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <Icon size={16} className="text-primary" />
                                        </div>
                                        <span className="text-xs font-medium text-neutral-700">{amenity.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Recent Enquiries */}
                    <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-neutral-900">Recent Enquiries</h3>
                            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">{ENQUIRIES.length}</span>
                        </div>
                        <div className="space-y-3">
                            {ENQUIRIES.map((enq, i) => (
                                <div key={i} className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/10">
                                                {enq.name.charAt(0)}
                                            </div>
                                            <span className="text-xs font-bold text-neutral-800">{enq.name}</span>
                                        </div>
                                        <span className="text-[10px] text-neutral-400">{enq.date}</span>
                                    </div>
                                    <p className="text-[11px] text-neutral-500 pl-9">{enq.message}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Site Visits */}
                    <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-neutral-900">Site Visits</h3>
                            <button className="text-[10px] font-bold text-primary hover:underline">+ Schedule</button>
                        </div>
                        <div className="space-y-3">
                            {VISITS.map((visit, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                                    <div>
                                        <p className="text-xs font-bold text-neutral-800">{visit.client}</p>
                                        <p className="text-[10px] text-neutral-400 mt-0.5 flex items-center gap-1">
                                            <Calendar size={9} /> {visit.date} · {visit.time}
                                        </p>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${visit.status === "Scheduled" ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"}`}>
                                        {visit.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-neutral-900 mb-4">Listing Performance</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: "Views", value: "1,245", icon: Eye, color: "text-blue-600" },
                                { label: "Enquiries", value: "23", icon: MessageSquare, color: "text-emerald-600" },
                                { label: "Shortlisted", value: "18", icon: Star, color: "text-amber-600" },
                                { label: "Site Visits", value: "5", icon: CheckCircle, color: "text-violet-600" },
                            ].map((stat) => {
                                const Icon = stat.icon;
                                return (
                                    <div key={stat.label} className="text-center p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                                        <Icon size={16} className={`${stat.color} mx-auto mb-1.5`} />
                                        <p className="text-lg font-bold text-neutral-900">{stat.value}</p>
                                        <p className="text-[9px] text-neutral-400 uppercase tracking-wider">{stat.label}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
