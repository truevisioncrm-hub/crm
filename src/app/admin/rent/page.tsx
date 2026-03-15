"use client";

import { useState, useEffect } from "react";
import { Search, Filter, MapPin, BedDouble, Bath, Maximize, Heart, Share2, Plus, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

// Dubai locations
const DUBAI_LOCATIONS = [
    "Downtown Dubai", "Dubai Marina", "Palm Jumeirah", "Business Bay",
    "Jumeirah Beach Residence (JBR)", "DIFC", "Dubai Hills Estate",
    "Arabian Ranches", "Jumeirah Village Circle (JVC)", "Al Barsha",
    "Mirdif", "Deira", "Bur Dubai", "Jumeirah", "Al Quoz",
    "Dubai Sports City", "Dubai Silicon Oasis", "International City",
    "Discovery Gardens", "Motor City",
];

// AED yearly rent ranges (Dubai standard)
const RENT_PRICES = [
    "AED 30K - 50K / yr", "AED 50K - 75K / yr", "AED 75K - 100K / yr",
    "AED 100K - 150K / yr", "AED 150K - 200K / yr", "AED 200K - 300K / yr",
    "AED 300K - 500K / yr", "AED 500K+ / yr",
];

interface Property {
    id: number;
    title: string;
    location: string;
    price: string;
    type: string;
    beds: number;
    baths: number;
    area_sqft: number;
    status: string;
    bua_sqft: number;
    completion_status: string;
    furnished: string;
    payment_plan: any;
    property_type: string;
}

export default function RentInventoryPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [rentSelect, setRentSelect] = useState("AED 75K - 100K / yr");
    const [rentCustom, setRentCustom] = useState("");
    const [locationSelect, setLocationSelect] = useState("");
    const [locationCustom, setLocationCustom] = useState("");

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/properties?type=Rent');
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            setProperties(data);
        } catch (err: any) {
            console.error("Fetch Properties Error:", err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProperty = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);

        const rentValue = rentSelect === "custom" ? rentCustom : rentSelect;
        const locationValue = locationSelect === "custom" ? locationCustom : locationSelect;

        const newProperty = {
            title: formData.get("title") as string,
            location: locationValue,
            price: rentValue,
            type: "Rent",
            property_type: formData.get("property_type") as string,
            area_sqft: Number(formData.get("area_sqft")) || null,
            bua_sqft: Number(formData.get("bua_sqft")) || null,
            bedrooms: Number(formData.get("bedrooms")) || null,
            bathrooms: Number(formData.get("bathrooms")) || null,
            status: formData.get("status") as string || "available",
            completion_status: formData.get("completion_status") as string || "Completed",
            furnished: formData.get("furnished") as string || "Unfurnished",
            description: formData.get("description") as string || null,
        };

        try {
            const response = await fetch('/api/admin/properties', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProperty),
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            setProperties([data as unknown as Property, ...properties]);
            setIsModalOpen(false);
            toast.success("Rental listing added successfully!");
            setRentSelect("AED 75K - 100K / yr");
            setRentCustom("");
            setLocationSelect("");
            setLocationCustom("");
        } catch (err: any) {
            toast.error(err.message || "Failed to add property");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Rent Properties</h1>
                    <p className="text-sm text-neutral-500 mt-1">Manage rental property listings across Dubai</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm font-semibold hover:bg-neutral-50 transition-colors shadow-sm">
                        <Filter size={16} /> Filters
                    </button>
                    <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25 flex items-center gap-2">
                        <Plus size={16} /> Add Rental
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
                    <h3 className="text-lg font-bold text-neutral-900 mb-1">No rentals found</h3>
                    <p className="text-sm text-neutral-500 mb-6 text-center max-w-sm">
                        No rental properties listed yet. Add your first Dubai rental.
                    </p>
                    <button onClick={() => setIsModalOpen(true)} className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all">
                        + Add First Rental
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                        <Link href={`/admin/rent/${property.id}`} key={property.id} className="group bg-white border border-neutral-100 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 card-shadow flex flex-col">
                            <div className={`h-48 w-full bg-neutral-200 relative`}>
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-neutral-900 shadow-sm">
                                    {property.property_type || property.type}
                                </div>
                                <div className={`absolute top-4 right-4 px-3 py-1 rounded-lg text-xs font-bold shadow-sm ${property.status === "available" ? "bg-emerald-500 text-white" :
                                    property.status === "reserved" ? "bg-amber-500 text-white" :
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
                                    <div className="flex items-center gap-3 mb-6 flex-wrap">
                                        {property.beds && (
                                            <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 bg-neutral-50 px-2 py-1 rounded-lg">
                                                <BedDouble size={14} className="text-neutral-400" /> {property.beds} Beds
                                            </div>
                                        )}
                                        {property.baths && (
                                            <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 bg-neutral-50 px-2 py-1 rounded-lg">
                                                <Bath size={14} className="text-neutral-400" /> {property.baths} Baths
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
                                        <button className="p-2 rounded-full hover:bg-neutral-50 text-neutral-400 hover:text-red-500 transition-colors"><Heart size={18} /></button>
                                        <button className="p-2 rounded-full hover:bg-neutral-50 text-neutral-400 hover:text-neutral-900 transition-colors"><Share2 size={18} /></button>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Add Property Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-6 border-b border-neutral-100 shrink-0">
                            <div>
                                <h3 className="text-xl font-bold text-neutral-900">Add Rental Property</h3>
                                <p className="text-sm text-neutral-500 mt-1">List a new Dubai rental property.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                            <form id="add-property-form" onSubmit={handleAddProperty} className="space-y-6">
                                {/* Property Details */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold text-neutral-900 border-b border-neutral-100 pb-2">Property Details</h4>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-neutral-700">Property Title *</label>
                                        <input required name="title" type="text" placeholder="e.g. Spacious 1BR in JBR with Sea View" className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-neutral-700">Property Type *</label>
                                            <select required name="property_type" className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer">
                                                <option value="studio">Studio</option>
                                                <option value="1bhk">1 Bedroom Apartment</option>
                                                <option value="2bhk">2 Bedroom Apartment</option>
                                                <option value="3bhk">3 Bedroom Apartment</option>
                                                <option value="4bhk">4+ Bedroom Apartment</option>
                                                <option value="penthouse">Penthouse</option>
                                                <option value="villa">Villa / Townhouse</option>
                                                <option value="commercial">Commercial</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-neutral-700">Location / Area *</label>
                                            <select required value={locationSelect} onChange={(e) => setLocationSelect(e.target.value)} className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer">
                                                <option value="" disabled>Select Dubai area...</option>
                                                {DUBAI_LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                                                <option value="custom">✏️ Other / Custom</option>
                                            </select>
                                            {locationSelect === "custom" && (
                                                <input required value={locationCustom} onChange={(e) => setLocationCustom(e.target.value)} type="text" placeholder="Enter area name" className="w-full mt-2 px-4 py-2 bg-white border border-primary/30 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Pricing & Specs */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold text-neutral-900 border-b border-neutral-100 pb-2">Pricing & Specifications</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-neutral-700">Annual Rent (AED) *</label>
                                            <select required value={rentSelect} onChange={(e) => setRentSelect(e.target.value)} className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer">
                                                {RENT_PRICES.map(p => <option key={p} value={p}>{p}</option>)}
                                                <option value="custom">✏️ Custom</option>
                                            </select>
                                            {rentSelect === "custom" && (
                                                <input required value={rentCustom} onChange={(e) => setRentCustom(e.target.value)} type="text" placeholder="e.g. AED 85,000 / yr" className="w-full mt-2 px-4 py-2 bg-white border border-primary/30 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                                            )}
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-neutral-700">Plot Area (sqft)</label>
                                            <input name="area_sqft" type="number" placeholder="e.g. 900" className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-neutral-700">BUA (sqft)</label>
                                            <input name="bua_sqft" type="number" placeholder="e.g. 750" className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-neutral-700">Bedrooms</label>
                                            <select name="bedrooms" className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer">
                                                <option value="">Studio / Select</option>
                                                <option value="1">1 Bedroom</option>
                                                <option value="2">2 Bedrooms</option>
                                                <option value="3">3 Bedrooms</option>
                                                <option value="4">4 Bedrooms</option>
                                                <option value="5">5+ Bedrooms</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-neutral-700">Bathrooms</label>
                                            <select name="bathrooms" className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer">
                                                <option value="">Select</option>
                                                <option value="1">1 Bathroom</option>
                                                <option value="2">2 Bathrooms</option>
                                                <option value="3">3 Bathrooms</option>
                                                <option value="4">4+ Bathrooms</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-neutral-700">Status</label>
                                            <select name="status" className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer">
                                                <option value="available">Available</option>
                                                <option value="reserved">Reserved</option>
                                                <option value="unlisted">Rented Out</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-neutral-700">Completion</label>
                                            <select name="completion_status" className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer">
                                                <option value="Completed">Ready / Completed</option>
                                                <option value="Off-plan">Off-plan</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-neutral-700">Furnishing</label>
                                            <select name="furnished" className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer">
                                                <option value="Unfurnished">Unfurnished</option>
                                                <option value="Partly Furnished">Partly Furnished</option>
                                                <option value="Furnished">Furnished</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Info */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold text-neutral-900 border-b border-neutral-100 pb-2">Additional Info</h4>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-neutral-700">Description (Optional)</label>
                                        <textarea name="description" rows={3} placeholder="Furnishing, lease terms, amenities, building facilities, DEWA info..." className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all custom-scrollbar resize-none"></textarea>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="p-6 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-neutral-600 hover:bg-neutral-200 transition-colors">Cancel</button>
                            <button type="submit" form="add-property-form" disabled={isSubmitting} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                                {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : "Save Listing"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
