"use client";

import { useState } from "react";
import Sidebar, { NavItem } from "@/components/shared/Sidebar";
import TopBar from "@/components/shared/TopBar";
import {
    LayoutDashboard, Users, FileText, Building2, MapPin,
    CalendarCheck, BarChart3, MessageSquare, UserX, Settings, Warehouse,
} from "lucide-react";

const NAV_ITEMS: NavItem[] = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
    { label: "Agents", icon: Users, href: "/admin/agents" },
    { label: "Leads", icon: FileText, href: "/admin/leads" },
    { label: "Sell", icon: Building2, href: "/admin/sell" },
    { label: "Rent", icon: Building2, href: "/admin/rent" },
    { label: "PF Inventory", icon: Warehouse, href: "/admin/inventory" },
    { label: "Visits", icon: MapPin, href: "/admin/visits" },
    { label: "Attendance", icon: CalendarCheck, href: "/admin/attendance" },
    { label: "Reports", icon: BarChart3, href: "/admin/reports" },
    { label: "Messaging", icon: MessageSquare, href: "/admin/messaging" },
    { label: "Ex-Employees", icon: UserX, href: "/admin/ex-employees" },
    { label: "Settings", icon: Settings, href: "/admin/settings" },
];

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
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
