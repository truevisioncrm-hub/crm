"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    ArrowLeft, MapPin, BedDouble, Bath, Maximize, Heart, Share2, Phone, MessageSquare,
    Home, Clock, Eye, Star, Compass,
    Car, Trees, Dumbbell, Shield, Waves, Loader2
} from "lucide-react";

interface Property {
    id: string;
    title: string;
    location: string;
    price: number | string;
    property_type: string;
    bedrooms: number;
    bathrooms: number;
    area_sqft: number;
    status: string;
    description: string;
    images: string[];
    features: any;
    created_at: string;
    pf_listing_id?: string;
    bua_sqft?: number;
    completion_status?: string;
    furnished?: string;
}

const AMENITIES = [
    { label: "Swimming Pool", icon: Waves },
    { label: "Gym", icon: Dumbbell },
    { label: "Parking", icon: Car },
    { label: "Garden", icon: Trees },
    { label: "Security", icon: Shield },
    { label: "Clubhouse", icon: Home },
];

export default function PropertyDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [publishingToPF, setPublishingToPF] = useState(false);

    const publishToPF = async () => {
        if (!confirm("Are you sure you want to publish this property to Property Finder?")) return;

        setPublishingToPF(true);
        try {
            const res = await fetch('/api/admin/propertyfinder/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ propertyId: id })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to publish");

            alert("✅ " + (data.message || "Successfully published to Property Finder!"));

            // Refresh property data
            const refreshRes = await fetch(`/api/admin/properties/${id}`);
            if (refreshRes.ok) {
                setProperty(await refreshRes.json());
            }
        } catch (err: any) {
            alert(`❌ Error publishing to Property Finder:\n\n${err.message}`);
        } finally {
            setPublishingToPF(false);
        }
    };

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await fetch(`/api/admin/properties/${id}`);
                if (!res.ok) throw new Error("Property not found");
                const data = await res.json();
                setProperty(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProperty();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-neutral-500 font-medium">Loading property details...</p>
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="p-8 text-center">
                <p className="text-red-500 font-bold mb-4">Error: {error || "Property not found"}</p>
                <button onClick={() => router.back()} className="text-primary font-semibold hover:underline flex items-center gap-2 justify-center mx-auto">
                    <ArrowLeft size={16} /> Back to Inventory
                </button>
            </div>
        );
    }

    const statusColor = property.status === "available" ? "bg-emerald-500" : property.status === "reserved" ? "bg-amber-500" : "bg-red-500";
    // Format AED price — could be a number or a display string like "AED 1M - 1.5M"
    const formattedPrice = typeof property.price === 'number'
        ? new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(property.price)
        : property.price;

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
                    <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-xl text-xs font-bold text-neutral-900 shadow uppercase">
                        {property.property_type}
                    </div>
                    <div className={`absolute top-5 right-5 ${statusColor} text-white px-4 py-1.5 rounded-xl text-xs font-bold shadow capitalize`}>
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
                            <p className="text-3xl font-bold text-primary">{formattedPrice}</p>
                            {typeof property.price === 'number' && property.area_sqft > 0 && (
                                <p className="text-xs text-neutral-400 mt-0.5">AED {(Number(property.price) / property.area_sqft).toFixed(0)} / sqft</p>
                            )}
                        </div>
                        <div className="flex gap-3">
                            {property.pf_listing_id ? (
                                <button disabled className="flex items-center gap-2 px-4 py-2.5 bg-neutral-100 text-neutral-500 border border-neutral-200 rounded-xl text-sm font-semibold cursor-not-allowed">
                                    🏢 Published to PF
                                </button>
                            ) : (
                                <button
                                    onClick={publishToPF}
                                    disabled={publishingToPF}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-[#ef3e42] text-white rounded-xl text-sm font-semibold hover:bg-[#d4373b] transition-colors shadow-lg shadow-red-500/25 disabled:opacity-50">
                                    {publishingToPF ? <Loader2 size={16} className="animate-spin" /> : "🏢 Publish to PF"}
                                </button>
                            )}
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/25">
                                <Phone size={16} /> Call Owner
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25">
                                <MessageSquare size={16} /> Message
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-neutral-50 rounded-2xl">
                        <div className="flex flex-col items-center gap-1 border-r border-neutral-200 last:border-0">
                            <BedDouble size={18} className="text-neutral-400" />
                            <span className="text-sm font-bold text-neutral-900">{property.bedrooms}</span>
                            <span className="text-[10px] text-neutral-400 uppercase font-medium">Bedrooms</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 border-r border-neutral-200 last:border-0">
                            <Bath size={18} className="text-neutral-400" />
                            <span className="text-sm font-bold text-neutral-900">{property.bathrooms}</span>
                            <span className="text-[10px] text-neutral-400 uppercase font-medium">Bathrooms</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 border-r border-neutral-200 last:border-0">
                            <Maximize size={18} className="text-neutral-400" />
                            <span className="text-sm font-bold text-neutral-900">{property.area_sqft}</span>
                            <span className="text-[10px] text-neutral-400 uppercase font-medium">Sq. Ft.</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <Compass size={18} className="text-neutral-400" />
                            <span className="text-sm font-bold text-neutral-900">East</span>
                            <span className="text-[10px] text-neutral-400 uppercase font-medium">Facing</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Description + Amenities */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
                        <h2 className="text-lg font-bold text-neutral-900 mb-4">Description</h2>
                        <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-line">
                            {property.description || "No description provided for this property."}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
                        <h2 className="text-lg font-bold text-neutral-900 mb-6">Top Amenities</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                            {AMENITIES.map((item) => (
                                <div key={item.label} className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-primary border border-neutral-100">
                                        <item.icon size={20} />
                                    </div>
                                    <span className="text-sm font-medium text-neutral-700">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
                        <h2 className="text-lg font-bold text-neutral-900 mb-4">Property Info</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm py-2 border-b border-neutral-50">
                                <span className="text-neutral-400 flex items-center gap-2"><Home size={14} /> Property Type</span>
                                <span className="font-semibold text-neutral-900 capitalize">{property.property_type}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm py-2 border-b border-neutral-100">
                                <span className="text-neutral-400 flex items-center gap-2"><Clock size={14} /> Added On</span>
                                <span className="font-semibold text-neutral-900">{new Date(property.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm py-2 border-b border-neutral-100">
                                <span className="text-neutral-400 flex items-center gap-2"><Maximize size={14} /> Plot Area</span>
                                <span className="font-semibold text-neutral-900">{property.area_sqft || 0} sqft</span>
                            </div>
                            {property.bua_sqft && (
                                <div className="flex items-center justify-between text-sm py-2 border-b border-neutral-100">
                                    <span className="text-neutral-400 flex items-center gap-2"><Maximize size={14} /> Built-up Area</span>
                                    <span className="font-semibold text-neutral-900">{property.bua_sqft} sqft</span>
                                </div>
                            )}
                            {property.completion_status && (
                                <div className="flex items-center justify-between text-sm py-2 border-b border-neutral-100">
                                    <span className="text-neutral-400 flex items-center gap-2"><Star size={14} /> Completion</span>
                                    <span className="font-semibold text-neutral-900">{property.completion_status}</span>
                                </div>
                            )}
                            {property.furnished && (
                                <div className="flex items-center justify-between text-sm py-2 border-b border-neutral-100">
                                    <span className="text-neutral-400 flex items-center gap-2"><Star size={14} /> Furnishing</span>
                                    <span className="font-semibold text-neutral-900">{property.furnished}</span>
                                </div>
                            )}
                            <div className="flex items-center justify-between text-sm py-2">
                                <span className="text-neutral-400 flex items-center gap-2"><Star size={14} /> DLD Reference</span>
                                <span className="font-semibold text-neutral-900 uppercase">Applied</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm">
                                <Star size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-neutral-900">Lead Score: High</h3>
                                <p className="text-xs text-neutral-500">Based on recent interest</p>
                            </div>
                        </div>
                        <div className="bg-white/60 backdrop-blur-sm p-3 rounded-xl border border-white flex items-center justify-between">
                            <span className="text-xs font-bold text-neutral-600 flex items-center gap-1.5"><Eye size={14} /> 24 Views today</span>
                            <span className="text-[10px] font-bold text-emerald-600">+15% week</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
