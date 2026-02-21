"use client";

import { useState } from "react";
import { Search, Filter, MapPin, BedDouble, Bath, Maximize, Share2, Plus, X, Home, IndianRupee, Compass, Car, Layers, Save, Image } from "lucide-react";

interface Property {
    id: number;
    title: string;
    location: string;
    price: string;
    type: string;
    beds: number;
    baths: number;
    area: string;
    status: string;
    image: string;
    facing?: string;
    floor?: string;
    parking?: string;
    description?: string;
}

const INITIAL_PROPERTIES: Property[] = [
    { id: 1, title: "Prestige Lakeside Villa", location: "Whitefield, Bangalore", price: "₹4.5 Cr", type: "Villa", beds: 4, baths: 5, area: "3,500", status: "Available", image: "bg-neutral-200", facing: "East", floor: "Ground", parking: "2", description: "Luxurious villa with lake view and private garden." },
    { id: 2, title: "Brigade Panorama", location: "Koramangala, Bangalore", price: "₹1.2 Cr", type: "Apartment", beds: 2, baths: 2, area: "1,200", status: "Reserved", image: "bg-neutral-200", facing: "North", floor: "12th", parking: "1", description: "Modern apartment in premium locality." },
    { id: 3, title: "Sobha Dream Acres", location: "Panathur, Bangalore", price: "₹95 L", type: "Apartment", beds: 2, baths: 2, area: "1,100", status: "Available", image: "bg-neutral-200", facing: "West", floor: "8th", parking: "1", description: "Affordable luxury in IT corridor." },
];

export default function AgentInventoryPage() {
    const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [form, setForm] = useState({
        title: "", location: "", price: "", type: "Apartment", beds: 2, baths: 2, area: "", status: "Available", facing: "East", floor: "", parking: "1", description: "",
    });

    const openAdd = () => {
        setEditId(null);
        setForm({ title: "", location: "", price: "", type: "Apartment", beds: 2, baths: 2, area: "", status: "Available", facing: "East", floor: "", parking: "1", description: "" });
        setShowForm(true);
    };

    const openEdit = (p: Property) => {
        setEditId(p.id);
        setForm({ title: p.title, location: p.location, price: p.price, type: p.type, beds: p.beds, baths: p.baths, area: p.area, status: p.status, facing: p.facing || "", floor: p.floor || "", parking: p.parking || "", description: p.description || "" });
        setShowForm(true);
    };

    const handleSave = () => {
        if (!form.title || !form.location || !form.price) return;
        if (editId != null) {
            setProperties((prev) => prev.map((p) => p.id === editId ? { ...p, ...form, image: p.image } : p));
        } else {
            setProperties((prev) => [...prev, { ...form, id: Date.now(), image: "bg-neutral-200" }]);
        }
        setShowForm(false);
    };

    const handleDelete = (id: number) => {
        setProperties((prev) => prev.filter((p) => p.id !== id));
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">My Rent Properties</h1>
                    <p className="text-sm text-neutral-500 mt-1">Manage your property listings</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input type="text" placeholder="Search properties..." className="pl-9 pr-4 py-2 border border-neutral-200 rounded-xl text-sm w-56 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                    </div>
                    <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25">
                        <Plus size={16} /> Add Rent
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Total Listings", value: properties.length, color: "text-primary" },
                    { label: "Available", value: properties.filter((p) => p.status === "Available").length, color: "text-emerald-600" },
                    { label: "Reserved / Sold", value: properties.filter((p) => p.status !== "Available").length, color: "text-amber-600" },
                ].map((s) => (
                    <div key={s.label} className="bg-white rounded-2xl border border-neutral-100 p-4 shadow-sm text-center">
                        <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-[10px] text-neutral-400 uppercase font-semibold mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Grid */}
            {properties.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 bg-neutral-100 rounded-3xl flex items-center justify-center mb-4">
                        <Home size={32} className="text-neutral-300" />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900 mb-1">No Properties Yet</h3>
                    <p className="text-sm text-neutral-400 mb-4 max-w-[300px]">Start adding your property listings to showcase them to potential buyers.</p>
                    <button onClick={openAdd} className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25">
                        <Plus size={16} className="inline mr-1" /> Add Your First Rent Property
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                        <div key={property.id} className="group bg-white border border-neutral-100 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 card-shadow flex flex-col">
                            {/* Image */}
                            <div className={`h-44 w-full ${property.image} relative`}>
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-neutral-900 shadow-sm">{property.type}</div>
                                <div className={`absolute top-4 right-4 px-3 py-1 rounded-lg text-xs font-bold shadow-sm ${property.status === "Available" ? "bg-emerald-500 text-white" : property.status === "Reserved" ? "bg-amber-500 text-white" : "bg-red-500 text-white"}`}>{property.status}</div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-neutral-900 mb-1 line-clamp-1">{property.title}</h3>
                                    <div className="flex items-center gap-1.5 text-neutral-500 text-sm mb-3">
                                        <MapPin size={14} className="shrink-0" />
                                        <span className="truncate">{property.location}</span>
                                    </div>
                                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 bg-neutral-50 px-2 py-1 rounded-lg"><BedDouble size={12} className="text-neutral-400" /> {property.beds} Beds</div>
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 bg-neutral-50 px-2 py-1 rounded-lg"><Bath size={12} className="text-neutral-400" /> {property.baths} Bath</div>
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 bg-neutral-50 px-2 py-1 rounded-lg"><Maximize size={12} className="text-neutral-400" /> {property.area} sqft</div>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                                    <span className="text-xl font-bold text-primary">{property.price}</span>
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => openEdit(property)} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-600 hover:bg-neutral-50 border border-neutral-200 transition-colors">Edit</button>
                                        <button onClick={() => handleDelete(property.id)} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 border border-red-100 transition-colors">Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-neutral-100 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl z-10">
                            <div>
                                <h2 className="text-lg font-bold text-neutral-900">{editId ? "Edit Property" : "Add New Rent Property"}</h2>
                                <p className="text-xs text-neutral-400 mt-0.5">Fill in the property details below</p>
                            </div>
                            <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-neutral-100 transition-colors"><X size={18} /></button>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Image Upload Placeholder */}
                            <div className="border-2 border-dashed border-neutral-200 rounded-2xl p-8 text-center hover:border-primary/40 transition-colors cursor-pointer">
                                <Image size={32} className="mx-auto text-neutral-300 mb-2" />
                                <p className="text-sm font-semibold text-neutral-600">Upload Photos</p>
                                <p className="text-xs text-neutral-400 mt-1">Drag & drop or click to browse</p>
                            </div>

                            {/* Title + Location */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5">Property Title *</label>
                                    <div className="relative">
                                        <Home size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                                        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Prestige Lakeside Villa" className="w-full pl-9 pr-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5">Location *</label>
                                    <div className="relative">
                                        <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                                        <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Whitefield, Bangalore" className="w-full pl-9 pr-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Price + Type + Status */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5">Price *</label>
                                    <div className="relative">
                                        <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                                        <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="e.g. ₹1.2 Cr" className="w-full pl-9 pr-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5">Type</label>
                                    <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white">
                                        {["Apartment", "Villa", "Penthouse", "Mansion", "Plot", "1BHK", "2BHK", "3BHK", "4BHK"].map((t) => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5">Status</label>
                                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white">
                                        {["Available", "Reserved", "Sold"].map((s) => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Beds, Baths, Area */}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5">Bedrooms</label>
                                    <div className="relative">
                                        <BedDouble size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                                        <input type="number" value={form.beds} onChange={(e) => setForm({ ...form, beds: Number(e.target.value) })} className="w-full pl-9 pr-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5">Bathrooms</label>
                                    <div className="relative">
                                        <Bath size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                                        <input type="number" value={form.baths} onChange={(e) => setForm({ ...form, baths: Number(e.target.value) })} className="w-full pl-9 pr-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5">Area (sqft)</label>
                                    <div className="relative">
                                        <Maximize size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                                        <input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} placeholder="1,200" className="w-full pl-9 pr-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Facing, Floor, Parking */}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5">Facing</label>
                                    <select value={form.facing} onChange={(e) => setForm({ ...form, facing: e.target.value })} className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white">
                                        {["East", "West", "North", "South", "North-East", "South-East"].map((f) => <option key={f}>{f}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5">Floor</label>
                                    <input value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value })} placeholder="e.g. 12th" className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5">Parking</label>
                                    <select value={form.parking} onChange={(e) => setForm({ ...form, parking: e.target.value })} className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white">
                                        {["0", "1", "2", "3"].map((p) => <option key={p}>{p}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5">Description</label>
                                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Describe the property features, amenities, and nearby landmarks..." className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none" />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-neutral-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white rounded-b-3xl">
                            <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-neutral-600 hover:bg-neutral-50 border border-neutral-200 transition-colors">Cancel</button>
                            <button onClick={handleSave} className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25 flex items-center gap-2">
                                <Save size={16} /> {editId ? "Update Property" : "Add Property"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
