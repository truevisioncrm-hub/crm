"use client";

import { useState } from "react";
import {
  ArrowLeft, ArrowRight, X, Check, Building2, Home, MapPin,
  User, DollarSign, Image as ImageIcon, Globe, Loader2, ChevronDown,
  Star, Camera
} from "lucide-react";
import { toast } from "sonner";

// ─── Types ──────────────────────────────────────────────────────────────────

interface WizardProps {
  listingType: "Sell" | "Rent";
  onSuccess: () => void;
  onClose: () => void;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const RESIDENTIAL_TYPES = [
  "Apartment", "Villa", "Townhouse", "Penthouse", "Hotel Apartment",
  "Duplex", "Residential Floor", "Residential Plot", "Residential Building", "Compound",
];

const COMMERCIAL_TYPES = [
  "Office", "Shop", "Commercial Building", "Commercial Floor", "Commercial Plot",
  "Labor Camp", "Retail", "Show Room", "Staff Accommodation", "Commercial Villa",
  "Warehouse", "Farm", "Factory", "Hotel", "Hospital",
  "Co-Working Space", "Business Centre", "Mixed Use Land",
];

const COMPLETION_STATUSES = [
  "Ready Secondary", "Off Plan Secondary", "Ready Primary", "Off Plan Primary",
];

const DUBAI_COMMUNITIES = [
  "Downtown Dubai", "Dubai Marina", "Palm Jumeirah", "Business Bay",
  "Jumeirah Beach Residence (JBR)", "DIFC", "Dubai Hills Estate",
  "Arabian Ranches", "Jumeirah Village Circle (JVC)", "Al Barsha",
  "Mirdif", "Deira", "Bur Dubai", "Jumeirah", "Al Quoz",
  "Dubai Sports City", "Dubai Silicon Oasis", "International City",
  "Discovery Gardens", "Motor City", "Arjan", "Al Furjan",
  "Jumeirah Park", "The Springs", "The Lakes", "Emirates Hills",
  "Damac Hills", "Town Square", "Sobha Hartland", "Meydan",
];

const AMENITIES_LIST = [
  "Maid's Room", "Balcony", "Built-in Wardrobes", "Central A/C",
  "Covered Parking", "Private Garden", "Shared Pool", "Private Pool",
  "Security", "View of Water", "Walk-in Closet", "View of Landmark",
  "Gym", "Children's Play Area", "Barbecue Area", "Sauna",
  "Concierge", "Pets Allowed", "Study Room", "Laundry Room",
  "Smart Home", "Reception / Waiting Room", "Storage Room",
];

const PORTAL_LIST = [
  { id: "propertyfinder", label: "Property Finder", color: "bg-red-500" },
  { id: "bayut", label: "Bayut", color: "bg-yellow-500" },
  { id: "dubizzle", label: "Dubizzle", color: "bg-blue-500" },
  { id: "justproperty", label: "JustProperty", color: "bg-green-500" },
];

const NATIONALITIES = [
  "Emirati", "British", "Indian", "Pakistani", "Egyptian", "Filipino",
  "American", "Chinese", "Lebanese", "Jordanian", "Other",
];

const LANGUAGES = [
  "English", "Arabic", "Hindi", "Urdu", "Tagalog", "Mandarin",
  "French", "Russian", "German", "Spanish",
];

const SOURCE_OPTIONS = [
  "Walk-in", "Website", "Social Media", "Referral", "Property Finder",
  "Bayut", "Dubizzle", "Cold Call", "Email Campaign", "Other",
];

// ─── Step Indicator ──────────────────────────────────────────────────────────

const STEPS = ["Information", "Description", "Media", "Portals"];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((label, idx) => {
        const isCompleted = idx < current;
        const isActive = idx === current;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                isCompleted ? "bg-primary border-primary text-white" :
                isActive ? "bg-white border-primary text-primary" :
                "bg-white border-neutral-200 text-neutral-400"
              }`}>
                {isCompleted ? <Check size={14} /> : idx + 1}
              </div>
              <span className={`text-[10px] font-medium hidden sm:block ${
                isActive ? "text-primary" : isCompleted ? "text-primary/70" : "text-neutral-400"
              }`}>{label}</span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`h-0.5 w-8 sm:w-16 mx-1 sm:mx-2 rounded-full transition-all ${
                idx < current ? "bg-primary" : "bg-neutral-200"
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Input Components ────────────────────────────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-xs font-semibold text-neutral-700 flex items-center gap-1">
      {children}
      {required && <span className="text-red-500">*</span>}
    </label>
  );
}

function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${className}`}
      {...props}
    />
  );
}

function Select({ className = "", ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer ${className}`}
      {...props}
    />
  );
}

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
        <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-sm font-bold text-neutral-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// ─── Main Wizard ─────────────────────────────────────────────────────────────

export default function AddPropertyWizard({ listingType, onSuccess, onClose }: WizardProps) {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Step 1: Information ──
  const [propertyType, setPropertyType] = useState("Apartment");
  const [completionStatus, setCompletionStatus] = useState("Ready Secondary");
  const [listingIdMode, setListingIdMode] = useState<"auto" | "custom">("auto");
  const [customListingId, setCustomListingId] = useState("");
  const [community, setCommunity] = useState("");
  const [communityCustom, setCommunityCustom] = useState("");
  
  // Owner
  const [ownerMode, setOwnerMode] = useState<"select" | "add">("add");
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerPhoneCode, setOwnerPhoneCode] = useState("+971");
  const [ownerNationality, setOwnerNationality] = useState("");
  const [ownerGender, setOwnerGender] = useState("");
  const [ownerLanguages, setOwnerLanguages] = useState<string[]>([]);

  // Property details
  const [developer, setDeveloper] = useState("");
  const [totalFloors, setTotalFloors] = useState("");
  const [floorNo, setFloorNo] = useState("");
  const [sizeSqft, setSizeSqft] = useState("");
  const [plotSize, setPlotSize] = useState("");
  const [buildYear, setBuildYear] = useState("");
  const [occupancy, setOccupancy] = useState("");
  const [availabilityDate, setAvailabilityDate] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [parking, setParking] = useState("");
  const [furniture, setFurniture] = useState("Unfurnished");
  const [unitNo, setUnitNo] = useState("");
  const [sourceOfListing, setSourceOfListing] = useState("");

  // Pricing
  const [price, setPrice] = useState("");
  const [serviceCharge, setServiceCharge] = useState("");
  const [mortgage, setMortgage] = useState("No");
  const [acCharge, setAcCharge] = useState("");
  const [rentCheques, setRentCheques] = useState("1");

  // Amenities
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // ── Step 2: Description ──
  const [listingTitle, setListingTitle] = useState("");
  const [description, setDescription] = useState("");

  // ── Step 3: Media ──
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [view360Url, setView360Url] = useState("");

  // ── Step 4: Portals ──
  const [portals, setPortals] = useState<Record<string, boolean>>({
    propertyfinder: false,
    bayut: false,
    dubizzle: false,
    justproperty: false,
  });

  // ── Helpers ──
  const toggleAmenity = (a: string) =>
    setSelectedAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);

  const togglePortal = (id: string) =>
    setPortals(prev => ({ ...prev, [id]: !prev[id] }));

  const addImageUrl = () => {
    if (imageInput.trim() && imageUrls.length < 30) {
      setImageUrls(prev => [...prev, imageInput.trim()]);
      setImageInput("");
    }
  };

  const removeImage = (idx: number) =>
    setImageUrls(prev => prev.filter((_, i) => i !== idx));

  const locationValue = community === "custom" ? communityCustom : community;

  // ── Validate current step ──
  const canProceed = () => {
    if (step === 0) return !!locationValue && !!price && !!propertyType;
    if (step === 1) return !!listingTitle.trim();
    return true;
  };

  // ── Submit ──
  const handleSubmit = async () => {
    setIsSubmitting(true);
    const features: Record<string, any> = {
      listing_type: listingType,
    };
    selectedAmenities.forEach(a => { features[a] = true; });
    if (listingType === "Rent") features.cheques = rentCheques;

    const payload = {
      title: listingTitle,
      location: locationValue,
      price,
      type: listingType,
      property_type: propertyType.toLowerCase(),
      area_sqft: sizeSqft ? Number(sizeSqft) : null,
      bua_sqft: null,
      plot_size_sqft: plotSize ? Number(plotSize) : null,
      bedrooms: bedrooms ? Number(bedrooms) : null,
      bathrooms: bathrooms ? Number(bathrooms) : null,
      parking: parking ? Number(parking) : null,
      status: "available",
      completion_status: listingType === "Sell" ? completionStatus : null,
      furnished: furniture,
      description,
      developer: developer || null,
      total_floors: totalFloors ? Number(totalFloors) : null,
      floor_no: floorNo ? Number(floorNo) : null,
      build_year: buildYear ? Number(buildYear) : null,
      occupancy: occupancy || null,
      availability_date: availabilityDate || null,
      unit_no: unitNo || null,
      source_of_listing: sourceOfListing || null,
      service_charge: serviceCharge ? Number(serviceCharge) : null,
      ac_charge: acCharge ? Number(acCharge) : null,
      video_url: videoUrl || null,
      view360_url: view360Url || null,
      portals,
      images: imageUrls,
      owner_name: ownerName || null,
      owner_email: ownerEmail || null,
      owner_phone: ownerPhone ? `${ownerPhoneCode} ${ownerPhone}` : null,
      owner_nationality: ownerNationality || null,
      features,
    };

    try {
      const res = await fetch("/api/admin/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast.success(`Property listed for ${listingType} successfully!`);
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Failed to save property");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Render Steps ─────────────────────────────────────────────────────────

  function renderStep1() {
    return (
      <div className="space-y-5">
        {/* Property Type */}
        <SectionCard title="Property Type" icon={<Building2 size={15} />}>
          <div>
            <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wide mb-2">Residential</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {RESIDENTIAL_TYPES.map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setPropertyType(type)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    propertyType === type
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-primary/40"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wide mb-2">Commercial</p>
            <div className="flex flex-wrap gap-2">
              {COMMERCIAL_TYPES.map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setPropertyType(type)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    propertyType === type
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-primary/40"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {listingType === "Sell" && (
            <div className="mt-4">
              <FieldLabel required>Completion Status</FieldLabel>
              <div className="grid grid-cols-2 gap-2 mt-1.5">
                {COMPLETION_STATUSES.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setCompletionStatus(s)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all text-left ${
                      completionStatus === s
                        ? "bg-primary text-white border-primary"
                        : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-primary/40"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </SectionCard>

        {/* Listing ID */}
        <SectionCard title="Listing ID" icon={<Star size={15} />}>
          <div className="flex gap-3">
            {(["auto", "custom"] as const).map(mode => (
              <button
                key={mode}
                type="button"
                onClick={() => setListingIdMode(mode)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all capitalize ${
                  listingIdMode === mode
                    ? "bg-primary text-white border-primary"
                    : "bg-neutral-50 text-neutral-600 border-neutral-200"
                }`}
              >
                {mode === "auto" ? "Auto Generate" : "Custom"}
              </button>
            ))}
          </div>
          {listingIdMode === "custom" && (
            <Input
              value={customListingId}
              onChange={e => setCustomListingId(e.target.value)}
              placeholder="e.g. TV-MAR-001"
              className="mt-2"
            />
          )}
        </SectionCard>

        {/* Location */}
        <SectionCard title="Location / Community" icon={<MapPin size={15} />}>
          <div>
            <FieldLabel required>Community</FieldLabel>
            <div className="relative mt-1.5">
              <Select value={community} onChange={e => setCommunity(e.target.value)}>
                <option value="" disabled>Select Dubai community...</option>
                {DUBAI_COMMUNITIES.map(c => <option key={c} value={c}>{c}</option>)}
                <option value="custom">✏️ Other / Custom</option>
              </Select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            </div>
            {community === "custom" && (
              <Input
                value={communityCustom}
                onChange={e => setCommunityCustom(e.target.value)}
                placeholder="Enter area / community name"
                className="mt-2"
              />
            )}
          </div>
        </SectionCard>

        {/* Owner Info */}
        <SectionCard title="Owner Info" icon={<User size={15} />}>
          <div className="flex gap-3 mb-4">
            {(["add", "select"] as const).map(mode => (
              <button
                key={mode}
                type="button"
                onClick={() => setOwnerMode(mode)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  ownerMode === mode
                    ? "bg-primary text-white border-primary"
                    : "bg-neutral-50 text-neutral-600 border-neutral-200"
                }`}
              >
                {mode === "add" ? "Add Owner" : "Select Owner"}
              </button>
            ))}
          </div>

          {ownerMode === "select" && (
            <div className="bg-neutral-50 rounded-xl p-4 text-sm text-neutral-500 text-center border border-dashed border-neutral-200">
              Contact / CRM owner linking coming soon
            </div>
          )}

          {ownerMode === "add" && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Full Name</FieldLabel>
                  <Input value={ownerName} onChange={e => setOwnerName(e.target.value)} placeholder="e.g. Mohammed Al Farsi" className="mt-1.5" />
                </div>
                <div>
                  <FieldLabel>Email</FieldLabel>
                  <Input type="email" value={ownerEmail} onChange={e => setOwnerEmail(e.target.value)} placeholder="owner@email.com" className="mt-1.5" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Phone</FieldLabel>
                  <div className="flex gap-2 mt-1.5">
                    <Select value={ownerPhoneCode} onChange={e => setOwnerPhoneCode(e.target.value)} className="w-24">
                      <option value="+971">+971</option>
                      <option value="+966">+966</option>
                      <option value="+44">+44</option>
                      <option value="+91">+91</option>
                      <option value="+92">+92</option>
                      <option value="+1">+1</option>
                    </Select>
                    <Input value={ownerPhone} onChange={e => setOwnerPhone(e.target.value)} placeholder="5x xxx xxxx" className="flex-1" />
                  </div>
                </div>
                <div>
                  <FieldLabel>Nationality</FieldLabel>
                  <div className="relative mt-1.5">
                    <Select value={ownerNationality} onChange={e => setOwnerNationality(e.target.value)}>
                      <option value="">Select...</option>
                      {NATIONALITIES.map(n => <option key={n} value={n}>{n}</option>)}
                    </Select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Gender</FieldLabel>
                  <div className="relative mt-1.5">
                    <Select value={ownerGender} onChange={e => setOwnerGender(e.target.value)}>
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </Select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <FieldLabel>Spoken Languages</FieldLabel>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setOwnerLanguages(prev =>
                          prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
                        )}
                        className={`px-2 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                          ownerLanguages.includes(lang)
                            ? "bg-primary text-white border-primary"
                            : "bg-neutral-50 text-neutral-600 border-neutral-200"
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </SectionCard>

        {/* Property Details */}
        <SectionCard title="Property Details" icon={<Home size={15} />}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <FieldLabel>Developer</FieldLabel>
              <Input value={developer} onChange={e => setDeveloper(e.target.value)} placeholder="e.g. Emaar" className="mt-1.5" />
            </div>
            <div>
              <FieldLabel>Total Floors</FieldLabel>
              <Input type="number" value={totalFloors} onChange={e => setTotalFloors(e.target.value)} placeholder="e.g. 30" className="mt-1.5" />
            </div>
            <div>
              <FieldLabel>Floor No.</FieldLabel>
              <Input type="number" value={floorNo} onChange={e => setFloorNo(e.target.value)} placeholder="e.g. 12" className="mt-1.5" />
            </div>
            <div>
              <FieldLabel required>Size (sqft)</FieldLabel>
              <Input required type="number" value={sizeSqft} onChange={e => setSizeSqft(e.target.value)} placeholder="e.g. 1500" className="mt-1.5" />
            </div>
            <div>
              <FieldLabel>Plot Size (sqft)</FieldLabel>
              <Input type="number" value={plotSize} onChange={e => setPlotSize(e.target.value)} placeholder="e.g. 3000" className="mt-1.5" />
            </div>
            <div>
              <FieldLabel>Build Year</FieldLabel>
              <Input type="number" value={buildYear} onChange={e => setBuildYear(e.target.value)} placeholder="e.g. 2020" className="mt-1.5" />
            </div>
            <div>
              <FieldLabel required>Bedrooms</FieldLabel>
              <div className="relative mt-1.5">
                <Select value={bedrooms} onChange={e => setBedrooms(e.target.value)}>
                  <option value="">Studio / Select</option>
                  {[1,2,3,4,5,6,7].map(n => <option key={n} value={n}>{n} Bedroom{n > 1 ? "s" : ""}</option>)}
                  <option value="8">8+ Bedrooms</option>
                </Select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <FieldLabel>Bathrooms</FieldLabel>
              <div className="relative mt-1.5">
                <Select value={bathrooms} onChange={e => setBathrooms(e.target.value)}>
                  <option value="">Select</option>
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Bathroom{n > 1 ? "s" : ""}</option>)}
                  <option value="7">7+ Bathrooms</option>
                </Select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <FieldLabel>Parking Spaces</FieldLabel>
              <div className="relative mt-1.5">
                <Select value={parking} onChange={e => setParking(e.target.value)}>
                  <option value="">None</option>
                  {[1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
                </Select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <FieldLabel>Furniture</FieldLabel>
              <div className="relative mt-1.5">
                <Select value={furniture} onChange={e => setFurniture(e.target.value)}>
                  <option value="Unfurnished">Unfurnished</option>
                  <option value="Partly Furnished">Partly Furnished</option>
                  <option value="Furnished">Furnished</option>
                </Select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <FieldLabel>Occupancy</FieldLabel>
              <div className="relative mt-1.5">
                <Select value={occupancy} onChange={e => setOccupancy(e.target.value)}>
                  <option value="">Select...</option>
                  <option value="Vacant">Vacant</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Investor Deal">Investor Deal</option>
                </Select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <FieldLabel>Availability Date</FieldLabel>
              <Input type="date" value={availabilityDate} onChange={e => setAvailabilityDate(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <FieldLabel>Unit No.</FieldLabel>
              <Input value={unitNo} onChange={e => setUnitNo(e.target.value)} placeholder="e.g. 1204" className="mt-1.5" />
            </div>
            <div>
              <FieldLabel>Source of Listing</FieldLabel>
              <div className="relative mt-1.5">
                <Select value={sourceOfListing} onChange={e => setSourceOfListing(e.target.value)}>
                  <option value="">Select...</option>
                  {SOURCE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </Select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Pricing */}
        <SectionCard title="Pricing" icon={<DollarSign size={15} />}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <FieldLabel required>Price (AED)</FieldLabel>
              <Input
                required
                type="text"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder={listingType === "Rent" ? "e.g. 75000" : "e.g. 1500000"}
                className="mt-1.5"
              />
            </div>
            <div>
              <FieldLabel>Service Charge (AED)</FieldLabel>
              <Input type="number" value={serviceCharge} onChange={e => setServiceCharge(e.target.value)} placeholder="e.g. 15000" className="mt-1.5" />
            </div>
            <div>
              <FieldLabel>AC Charge (AED)</FieldLabel>
              <Input type="number" value={acCharge} onChange={e => setAcCharge(e.target.value)} placeholder="e.g. 5000" className="mt-1.5" />
            </div>
            <div>
              <FieldLabel>Mortgage</FieldLabel>
              <div className="relative mt-1.5">
                <Select value={mortgage} onChange={e => setMortgage(e.target.value)}>
                  <option value="No">No Mortgage</option>
                  <option value="Yes">Mortgaged</option>
                  <option value="Cleared">Mortgage Cleared</option>
                </Select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              </div>
            </div>
            {listingType === "Rent" && (
              <div>
                <FieldLabel>Rent Cheques</FieldLabel>
                <div className="relative mt-1.5">
                  <Select value={rentCheques} onChange={e => setRentCheques(e.target.value)}>
                    {[1, 2, 4, 6, 12].map(n => (
                      <option key={n} value={n}>{n} Cheque{n > 1 ? "s" : ""}</option>
                    ))}
                  </Select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                </div>
              </div>
            )}
          </div>
        </SectionCard>

        {/* Amenities */}
        <SectionCard title="Amenities" icon={<Star size={15} />}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {AMENITIES_LIST.map(amenity => (
              <label key={amenity} className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer select-none p-2 rounded-xl hover:bg-neutral-50 transition-colors">
                <input
                  type="checkbox"
                  checked={selectedAmenities.includes(amenity)}
                  onChange={() => toggleAmenity(amenity)}
                  className="rounded text-primary focus:ring-primary/20 w-4 h-4 border-neutral-300"
                />
                <span className="text-xs">{amenity}</span>
              </label>
            ))}
          </div>
        </SectionCard>
      </div>
    );
  }

  function renderStep2() {
    return (
      <div className="space-y-5">
        <SectionCard title="Title & Description" icon={<Star size={15} />}>
          <div>
            <FieldLabel required>Listing Title</FieldLabel>
            <Input
              required
              value={listingTitle}
              onChange={e => setListingTitle(e.target.value)}
              placeholder={`e.g. Luxury 2BR ${propertyType} in ${locationValue || "Dubai Marina"}`}
              className="mt-1.5"
            />
            <p className="text-[11px] text-neutral-400 mt-1">Be specific — include key highlights in the title</p>
          </div>
          <div>
            <div className="flex items-center justify-between mt-2">
              <FieldLabel>Description</FieldLabel>
              <span className={`text-[11px] ${description.length > 2800 ? "text-red-500" : "text-neutral-400"}`}>
                {description.length}/3000
              </span>
            </div>
            <textarea
              rows={10}
              value={description}
              onChange={e => description.length < 3000 || e.target.value.length < description.length ? setDescription(e.target.value) : undefined}
              placeholder={`Describe the property in detail. Include:\n• Key features & specifications\n• Amenities and nearby landmarks\n• Payment plan details (if applicable)\n• Community highlights\n• Why this property is a great investment`}
              className="w-full mt-1.5 px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none custom-scrollbar leading-relaxed"
            />
          </div>
        </SectionCard>
      </div>
    );
  }

  function renderStep3() {
    return (
      <div className="space-y-5">
        <SectionCard title="Images" icon={<Camera size={15} />}>
          <div>
            <div className="flex gap-2">
              <Input
                value={imageInput}
                onChange={e => setImageInput(e.target.value)}
                placeholder="Paste image URL..."
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addImageUrl())}
              />
              <button
                type="button"
                onClick={addImageUrl}
                disabled={!imageInput.trim() || imageUrls.length >= 30}
                className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark disabled:opacity-40 transition-colors whitespace-nowrap"
              >
                Add
              </button>
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">{imageUrls.length}/30 images added</p>

            {imageUrls.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                {imageUrls.map((url, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-neutral-100 bg-neutral-100 aspect-square">
                    <img src={url} alt={`Image ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full items-center justify-center text-[10px] hidden group-hover:flex"
                    >
                      <X size={10} />
                    </button>
                    {idx === 0 && (
                      <div className="absolute bottom-1 left-1 bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">Cover</div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {imageUrls.length === 0 && (
              <div className="mt-4 border-2 border-dashed border-neutral-200 rounded-2xl p-8 text-center">
                <ImageIcon size={32} className="mx-auto mb-2 text-neutral-300" />
                <p className="text-sm text-neutral-400">No images added yet</p>
                <p className="text-[11px] text-neutral-300 mt-1">Paste image URLs above (max 30)</p>
              </div>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Video & Virtual Tour" icon={<Star size={15} />}>
          <div className="space-y-3">
            <div>
              <FieldLabel>Video Link (YouTube / Vimeo)</FieldLabel>
              <Input type="url" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="https://youtube.com/..." className="mt-1.5" />
            </div>
            <div>
              <FieldLabel>360° Virtual Tour Link</FieldLabel>
              <Input type="url" value={view360Url} onChange={e => setView360Url(e.target.value)} placeholder="https://my360tour.com/..." className="mt-1.5" />
            </div>
          </div>
        </SectionCard>
      </div>
    );
  }

  function renderStep4() {
    return (
      <div className="space-y-5">
        <SectionCard title="Publish to Portals" icon={<Globe size={15} />}>
          <p className="text-sm text-neutral-500 -mt-2">Select which portals to publish this listing to after saving.</p>
          <div className="space-y-3">
            {PORTAL_LIST.map(portal => (
              <div key={portal.id} className="flex items-center justify-between p-4 rounded-xl border border-neutral-100 hover:border-neutral-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl ${portal.color} flex items-center justify-center`}>
                    <Globe size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">{portal.label}</p>
                    <p className="text-[11px] text-neutral-400">Publish listing to {portal.label}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => togglePortal(portal.id)}
                  className={`relative w-11 h-6 rounded-full transition-all ${portals[portal.id] ? "bg-primary" : "bg-neutral-200"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${portals[portal.id] ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Summary */}
        <SectionCard title="Listing Summary" icon={<Check size={15} />}>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-1.5 border-b border-neutral-50">
              <span className="text-neutral-500">Type</span>
              <span className="font-semibold text-neutral-900">{listingType} — {propertyType}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-neutral-50">
              <span className="text-neutral-500">Location</span>
              <span className="font-semibold text-neutral-900">{locationValue || "—"}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-neutral-50">
              <span className="text-neutral-500">Price</span>
              <span className="font-semibold text-neutral-900">AED {price || "—"}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-neutral-50">
              <span className="text-neutral-500">Bedrooms</span>
              <span className="font-semibold text-neutral-900">{bedrooms || "Studio"}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-neutral-50">
              <span className="text-neutral-500">Size</span>
              <span className="font-semibold text-neutral-900">{sizeSqft ? `${sizeSqft} sqft` : "—"}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-neutral-50">
              <span className="text-neutral-500">Title</span>
              <span className="font-semibold text-neutral-900 max-w-[200px] text-right truncate">{listingTitle || "—"}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-neutral-500">Images</span>
              <span className="font-semibold text-neutral-900">{imageUrls.length} added</span>
            </div>
          </div>
        </SectionCard>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-neutral-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors">
              <X size={20} />
            </button>
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                Add Property — {listingType}
              </h2>
              <p className="text-xs text-neutral-500 hidden sm:block">
                Step {step + 1} of {STEPS.length}: {STEPS[step]}
              </p>
            </div>
          </div>
          <StepIndicator current={step} />
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-600 rounded-xl text-xs font-semibold hover:bg-neutral-200 transition-colors"
          >
            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : null}
            Save Draft
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          {step === 0 && renderStep1()}
          {step === 1 && renderStep2()}
          {step === 2 && renderStep3()}
          {step === 3 && renderStep4()}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-neutral-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <span className="text-xs text-neutral-400 hidden sm:block">
            {step + 1} / {STEPS.length}
          </span>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => {
                if (!canProceed()) {
                  toast.error("Please fill in all required fields before continuing.");
                  return;
                }
                setStep(s => s + 1);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-dark shadow-lg shadow-primary/25 transition-colors"
            >
              Next <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-dark shadow-lg shadow-primary/25 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Check size={16} /> Submit Listing</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
