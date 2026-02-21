"use client";

import { User, Bell, Shield, Moon, Globe, Lock, Smartphone, Sun, Monitor } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

export default function SettingsPage() {
    const [emailNotif, setEmailNotif] = useState(true);
    const [pushNotif, setPushNotif] = useState(false);
    const [activeTab, setActiveTab] = useState("Profile");
    const { theme, setTheme } = useTheme();

    return (
        <div className="max-w-4xl space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
                <p className="text-sm text-neutral-500 mt-1">Manage your account preferences and system configuration</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Navigation Sidebar */}
                <div className="space-y-1">
                    {[
                        { label: "Profile", icon: User },
                        { label: "Notifications", icon: Bell },
                        { label: "Appearance", icon: Moon },
                        { label: "Security", icon: Shield },
                    ].map((item) => (
                        <button
                            key={item.label}
                            onClick={() => setActiveTab(item.label)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.label
                                ? "bg-primary text-white shadow-lg shadow-primary/25"
                                : "text-neutral-600 hover:bg-neutral-100"
                                }`}
                        >
                            <item.icon size={18} /> {item.label}
                        </button>
                    ))}
                </div>

                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">

                    {/* Profile Section */}
                    {activeTab === "Profile" && (
                        <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm card-shadow">
                            <h2 className="text-lg font-bold text-neutral-900 mb-6">Profile Details</h2>

                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center text-2xl font-bold text-neutral-400 border-4 border-white shadow-lg">
                                    JD
                                </div>
                                <button className="px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm font-bold text-neutral-700 hover:bg-neutral-50 transition-colors shadow-sm">
                                    Change Avatar
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">First Name</label>
                                    <input type="text" defaultValue="John" className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Last Name</label>
                                    <input type="text" defaultValue="Doe" className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium" />
                                </div>
                                <div className="col-span-2 space-y-1.5">
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Email Address</label>
                                    <input type="email" defaultValue="admin@truevision.com" className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium" />
                                </div>
                                <div className="col-span-2 space-y-1.5">
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Role</label>
                                    <input type="text" defaultValue="Administrator" disabled className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-500 text-sm font-medium cursor-not-allowed" />
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Notifications Section */}
                    {activeTab === "Notifications" && (
                        <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm card-shadow">
                            <h2 className="text-lg font-bold text-neutral-900 mb-6">Notifications</h2>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-lg shadow-sm text-neutral-600"><Globe size={20} /></div>
                                        <div>
                                            <p className="font-bold text-neutral-900 text-sm">Email Notifications</p>
                                            <p className="text-xs text-neutral-500">Receive daily summaries and alerts</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setEmailNotif(!emailNotif)}
                                        className={`w-12 h-6 rounded-full transition-colors relative ${emailNotif ? 'bg-primary' : 'bg-neutral-300'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${emailNotif ? 'left-7' : 'left-1'}`} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-lg shadow-sm text-neutral-600"><Smartphone size={20} /></div>
                                        <div>
                                            <p className="font-bold text-neutral-900 text-sm">Push Notifications</p>
                                            <p className="text-xs text-neutral-500">Instant alerts on your mobile device</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setPushNotif(!pushNotif)}
                                        className={`w-12 h-6 rounded-full transition-colors relative ${pushNotif ? 'bg-primary' : 'bg-neutral-300'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${pushNotif ? 'left-7' : 'left-1'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Appearance / Dark Mode Section */}
                    {activeTab === "Appearance" && (
                        <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm card-shadow">
                            <h2 className="text-lg font-bold text-neutral-900 mb-2">Appearance</h2>
                            <p className="text-sm text-neutral-500 mb-6">Customize how TrueVision looks for you</p>

                            {/* Theme Selection */}
                            <div className="space-y-4">
                                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Theme</label>
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Light Mode */}
                                    <button
                                        onClick={() => setTheme("light")}
                                        className={`p-4 rounded-2xl border-2 transition-all text-left ${theme === "light" ? "border-primary bg-primary/5 shadow-md" : "border-neutral-200 hover:border-neutral-300"}`}
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme === "light" ? "bg-primary text-white" : "bg-neutral-100 text-neutral-400"}`}>
                                                <Sun size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-neutral-900">Light</p>
                                                <p className="text-[10px] text-neutral-400">Clean & bright</p>
                                            </div>
                                        </div>
                                        {/* Mini preview */}
                                        <div className="bg-neutral-100 rounded-xl p-2 space-y-1.5">
                                            <div className="h-2.5 w-full bg-white rounded" />
                                            <div className="flex gap-1">
                                                <div className="h-6 flex-1 bg-white rounded" />
                                                <div className="h-6 flex-1 bg-white rounded" />
                                            </div>
                                            <div className="h-3 w-2/3 bg-white rounded" />
                                        </div>
                                    </button>

                                    {/* Dark Mode */}
                                    <button
                                        onClick={() => setTheme("dark")}
                                        className={`p-4 rounded-2xl border-2 transition-all text-left ${theme === "dark" ? "border-primary bg-primary/5 shadow-md" : "border-neutral-200 hover:border-neutral-300"}`}
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme === "dark" ? "bg-primary text-white" : "bg-neutral-100 text-neutral-400"}`}>
                                                <Moon size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-neutral-900">Dark</p>
                                                <p className="text-[10px] text-neutral-400">Easy on the eyes</p>
                                            </div>
                                        </div>
                                        {/* Mini preview */}
                                        <div className="bg-neutral-800 rounded-xl p-2 space-y-1.5">
                                            <div className="h-2.5 w-full bg-neutral-700 rounded" />
                                            <div className="flex gap-1">
                                                <div className="h-6 flex-1 bg-neutral-700 rounded" />
                                                <div className="h-6 flex-1 bg-neutral-700 rounded" />
                                            </div>
                                            <div className="h-3 w-2/3 bg-neutral-700 rounded" />
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Current Theme Info */}
                            <div className="mt-6 p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        {theme === "dark" ? <Moon size={18} className="text-violet-500" /> : <Sun size={18} className="text-amber-500" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-neutral-900">Currently using {theme === "dark" ? "Dark" : "Light"} mode</p>
                                        <p className="text-xs text-neutral-500">Your preference is saved automatically</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security Section */}
                    {activeTab === "Security" && (
                        <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm card-shadow">
                            <h2 className="text-lg font-bold text-neutral-900 mb-6">Security</h2>
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Current Password</label>
                                    <input type="password" placeholder="Enter current password" className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">New Password</label>
                                    <input type="password" placeholder="Enter new password" className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Confirm Password</label>
                                    <input type="password" placeholder="Confirm new password" className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm" />
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <button className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all flex items-center gap-2">
                                        <Lock size={16} /> Update Password
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
