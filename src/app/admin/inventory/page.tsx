"use client";

import { useState } from "react";
import {
    Search, Filter, MapPin, BedDouble, Bath, Maximize, Loader2,
    RefreshCw, Download, ExternalLink, Building2, Tag, Sofa,
    ChevronLeft, ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// ─── Types ──────────────────────────────────────────────────

interface PFListing {
    id: string;
    reference: string;
    title: string | null;
    description: string | null;
    price: number;
    currency: string;
    bedrooms: string;
    bathrooms: string;
    size: number | null;
    sizeUnit: string | null;
    propertyType: string;
    offeringType: string;
    availableFrom: string | null;
    amenities: string[];
    images: Array<{ id: string; url: string; title: string | null }>;
    location: {
        name: string;
        path: string;
        pathNames: string[];
    } | null;
    assignedTo: {
        id: number;
        name: string;
        photos: { thumbnail: string } | null;
    } | null;
    status: string;
    createdAt: string;
    updatedAt: string;
    completionStatus: string | null;
    furnishing: string | null;
}

// ─── Helpers ────────────────────────────────────────────────

function formatPrice(price: number, currency: string) {
    if (currency === "AED") {
        if (price >= 1_000_000) return `AED ${(price / 1_000_000).toFixed(1)}M`;
        if (price >= 1_000) return `AED ${(price / 1_000).toFixed(0)}K`;
        return `AED ${price.toLocaleString()}`;
    }
    return `${currency} ${price.toLocaleString()}`;
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

const typeColors: Record<string, string> = {
    apartment: "bg-blue-50 text-blue-700 border-blue-100",
    villa: "bg-emerald-50 text-emerald-700 border-emerald-100",
    townhouse: "bg-violet-50 text-violet-700 border-violet-100",
    penthouse: "bg-amber-50 text-amber-700 border-amber-100",
    duplex: "bg-pink-50 text-pink-700 border-pink-100",
    default: "bg-neutral-50 text-neutral-700 border-neutral-100",
};

const statusColors: Record<string, string> = {
    live: "bg-emerald-500 text-white",
    draft: "bg-amber-500 text-white",
    expired: "bg-red-500 text-white",
    default: "bg-neutral-400 text-white",
};

const furnishingLabels: Record<string, string> = {
    furnished: "Furnished",
    unfurnished: "Unfurnished",
    "semi-furnished": "Semi-Furnished",
    "partly-furnished": "Partly Furnished",
};

// ─── Main Page ──────────────────────────────────────────────

export default function PFInventoryPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("all"); // all | sale | rent
    const [filterBeds, setFilterBeds] = useState("all");
    const queryClient = useQueryClient();

    // Fetch PF listings
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ["pf-listings"],
        queryFn: async () => {
            const res = await fetch("/api/admin/propertyfinder/listings");
            if (!res.ok) throw new Error("Failed to fetch PF listings");
            return res.json();
        },
        staleTime: 5 * 60 * 1000,
    });

    // Sync mutation
    const syncMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch("/api/admin/propertyfinder/sync", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "listings" }),
            });
            if (!res.ok) throw new Error("Sync failed");
            return res.json();
        },
        onSuccess: (result) => {
            const count = result.results?.listings?.count || 0;
            if (count > 0) {
                toast.success(`${count} listing(s) synced to CRM!`);
            } else {
                toast.info(result.results?.listings?.message || "All listings already synced");
            }
            queryClient.invalidateQueries({ queryKey: ["pf-listings"] });
        },
        onError: (err: any) => {
            toast.error(err.message || "Sync failed");
        },
    });

    const listings: PFListing[] = data?.results || [];
    const pagination = data?.pagination;

    // Filter listings
    const filtered = listings.filter((l) => {
        if (filterType !== "all" && l.offeringType !== filterType) return false;
        if (filterBeds !== "all" && l.bedrooms !== filterBeds) return false;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            const matchTitle = l.title?.toLowerCase().includes(q);
            const matchLocation = l.location?.name?.toLowerCase().includes(q) ||
                l.location?.pathNames?.some(p => p.toLowerCase().includes(q));
            const matchType = l.propertyType?.toLowerCase().includes(q);
            const matchRef = l.reference?.toLowerCase().includes(q);
            if (!matchTitle && !matchLocation && !matchType && !matchRef) return false;
        }
        return true;
    });

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-neutral-900">PF Inventory</h1>
                        <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg">
                            {pagination?.total || listings.length} Listings
                        </span>
                    </div>
                    <p className="text-sm text-neutral-500 mt-1">
                        Live property listings from Property Finder
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => queryClient.invalidateQueries({ queryKey: ["pf-listings"] })}
                        disabled={isFetching}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm font-semibold hover:bg-neutral-50 transition-colors shadow-sm disabled:opacity-50"
                    >
                        <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} /> Refresh
                    </button>
                    <button
                        onClick={() => syncMutation.mutate()}
                        disabled={syncMutation.isPending}
                        className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25 flex items-center gap-2 disabled:opacity-50"
                    >
                        {syncMutation.isPending ? (
                            <><Loader2 size={16} className="animate-spin" /> Syncing...</>
                        ) : (
                            <><Download size={16} /> Sync All to CRM</>
                        )}
                    </button>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Search by title, location, type, or reference..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                </div>
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                >
                    <option value="all">All Types</option>
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                </select>
                <select
                    value={filterBeds}
                    onChange={(e) => setFilterBeds(e.target.value)}
                    className="px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                >
                    <option value="all">All Beds</option>
                    <option value="0">Studio</option>
                    <option value="1">1 Bed</option>
                    <option value="2">2 Beds</option>
                    <option value="3">3 Beds</option>
                    <option value="4">4 Beds</option>
                    <option value="5">5+ Beds</option>
                </select>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        <p className="text-sm text-neutral-500">Loading PF listings...</p>
                    </div>
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-3xl border border-red-100 shadow-sm">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                        <Building2 className="w-8 h-8 text-red-400" />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900 mb-1">Connection Error</h3>
                    <p className="text-sm text-neutral-500 mb-4 text-center max-w-sm">
                        Could not connect to Property Finder API. Check your credentials.
                    </p>
                    <button
                        onClick={() => queryClient.invalidateQueries({ queryKey: ["pf-listings"] })}
                        className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all"
                    >
                        Try Again
                    </button>
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-3xl border border-neutral-100 shadow-sm">
                    <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-neutral-400" />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900 mb-1">No listings found</h3>
                    <p className="text-sm text-neutral-500 text-center max-w-sm">
                        {searchQuery || filterType !== "all" || filterBeds !== "all"
                            ? "Try adjusting your search or filters."
                            : "No listings available from Property Finder."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filtered.map((listing) => (
                        <div
                            key={listing.id}
                            className="group bg-white border border-neutral-100 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 card-shadow flex flex-col"
                        >
                            {/* Image */}
                            <div className="h-52 w-full relative overflow-hidden bg-neutral-100">
                                {listing.images?.[0]?.url ? (
                                    <img
                                        src={listing.images[0].url}
                                        alt={listing.title || "Property"}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-neutral-100">
                                        <Building2 className="w-12 h-12 text-neutral-300" />
                                    </div>
                                )}

                                {/* Badges */}
                                <div className="absolute top-3 left-3 flex gap-2">
                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${typeColors[listing.propertyType?.toLowerCase()] || typeColors.default}`}>
                                        {listing.propertyType}
                                    </span>
                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${listing.offeringType === "rent" ? "bg-blue-500 text-white" : "bg-emerald-500 text-white"}`}>
                                        {listing.offeringType === "rent" ? "Rent" : "Sale"}
                                    </span>
                                </div>

                                <div className="absolute top-3 right-3">
                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${statusColors[listing.status?.toLowerCase()] || statusColors.default}`}>
                                        {listing.status}
                                    </span>
                                </div>

                                {/* Image count */}
                                {listing.images?.length > 1 && (
                                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                                        📷 {listing.images.length}
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex-1">
                                    {/* Title */}
                                    <h3 className="text-base font-bold text-neutral-900 mb-1 line-clamp-1">
                                        {listing.title || `${listing.propertyType} in ${listing.location?.name || "Unknown"}`}
                                    </h3>

                                    {/* Location */}
                                    <div className="flex items-center gap-1.5 text-neutral-500 text-sm mb-3">
                                        <MapPin size={13} className="shrink-0 text-neutral-400" />
                                        <span className="truncate">
                                            {listing.location?.pathNames?.slice(0, 3).join(", ") || listing.location?.name || "—"}
                                        </span>
                                    </div>

                                    {/* Specs */}
                                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                                        {listing.bedrooms && listing.bedrooms !== "0" && (
                                            <div className="flex items-center gap-1 text-xs font-medium text-neutral-600 bg-neutral-50 px-2.5 py-1.5 rounded-lg">
                                                <BedDouble size={13} className="text-neutral-400" /> {listing.bedrooms}
                                            </div>
                                        )}
                                        {listing.bathrooms && listing.bathrooms !== "0" && (
                                            <div className="flex items-center gap-1 text-xs font-medium text-neutral-600 bg-neutral-50 px-2.5 py-1.5 rounded-lg">
                                                <Bath size={13} className="text-neutral-400" /> {listing.bathrooms}
                                            </div>
                                        )}
                                        {listing.size && (
                                            <div className="flex items-center gap-1 text-xs font-medium text-neutral-600 bg-neutral-50 px-2.5 py-1.5 rounded-lg">
                                                <Maximize size={13} className="text-neutral-400" /> {listing.size.toLocaleString()} {listing.sizeUnit || "sqft"}
                                            </div>
                                        )}
                                        {listing.furnishing && (
                                            <div className="flex items-center gap-1 text-xs font-medium text-neutral-600 bg-neutral-50 px-2.5 py-1.5 rounded-lg">
                                                <Sofa size={13} className="text-neutral-400" /> {furnishingLabels[listing.furnishing] || listing.furnishing}
                                            </div>
                                        )}
                                    </div>

                                    {/* Amenities preview */}
                                    {listing.amenities?.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {listing.amenities.slice(0, 4).map((a) => (
                                                <span
                                                    key={a}
                                                    className="text-[10px] font-medium text-neutral-500 bg-neutral-50 border border-neutral-100 px-2 py-0.5 rounded-md capitalize"
                                                >
                                                    {a.replace(/-/g, " ")}
                                                </span>
                                            ))}
                                            {listing.amenities.length > 4 && (
                                                <span className="text-[10px] font-medium text-neutral-400 px-2 py-0.5">
                                                    +{listing.amenities.length - 4} more
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                                    <div>
                                        <span className="text-xl font-bold text-primary">
                                            {formatPrice(listing.price, listing.currency)}
                                        </span>
                                        {listing.offeringType === "rent" && (
                                            <span className="text-xs text-neutral-400 ml-1">/yr</span>
                                        )}
                                    </div>

                                    {/* Agent */}
                                    {listing.assignedTo && (
                                        <div className="flex items-center gap-2">
                                            {listing.assignedTo.photos?.thumbnail ? (
                                                <img
                                                    src={listing.assignedTo.photos.thumbnail}
                                                    alt={listing.assignedTo.name}
                                                    className="w-6 h-6 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-6 h-6 bg-primary/10 text-primary text-[10px] font-bold rounded-full flex items-center justify-center">
                                                    {listing.assignedTo.name?.[0]}
                                                </div>
                                            )}
                                            <span className="text-xs font-medium text-neutral-500 max-w-[80px] truncate">
                                                {listing.assignedTo.name}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Reference */}
                                <div className="flex items-center justify-between mt-3">
                                    <span className="text-[10px] text-neutral-400 font-mono">
                                        Ref: {listing.reference?.slice(0, 16)}
                                    </span>
                                    <span className="text-[10px] text-neutral-400">
                                        {formatDate(listing.createdAt)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
