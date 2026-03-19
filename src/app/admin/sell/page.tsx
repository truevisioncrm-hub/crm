"use client";

import { useState, useEffect } from "react";
import { Search, Filter, MapPin, BedDouble, Bath, Maximize, Heart, Share2, Plus, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import AddPropertyWizard from "@/components/AddPropertyWizard";
import { toast } from "sonner";

interface Property {
    id: string;
    title: string;
    location: string;
    price: string;
    type: string;
    bedrooms: number;
    bathrooms: number;
    area_sqft: number;
    status: string;
    property_type: string;
}

export default function SellInventoryPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [showWizard, setShowWizard] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/admin/properties?type=Sell");
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            setProperties(data);
        } catch (err: any) {
            console.error("Fetch Properties Error:", err.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteProperty = async (id: string, title: string) => {
        if (!confirm(`Delete "${title || 'this property'}"? This cannot be undone.`)) return;
        setDeletingId(id);
        try {
            const res = await fetch(`/api/admin/properties/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setProperties(prev => prev.filter(p => p.id !== id));
            toast.success("Property deleted.");
        } catch (err: any) {
            toast.error(err.message || "Failed to delete property");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Sell Properties</h1>
                    <p className="text-sm text-neutral-500 mt-1">Manage sale property listings across Dubai</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm font-semibold hover:bg-neutral-50 transition-colors shadow-sm">
                        <Filter size={16} /> Filters
                    </button>
                    <button
                        onClick={() => setShowWizard(true)}
                        className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25 flex items-center gap-2"
                    >
                        <Plus size={16} /> Add Property
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : properties.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-3xl border border-neutral-100 shadow-sm">
                    <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-neutral-400" />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900 mb-1">No properties found</h3>
                    <p className="text-sm text-neutral-500 mb-6 text-center max-w-sm">
                        No properties listed for sale yet. Add your first Dubai listing.
                    </p>
                    <button
                        onClick={() => setShowWizard(true)}
                        className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all"
                    >
                        + Add First Property
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                        <Link href={`/admin/sell/${property.id}`} key={property.id} className="group bg-white border border-neutral-100 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 card-shadow flex flex-col">
                            <div className="h-48 w-full bg-neutral-200 relative">
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-neutral-900 shadow-sm capitalize">
                                    {property.property_type || property.type}
                                </div>
                                <div className={`absolute top-4 right-4 px-3 py-1 rounded-lg text-xs font-bold shadow-sm ${
                                    property.status === "available" ? "bg-emerald-500 text-white" :
                                    property.status === "reserved" ? "bg-amber-500 text-white" :
                                    "bg-red-500 text-white"
                                }`}>
                                    {property.status}
                                </div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-neutral-900 mb-1 line-clamp-1">{property.title || "Untitled Property"}</h3>
                                    <div className="flex items-center gap-1.5 text-neutral-500 text-sm mb-4">
                                        <MapPin size={14} className="shrink-0" />
                                        <span className="truncate">{property.location}</span>
                                    </div>
                                    <div className="flex items-center gap-3 mb-6 flex-wrap">
                                        {property.bedrooms && (
                                            <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 bg-neutral-50 px-2 py-1 rounded-lg">
                                                <BedDouble size={14} className="text-neutral-400" /> {property.bedrooms} Beds
                                            </div>
                                        )}
                                        {property.bathrooms && (
                                            <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 bg-neutral-50 px-2 py-1 rounded-lg">
                                                <Bath size={14} className="text-neutral-400" /> {property.bathrooms} Baths
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 bg-neutral-50 px-2 py-1 rounded-lg">
                                            <Maximize size={14} className="text-neutral-400" /> {property.area_sqft || 0} sqft
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-5 border-t border-neutral-100 flex items-center justify-between">
                                    <span className="text-xl font-bold text-primary">{property.price}</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={e => { e.preventDefault(); deleteProperty(property.id, property.title); }}
                                            disabled={deletingId === property.id}
                                            className="p-2 rounded-full hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-colors disabled:opacity-40"
                                        >
                                            {deletingId === property.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                        </button>
                                        <button className="p-2 rounded-full hover:bg-neutral-50 text-neutral-400 hover:text-neutral-900 transition-colors"><Share2 size={18} /></button>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Wizard */}
            {showWizard && (
                <AddPropertyWizard
                    listingType="Sell"
                    onClose={() => setShowWizard(false)}
                    onSuccess={() => {
                        setShowWizard(false);
                        fetchProperties();
                    }}
                />
            )}
        </div>
    );
}
