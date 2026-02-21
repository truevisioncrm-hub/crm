"use client";

import { User, Bell, Shield, Smartphone, Camera } from "lucide-react";

export default function AgentProfilePage() {
    return (
        <div className="max-w-2xl space-y-8 animate-fade-in mx-auto">
            {/* Header */}
            <div className="text-center">
                <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-full bg-neutral-100 flex items-center justify-center text-3xl font-bold text-neutral-400 border-4 border-white shadow-xl mb-4">
                        AR
                    </div>
                    <button className="absolute bottom-4 right-0 p-2 bg-primary text-white rounded-full shadow-md hover:bg-primary-dark transition-colors">
                        <Camera size={14} />
                    </button>
                </div>
                <h1 className="text-2xl font-bold text-neutral-900">Agent Rahul</h1>
                <p className="text-sm text-neutral-500">Senior Real Estate Agent</p>
            </div>

            {/* Form */}
            <div className="bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm card-shadow space-y-6">
                <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">First Name</label>
                        <input type="text" defaultValue="Rahul" className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Last Name</label>
                        <input type="text" defaultValue="Sharma" className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium" />
                    </div>
                    <div className="col-span-2 space-y-1.5">
                        <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Email Address</label>
                        <input type="email" defaultValue="rahul.agent@truevision.com" className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium" />
                    </div>
                    <div className="col-span-2 space-y-1.5">
                        <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Phone Number</label>
                        <input type="tel" defaultValue="+91 98765 43210" className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium" />
                    </div>
                </div>

                <div className="pt-6 border-t border-neutral-100">
                    <button className="w-full py-3 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all transform active:scale-[0.98]">
                        Save Profile Changes
                    </button>
                </div>
            </div>

            {/* Settings Links */}
            <div className="grid grid-cols-1 gap-3">
                <button className="flex items-center justify-between p-4 bg-white border border-neutral-200 rounded-2xl hover:bg-neutral-50 transition-colors shadow-sm card-shadow text-left group">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-neutral-100 rounded-lg text-neutral-600 group-hover:text-primary transition-colors"><Bell size={18} /></div>
                        <span className="font-bold text-neutral-700">Notification Preferences</span>
                    </div>
                </button>
                <button className="flex items-center justify-between p-4 bg-white border border-neutral-200 rounded-2xl hover:bg-neutral-50 transition-colors shadow-sm card-shadow text-left group">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-neutral-100 rounded-lg text-neutral-600 group-hover:text-primary transition-colors"><Shield size={18} /></div>
                        <span className="font-bold text-neutral-700">Security & Password</span>
                    </div>
                </button>
            </div>
        </div>
    );
}
