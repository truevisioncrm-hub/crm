"use client";

import { useState } from "react";
import Sidebar, { NavItem } from "@/components/shared/Sidebar";
import TopBar from "@/components/shared/TopBar";
import {
    LayoutDashboard, FileText, MapPin, Building2, CalendarCheck, User,
} from "lucide-react";

const NAV_ITEMS: NavItem[] = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/agent/dashboard" },
    { label: "My Leads", icon: FileText, href: "/agent/leads" },
    { label: "My Visits", icon: MapPin, href: "/agent/visits" },
    { label: "Sell", icon: Building2, href: "/agent/sell" },
    { label: "Rent", icon: Building2, href: "/agent/rent" },
    { label: "Attendance", icon: CalendarCheck, href: "/agent/attendance" },
    { label: "Profile", icon: User, href: "/agent/profile" },
];

export default function AgentLayoutClient({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(true);

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            <Sidebar items={NAV_ITEMS} collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
            <div
                className="flex-1 flex flex-col min-w-0"
                style={{ marginLeft: collapsed ? 80 : 250, transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)" }}
            >
                <TopBar />
                <main className="flex-1 p-8 w-full animate-fade-in">
                    {children}
                </main>
            </div>
        </div>
    );
}
