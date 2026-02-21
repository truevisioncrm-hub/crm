"use client";

import { Search, Filter, MapPin, BedDouble, Bath, Maximize, Heart, Share2 } from "lucide-react";
import Link from "next/link";

const PROPERTIES = [
    { id: 1, title: "Prestige Lakeside Villa", location: "Whitefield, Bangalore", price: "₹4.5 Cr", type: "Villa", beds: 4, baths: 5, area: "3,500", status: "Available", image: "bg-neutral-200" },
    { id: 2, title: "Brigade Panorama", location: "Koramangala, Bangalore", price: "₹1.2 Cr", type: "Apartment", beds: 2, baths: 2, area: "1,200", status: "Reserved", image: "bg-neutral-200" },
    { id: 3, title: "Sobha City Heights", location: "Hebbal, Bangalore", price: "₹2.8 Cr", type: "Penthouse", beds: 3, baths: 3, area: "2,100", status: "Available", image: "bg-neutral-200" },
    { id: 4, title: "Godrej Woods", location: "Sarjapur, Bangalore", price: "₹95 L", type: "Apartment", beds: 2, baths: 2, area: "1,100", status: "Sold", image: "bg-neutral-200" },
    { id: 5, title: "Embassy One", location: "Indiranagar, Bangalore", price: "₹5.5 Cr", type: "Villa", beds: 5, baths: 6, area: "4,200", status: "Available", image: "bg-neutral-200" },
    { id: 6, title: "Prestige Golfshire", location: "Devanahalli, Bangalore", price: "₹8.5 Cr", type: "Mansion", beds: 6, baths: 7, area: "6,000", status: "Available", image: "bg-neutral-200" },
];

export default function InventoryPage() {
    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Rent Properties</h1>
                    <p className="text-sm text-neutral-500 mt-1">Manage property listings and availability</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm font-semibold hover:bg-neutral-50 transition-colors shadow-sm">
                        <Filter size={16} /> Filters
                    </button>
                    <button className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25">
                        + Add Rent
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {PROPERTIES.map((property) => (
                    <Link href={`/admin/rent/${property.id}`} key={property.id} className="group bg-white border border-neutral-100 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 card-shadow flex flex-col">

                        {/* Image Placeholder */}
                        <div className={`h-48 w-full ${property.image} relative`}>
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-neutral-900 shadow-sm">
                                {property.type}
                            </div>
                            <div className={`absolute top-4 right-4 px-3 py-1 rounded-lg text-xs font-bold shadow-sm ${property.status === "Available" ? "bg-emerald-500 text-white" :
                                property.status === "Reserved" ? "bg-amber-500 text-white" :
                                    "bg-red-500 text-white"
                                }`}>
                                {property.status}
                            </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col">
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-neutral-900 mb-1 line-clamp-1">{property.title}</h3>
                                <div className="flex items-center gap-1.5 text-neutral-500 text-sm mb-4">
                                    <MapPin size={14} className="shrink-0" />
                                    <span className="truncate">{property.location}</span>
                                </div>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 bg-neutral-50 px-2 py-1 rounded-lg">
                                        <BedDouble size={14} className="text-neutral-400" /> {property.beds} Beds
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 bg-neutral-50 px-2 py-1 rounded-lg">
                                        <Bath size={14} className="text-neutral-400" /> {property.baths} Baths
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 bg-neutral-50 px-2 py-1 rounded-lg">
                                        <Maximize size={14} className="text-neutral-400" /> {property.area} sqft
                                    </div>
                                </div>
                            </div>

                            <div className="pt-5 border-t border-neutral-100 flex items-center justify-between">
                                <span className="text-xl font-bold text-primary">{property.price}</span>
                                <div className="flex gap-2">
                                    <button className="p-2 rounded-full hover:bg-neutral-50 text-neutral-400 hover:text-red-500 transition-colors">
                                        <Heart size={18} />
                                    </button>
                                    <button className="p-2 rounded-full hover:bg-neutral-50 text-neutral-400 hover:text-neutral-900 transition-colors">
                                        <Share2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div >
    );
}
