"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, BedDouble, Bath, Maximize, Plus, X, Home, IndianRupee, Save, Loader2 } from "lucide-react";

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
}

export default function AgentRentInventoryPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);

        const newProperty = {
            title: formData.get("title") as string,
            location: formData.get("location") as string,
            price: Number(formData.get("price")),
            property_type: formData.get("type") as string,
            area_sqft: Number(formData.get("area_sqft")),
            bedrooms: Number(formData.get("beds")),
            bathrooms: Number(formData.get("baths")),
            status: formData.get("status") as string || "available",
            description: formData.get("description") as string,
        };

        try {
            const response = await fetch('/api/admin/properties', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProperty),
            });
            const data = await response.json();

            if (data.error) throw new Error(data.error);

            setProperties([data, ...properties]);
            setShowForm(false);
        } catch (err: any) {
            console.error(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this property?")) return;
        try {
            const response = await fetch(`/api/admin/properties/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error("Delete failed");
            setProperties((prev) => prev.filter((p) => p.id !== id));
        } catch (err: any) {
            console.error(err.message);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">My Rent Properties</h1>
                    <p className="text-sm text-neutral-500 mt-1">Manage your rental listings</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25">
                        <Plus size={16} /> Add Rent
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
            ) : properties.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-neutral-100 shadow-sm">
                    <div className="w-20 h-20 bg-neutral-100 rounded-3xl flex items-center justify-center mb-4 text-neutral-300">
                        <Home size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900 mb-1">No Rent Listings</h3>
                    <p className="text-sm text-neutral-400 mb-6 max-w-[300px]">Start adding your rental listings to manage them here.</p>
                    <button onClick={() => setShowForm(true)} className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25 flex items-center gap-2">
                        <Plus size={16} /> Add Your First Rental
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                        <div key={property.id} className="group bg-white border border-neutral-100 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 card-shadow flex flex-col">
                            <div className={`h-44 w-full bg-neutral-100 relative`}>
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-neutral-900 shadow-sm uppercase">{property.property_type}</div>
                                <div className={`absolute top-4 right-4 px-3 py-1 rounded-lg text-xs font-bold shadow-sm capitalize ${property.status === "available" ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"}`}>{property.status}</div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-neutral-900 mb-1 line-clamp-1">{property.title}</h3>
                                    <div className="flex items-center gap-1.5 text-neutral-500 text-sm mb-3">
                                        <MapPin size={14} className="shrink-0" />
                                        <span className="truncate">{property.location}</span>
                                    </div>
                                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 bg-neutral-50 px-2 py-1 rounded-lg"><BedDouble size={12} className="text-neutral-400" /> {property.bedrooms} Beds</div>
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 bg-neutral-50 px-2 py-1 rounded-lg"><Bath size={12} className="text-neutral-400" /> {property.bathrooms} Bath</div>
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 bg-neutral-50 px-2 py-1 rounded-lg"><Maximize size={12} className="text-neutral-400" /> {property.area_sqft} sqft</div>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                                    <span className="text-xl font-bold text-primary">₹{Number(property.price).toLocaleString('en-IN')}<span className="text-xs text-neutral-400"> / mo</span></span>
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => handleDelete(property.id)} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 border border-red-100 transition-colors">Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
                    <form className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()} onSubmit={handleSave}>
                        <div className="p-6 border-b border-neutral-100 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl z-10">
                            <div>
                                <h2 className="text-lg font-bold text-neutral-900">Add New Rent Property</h2>
                                <p className="text-xs text-neutral-400 mt-0.5">Fill in the rental details below</p>
                            </div>
                            <button type="button" onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-neutral-100 transition-colors"><X size={18} /></button>
                        </div>

                        <div className="p-6 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5">Property Title *</label>
                                    <input required name="title" placeholder="e.g. Prestige Lakeside Villa" className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5">Location *</label>
                                    <input required name="location" placeholder="e.g. Whitefield, Bangalore" className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5">Monthly Rent *</label>
                                    <input required name="price" type="number" placeholder="e.g. 45000" className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5">Type</label>
                                    <select name="type" className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white">
                                        {["1bhk", "2bhk", "3bhk", "4bhk", "villa", "penthouse", "studio"].map((t) => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5">Status</label>
                                    <select name="status" className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white">
                                        <option value="available">Available</option>
                                        <option value="reserved">Reserved</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5">Bedrooms</label>
                                    <input required name="beds" type="number" defaultValue={2} className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5">Bathrooms</label>
                                    <input required name="baths" type="number" defaultValue={2} className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5">Area (sqft)</label>
                                    <input required name="area_sqft" type="number" placeholder="1200" className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5">Description</label>
                                <textarea name="description" rows={3} placeholder="Describe the rental property..." className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none" />
                            </div>
                        </div>

                        <div className="p-6 border-t border-neutral-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white rounded-b-3xl">
                            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-neutral-600 hover:bg-neutral-50 border border-neutral-200 transition-colors">Cancel</button>
                            <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25 flex items-center gap-2">
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />} 
                                Save Rental
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
