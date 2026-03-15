"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Download, Clock, UserCheck, UserX, AlertTriangle, Calendar, MapPin, Phone, BarChart3, Users, Timer, TrendingUp, Coffee, Loader2 } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

interface Employee {
    id: string;
    full_name: string;
    role: string;
    avatar_url: string | null;
}

interface AttendanceRecord {
    id: string;
    agent_id: string;
    attendance_date: string;
    status: string; // present, half_day, absent, on_leave
    check_in: string;
    check_out: string | null;
}

const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const statusColors: Record<string, { bg: string; text: string; border: string; label: string }> = {
    "present": { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200", label: "P" },
    "absent": { bg: "bg-red-100", text: "text-red-700", border: "border-red-200", label: "A" },
    "half_day": { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200", label: "H" },
    "on_leave": { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200", label: "L" },
    "weekend": { bg: "bg-neutral-50", text: "text-neutral-300", border: "border-neutral-100", label: "—" },
    "offline": { bg: "bg-neutral-100", text: "text-neutral-400", border: "border-neutral-200", label: "O" },
};

export default function AttendancePage() {
    const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
    const [view, setView] = useState<"cards" | "table">("cards");

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [attendanceDict, setAttendanceDict] = useState<Record<string, Record<number, AttendanceRecord>>>({});
    const [loading, setLoading] = useState(true);

    const now = new Date();
    const TODAY = now.getDate();
    const year = now.getFullYear();
    const month = now.getMonth();

    // Get real days in current month
    const DAYS_IN_MONTH = new Date(year, month + 1, 0).getDate();
    const DAYS = Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);

        try {
            const response = await fetch('/api/admin/attendance');
            const data = await response.json();
            if (data.error) throw new Error(data.error);

            if (data.employees) setEmployees(data.employees);

            if (data.attendance) {
                // Group by agent_id and then day
                const grouped: Record<string, Record<number, AttendanceRecord>> = {};
                data.attendance.forEach((record: AttendanceRecord) => {
                    if (!grouped[record.agent_id]) grouped[record.agent_id] = {};

                    // Assuming attendance_date is YYYY-MM-DD
                    const day = new Date(record.attendance_date).getDate();
                    grouped[record.agent_id][day] = record;
                });
                setAttendanceDict(grouped);
            }
        } catch (err: any) {
            console.error("Fetch Data Error:", err.message);
        } finally {
            setLoading(false);
        }
    };

    function getAttendance(empId: string, day: number): AttendanceRecord | { status: string } {
        const dayOfWeek = new Date(year, month, day).getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) return { status: "weekend" };

        if (attendanceDict[empId]?.[day]) {
            return attendanceDict[empId][day];
        }

        // If day is past and no record, they were absent
        if (day < TODAY) return { status: "absent" };

        // Future days or today (if not yet checked in)
        return { status: "offline" };
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-neutral-500 font-medium">Fetching attendance logs...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Attendance Tracker</h1>
                    <p className="text-sm text-neutral-500 mt-1">Real-time status and monthly attendance logs</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm font-semibold hover:bg-neutral-50 transition-colors shadow-sm">
                        <Download size={16} /> Export CSV
                    </button>
                    <div className="flex bg-neutral-100 rounded-xl p-1 gap-1">
                        <button onClick={() => setView("cards")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${view === "cards" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"}`}>Cards</button>
                        <button onClick={() => setView("table")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${view === "table" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"}`}>Table</button>
                    </div>
                </div>
            </div>

            {/* Content */}
            {view === "cards" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {employees.map((emp) => {
                        const todayStatus = getAttendance(emp.id, TODAY);
                        const colors = statusColors[todayStatus.status] || statusColors.offline;

                        return (
                            <div key={emp.id} className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden relative">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center text-xl font-bold text-neutral-400 overflow-hidden relative border-2 border-white shadow-sm">
                                            {emp.avatar_url ? <Image src={emp.avatar_url} alt="Avatar" fill className="object-cover" /> : emp.full_name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-neutral-900">{emp.full_name}</h3>
                                            <p className="text-xs text-neutral-500 font-medium">{emp.role}</p>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold border ${colors.bg} ${colors.text} ${colors.border} uppercase`}>
                                        {todayStatus.status}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Clock size={12} className="text-neutral-400" />
                                            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Check-in</span>
                                        </div>
                                        <p className="text-sm font-bold text-neutral-900">
                                            {(todayStatus as AttendanceRecord).check_in ? new Date((todayStatus as AttendanceRecord).check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Timer size={12} className="text-neutral-400" />
                                            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Checkout</span>
                                        </div>
                                        <p className="text-sm font-bold text-neutral-900">
                                            {(todayStatus as AttendanceRecord).check_out ? new Date((todayStatus as AttendanceRecord).check_out!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* Full Table View */
                <div className="bg-white border border-neutral-200 rounded-3xl shadow-sm card-shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-neutral-50/50 border-b border-neutral-100">
                                    <th className="sticky left-0 z-10 bg-neutral-50/80 backdrop-blur px-6 py-4 text-left text-[10px] font-bold text-neutral-400 uppercase tracking-wider border-r border-neutral-100">Employee</th>
                                    {DAYS.map(day => (
                                        <th key={day} className={`px-2 py-4 text-center text-[10px] font-bold min-w-[32px] ${day === TODAY ? "bg-primary/5 text-primary" : "text-neutral-400"}`}>
                                            <p>{DAY_NAMES[new Date(year, month, day).getDay()]}</p>
                                            <p className="text-sm mt-0.5">{day}</p>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {employees.map(emp => (
                                    <tr key={emp.id} className="hover:bg-neutral-50/30 transition-colors">
                                        <td className="sticky left-0 z-10 bg-white group-hover:bg-neutral-50 px-6 py-4 border-r border-neutral-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-[10px] font-bold text-neutral-500 overflow-hidden relative">
                                                    {emp.avatar_url ? <Image src={emp.avatar_url} alt="Avatar" fill className="object-cover" /> : emp.full_name.charAt(0)}
                                                </div>
                                                <span className="text-sm font-bold text-neutral-700 whitespace-nowrap">{emp.full_name}</span>
                                            </div>
                                        </td>
                                        {DAYS.map(day => {
                                            const record = getAttendance(emp.id, day);
                                            const colors = statusColors[record.status] || statusColors.offline;
                                            return (
                                                <td key={day} className={`px-1 py-4 text-center ${day === TODAY ? "bg-primary/5" : ""}`}>
                                                    <div className={`w-7 h-7 mx-auto rounded-lg flex items-center justify-center text-[10px] font-bold border transition-all ${colors.bg} ${colors.text} ${colors.border} hover:scale-110 cursor-default`} title={`${record.status} - Day ${day}`}>
                                                        {colors.label}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
