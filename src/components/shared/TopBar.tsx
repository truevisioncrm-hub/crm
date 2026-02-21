"use client";

import { Search, Bell, ChevronDown, Plus, Download, SlidersHorizontal } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth";

interface TopBarProps {
    title?: string; // Optional page title
    action?: React.ReactNode; // Optional primary action button
}

export default function TopBar({ title, action }: TopBarProps) {
    const { user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header
            className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-200 px-8 flex items-center justify-between"
            style={{ height: "var(--topbar-height)" }}
        >
            {/* Left: Search */}
            <div className="flex items-center gap-6 flex-1">
                <div className="relative w-80">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="w-full pl-11 pr-5 py-2.5 text-sm bg-neutral-50/50 border-transparent focus:bg-white focus:border-neutral-200 rounded-full transition-all"
                    />
                </div>
            </div>

            {/* Right: Actions & Profile */}
            <div className="flex items-center gap-4">
                {/* Optional Custom Action passed from page */}
                {action}

                <div className="h-8 w-px bg-neutral-200 mx-2" />

                <button className="relative p-2.5 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded-full transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-danger rounded-full border-2 border-white" />
                </button>

                <div ref={dropdownRef} className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-neutral-50 transition-all border border-transparent hover:border-neutral-200"
                    >
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-bold text-neutral-800 leading-tight">{user?.name || "User"}</p>
                            <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">{user?.role || "View Only"}</p>
                        </div>
                        <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center text-primary font-bold text-sm border-2 border-white shadow-sm overflow-hidden">
                            {/* In real app, use <Image> here */}
                            {user?.name?.charAt(0) || "U"}
                        </div>
                        <ChevronDown size={14} className="text-neutral-400 mr-2" />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-neutral-100 py-2 animate-fade-in origin-top-right">
                            <div className="px-4 py-3 border-b border-neutral-100 mb-1">
                                <p className="text-sm font-bold text-neutral-900">{user?.name}</p>
                                <p className="text-xs text-neutral-500">{user?.email}</p>
                            </div>
                            <button className="w-full text-left px-4 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors">
                                Profile Settings
                            </button>
                            <button className="w-full text-left px-4 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors">
                                Preferences
                            </button>
                            <div className="h-px bg-neutral-100 my-1" />
                            <button onClick={logout} className="w-full text-left px-4 py-2.5 text-sm text-danger hover:bg-danger-light/30 transition-colors font-medium">
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
