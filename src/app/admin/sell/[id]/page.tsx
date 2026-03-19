"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    ArrowLeft, MapPin, BedDouble, Bath, Maximize, Share2, Phone, MessageSquare,
    Home, Clock, Star, Car, Loader2, Building2, Layers, Calendar, User,
    Globe, Video, Camera, CheckCircle2, DollarSign, X
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
    plot_size_sqft?: number;
    bua_sqft?: number;
    status: string;
    description: string;
    images: string[];
    features: Record<string, any>;
    created_at: string;
    pf_listing_id?: string;
    completion_status?: string;
    furnished?: string;
    // New wizard fields
    developer?: string;
    total_floors?: number;
    floor_no?: number;
    build_year?: number;
    occupancy?: string;
    availability_date?: string;
    parking?: number;
    unit_no?: string;
    source_of_listing?: string;
    service_charge?: number;
    ac_charge?: number;
    video_url?: string;
    view360_url?: string;
    portals?: Record<string, boolean>;
    owner_name?: string;
    owner_email?: string;
    owner_phone?: string;
    owner_nationality?: string;
}

export default function PropertyDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [publishingToPF, setPublishingToPF] = useState(false);
    const [activeImage, setActiveImage] = useState(0);
    const [lightbox, setLightbox] = useState<number | null>(null);

    const publishToPF = async () => {
        if (!confirm("Publish this property to Property Finder?")) return;
        setPublishingToPF(true);
        try {
            const res = await fetch("/api/admin/propertyfinder/publish", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ propertyId: id }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to publish");
            alert("✅ " + (data.message || "Published to Property Finder!"));
            const refresh = await fetch(`/api/admin/properties/${id}`);
            if (refresh.ok) setProperty(await refresh.json());
        } catch (err: any) {
            alert(`❌ ${err.message}`);
        } finally {
            setPublishingToPF(false);
        }
    };

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await fetch(`/api/admin/properties/${id}`);
                if (!res.ok) throw new Error("Property not found");
                setProperty(await res.json());
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchProperty();
    }, [id]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-neutral-500 font-medium">Loading property details...</p>
        </div>
    );

    if (error || !property) return (
        <div className="p-8 text-center">
            <p className="text-red-500 font-bold mb-4">{error || "Property not found"}</p>
            <button onClick={() => router.back()} className="text-primary font-semibold hover:underline flex items-center gap-2 justify-center mx-auto">
                <ArrowLeft size={16} /> Back
            </button>
        </div>
    );

    const images: string[] = Array.isArray(property.images) && property.images.length > 0 ? property.images : [];
    const statusColor = property.status === "available" ? "bg-emerald-500" : property.status === "reserved" ? "bg-amber-500" : "bg-red-500";
    const formattedPrice = typeof property.price === "number"
        ? new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED", maximumFractionDigits: 0 }).format(property.price)
        : property.price;

    const amenities = Object.keys(property.features || {}).filter(k => property.features[k] === true && k !== "listing_type" && k !== "cheques");

    const infoRow = (icon: React.ReactNode, label: string, value: React.ReactNode) => value ? (
        <div className="flex items-center justify-between text-sm py-2.5 border-b border-neutral-50 last:border-0">
            <span className="text-neutral-500 flex items-center gap-2">{icon} {label}</span>
            <span className="font-semibold text-neutral-900 text-right">{value}</span>
        </div>
    ) : null;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Back */}
            <button onClick={() => router.back()} className="flex items-center gap-2 text-xs text-neutral-400 hover:text-neutral-800 transition-colors">
                <ArrowLeft size={14} /> Back to Sell
            </button>

            {/* Lightbox */}
            {lightbox !== null && images.length > 0 && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={() => setLightbox(null)}>
                    <button className="absolute top-4 right-4 text-white/70 hover:text-white"><X size={28} /></button>
                    <img src={images[lightbox]} alt="" className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain" onClick={e => e.stopPropagation()} />
                    {images.length > 1 && (
                        <div className="absolute bottom-6 flex gap-2">
                            {images.map((_, i) => (
                                <button key={i} onClick={e => { e.stopPropagation(); setLightbox(i); }}
                                    className={`w-2 h-2 rounded-full transition-all ${i === lightbox ? "bg-white scale-125" : "bg-white/40"}`} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Hero / Image Gallery */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
                <div className="relative">
                    {/* Main image */}
                    <div
                        className="h-64 sm:h-80 bg-neutral-200 relative overflow-hidden cursor-pointer"
                        onClick={() => images.length > 0 && setLightbox(activeImage)}
                    >
                        {images.length > 0 ? (
                            <img src={images[activeImage]} alt={property.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                <Camera size={48} />
                            </div>
                        )}
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl text-xs font-bold text-neutral-900 shadow capitalize">
                            {property.property_type}
                        </div>
                        <div className={`absolute top-4 right-4 ${statusColor} text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow capitalize`}>
                            {property.status}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-5 right-5">
                            <h1 className="text-2xl font-bold text-white drop-shadow-lg">{property.title || "Property for Sale"}</h1>
                            <div className="flex items-center gap-1.5 text-white/80 text-sm mt-1">
                                <MapPin size={14} /> {property.location || "Dubai"}
                            </div>
                        </div>
                        {images.length > 0 && (
                            <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm">
                                {activeImage + 1} / {images.length}
                            </div>
                        )}
                    </div>

                    {/* Thumbnail strip */}
                    {images.length > 1 && (
                        <div className="flex gap-2 p-3 overflow-x-auto custom-scrollbar bg-neutral-50 border-t border-neutral-100">
                            {images.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImage(i)}
                                    className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === activeImage ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"}`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Price + Actions */}
                <div className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div>
                            <p className="text-3xl font-bold text-primary">{formattedPrice}</p>
                            {typeof property.price === "number" && property.area_sqft > 0 && (
                                <p className="text-xs text-neutral-400 mt-0.5">AED {(Number(property.price) / property.area_sqft).toFixed(0)} / sqft</p>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {property.pf_listing_id ? (
                                <button disabled className="flex items-center gap-2 px-4 py-2.5 bg-neutral-100 text-neutral-500 border border-neutral-200 rounded-xl text-sm font-semibold cursor-not-allowed">
                                    🏢 Published to PF
                                </button>
                            ) : (
                                <button onClick={publishToPF} disabled={publishingToPF}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-[#ef3e42] text-white rounded-xl text-sm font-semibold hover:bg-[#d4373b] transition-colors shadow-lg shadow-red-500/25 disabled:opacity-50">
                                    {publishingToPF ? <Loader2 size={16} className="animate-spin" /> : "🏢"} Publish to PF
                                </button>
                            )}
                            {property.owner_phone && (
                                <a href={`tel:${property.owner_phone}`}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/25">
                                    <Phone size={16} /> Call Owner
                                </a>
                            )}
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25">
                                <MessageSquare size={16} /> Message
                            </button>
                            <button className="p-2.5 rounded-xl border border-neutral-200 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 transition-colors">
                                <Share2 size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Quick stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-neutral-50 rounded-2xl">
                        <div className="flex flex-col items-center gap-1 border-r border-neutral-200 last:border-0">
                            <BedDouble size={18} className="text-neutral-400" />
                            <span className="text-sm font-bold text-neutral-900">{property.bedrooms || "Studio"}</span>
                            <span className="text-[10px] text-neutral-400 uppercase font-medium">Bedrooms</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 border-r border-neutral-200 last:border-0">
                            <Bath size={18} className="text-neutral-400" />
                            <span className="text-sm font-bold text-neutral-900">{property.bathrooms || "-"}</span>
                            <span className="text-[10px] text-neutral-400 uppercase font-medium">Bathrooms</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 border-r border-neutral-200 last:border-0">
                            <Maximize size={18} className="text-neutral-400" />
                            <span className="text-sm font-bold text-neutral-900">{property.area_sqft || "-"}</span>
                            <span className="text-[10px] text-neutral-400 uppercase font-medium">Sq. Ft.</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <Car size={18} className="text-neutral-400" />
                            <span className="text-sm font-bold text-neutral-900">{property.parking || "-"}</span>
                            <span className="text-[10px] text-neutral-400 uppercase font-medium">Parking</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Description */}
                    {property.description && (
                        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
                            <h2 className="text-lg font-bold text-neutral-900 mb-4">Description</h2>
                            <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-line">{property.description}</p>
                        </div>
                    )}

                    {/* Amenities */}
                    {amenities.length > 0 && (
                        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
                            <h2 className="text-lg font-bold text-neutral-900 mb-5">Amenities</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {amenities.map(amenity => (
                                    <div key={amenity} className="flex items-center gap-2.5 p-3 bg-primary/5 rounded-xl border border-primary/10">
                                        <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
                                        <span className="text-sm font-medium text-neutral-700">{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Owner Info */}
                    {(property.owner_name || property.owner_email || property.owner_phone) && (
                        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
                            <h2 className="text-lg font-bold text-neutral-900 mb-4">Owner Information</h2>
                            <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User size={22} className="text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-neutral-900">{property.owner_name || "Owner"}</p>
                                    {property.owner_nationality && <p className="text-xs text-neutral-500">{property.owner_nationality}</p>}
                                </div>
                                <div className="flex gap-2">
                                    {property.owner_phone && (
                                        <a href={`tel:${property.owner_phone}`} className="px-3 py-2 bg-emerald-500 text-white rounded-xl text-xs font-semibold hover:bg-emerald-600 transition-colors flex items-center gap-1.5">
                                            <Phone size={13} /> {property.owner_phone}
                                        </a>
                                    )}
                                    {property.owner_email && (
                                        <a href={`mailto:${property.owner_email}`} className="px-3 py-2 bg-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold hover:bg-neutral-300 transition-colors flex items-center gap-1.5">
                                            <MessageSquare size={13} /> Email
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Media */}
                    {(property.video_url || property.view360_url) && (
                        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
                            <h2 className="text-lg font-bold text-neutral-900 mb-4">Media & Virtual Tour</h2>
                            <div className="space-y-3">
                                {property.video_url && (
                                    <a href={property.video_url} target="_blank" rel="noreferrer"
                                        className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl border border-neutral-100 hover:border-primary/30 transition-colors">
                                        <Video size={20} className="text-primary" />
                                        <div>
                                            <p className="text-sm font-semibold text-neutral-800">Video Tour</p>
                                            <p className="text-xs text-neutral-400 truncate max-w-xs">{property.video_url}</p>
                                        </div>
                                    </a>
                                )}
                                {property.view360_url && (
                                    <a href={property.view360_url} target="_blank" rel="noreferrer"
                                        className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl border border-neutral-100 hover:border-primary/30 transition-colors">
                                        <Globe size={20} className="text-primary" />
                                        <div>
                                            <p className="text-sm font-semibold text-neutral-800">360° Virtual Tour</p>
                                            <p className="text-xs text-neutral-400 truncate max-w-xs">{property.view360_url}</p>
                                        </div>
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Property Info */}
                    <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
                        <h2 className="text-base font-bold text-neutral-900 mb-3">Property Details</h2>
                        <div className="space-y-0.5">
                            {infoRow(<Home size={13} />, "Type", <span className="capitalize">{property.property_type}</span>)}
                            {infoRow(<Star size={13} />, "Completion", property.completion_status)}
                            {infoRow(<Star size={13} />, "Furnishing", property.furnished)}
                            {infoRow(<Maximize size={13} />, "Plot Area", property.area_sqft ? `${property.area_sqft} sqft` : null)}
                            {infoRow(<Maximize size={13} />, "Built-up Area", property.bua_sqft ? `${property.bua_sqft} sqft` : null)}
                            {infoRow(<Maximize size={13} />, "Plot Size", property.plot_size_sqft ? `${property.plot_size_sqft} sqft` : null)}
                            {infoRow(<Building2 size={13} />, "Developer", property.developer)}
                            {infoRow(<Layers size={13} />, "Total Floors", property.total_floors)}
                            {infoRow(<Layers size={13} />, "Floor No.", property.floor_no)}
                            {infoRow(<Car size={13} />, "Parking", property.parking)}
                            {infoRow(<Calendar size={13} />, "Build Year", property.build_year)}
                            {infoRow(<Home size={13} />, "Occupancy", property.occupancy)}
                            {infoRow(<Calendar size={13} />, "Available From", property.availability_date ? new Date(property.availability_date).toLocaleDateString("en-AE", { day: "numeric", month: "short", year: "numeric" }) : null)}
                            {infoRow(<Home size={13} />, "Unit No.", property.unit_no)}
                            {infoRow(<Globe size={13} />, "Source", property.source_of_listing)}
                            {infoRow(<Clock size={13} />, "Listed On", new Date(property.created_at).toLocaleDateString("en-AE", { day: "numeric", month: "short", year: "numeric" }))}
                        </div>
                    </div>

                    {/* Pricing Details */}
                    {(property.service_charge || property.ac_charge) && (
                        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
                            <h2 className="text-base font-bold text-neutral-900 mb-3">Pricing Breakdown</h2>
                            <div className="space-y-0.5">
                                {infoRow(<DollarSign size={13} />, "Sale Price", formattedPrice)}
                                {infoRow(<DollarSign size={13} />, "Service Charge", property.service_charge ? `AED ${property.service_charge.toLocaleString()}` : null)}
                                {infoRow(<DollarSign size={13} />, "AC Charge", property.ac_charge ? `AED ${property.ac_charge.toLocaleString()}` : null)}
                            </div>
                        </div>
                    )}

                    {/* Portals */}
                    {property.portals && Object.keys(property.portals).length > 0 && (
                        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
                            <h2 className="text-base font-bold text-neutral-900 mb-3">Portal Listings</h2>
                            <div className="space-y-2">
                                {[
                                    { id: "propertyfinder", label: "Property Finder", color: "bg-red-100 text-red-700" },
                                    { id: "bayut", label: "Bayut", color: "bg-yellow-100 text-yellow-700" },
                                    { id: "dubizzle", label: "Dubizzle", color: "bg-blue-100 text-blue-700" },
                                    { id: "justproperty", label: "JustProperty", color: "bg-green-100 text-green-700" },
                                ].map(portal => (
                                    <div key={portal.id} className="flex items-center justify-between">
                                        <span className="text-sm text-neutral-600">{portal.label}</span>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${property.portals?.[portal.id] ? portal.color : "bg-neutral-100 text-neutral-400"}`}>
                                            {property.portals?.[portal.id] ? "Active" : "Not Listed"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* DLD Reference */}
                    <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm flex items-center justify-between text-sm">
                        <span className="text-neutral-500 flex items-center gap-2"><Star size={13} /> DLD Reference</span>
                        <span className="font-semibold text-neutral-400 uppercase text-xs">Pending</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
