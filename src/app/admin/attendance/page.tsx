"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Download, Clock, UserCheck, UserX, AlertTriangle, Calendar, MapPin, Phone, BarChart3, Users, Timer, TrendingUp, Coffee } from "lucide-react";

interface Employee {
    id: number;
    name: string;
    role: string;
    avatar: string;
    color: string;
}

interface AttendanceRecord {
    employeeId: number;
    day: number;
    status: "present" | "absent" | "late" | "leave" | "half-day" | "weekend";
    checkIn?: string;
    checkOut?: string;
    hours?: string;
    location?: string;
}

const EMPLOYEES: Employee[] = [
    { id: 1, name: "Arjun Mehta", role: "Senior Agent", avatar: "AM", color: "bg-blue-500" },
    { id: 2, name: "Priya Singh", role: "Property Specialist", avatar: "PS", color: "bg-pink-500" },
    { id: 3, name: "Rahul Kumar", role: "Junior Agent", avatar: "RK", color: "bg-amber-500" },
    { id: 4, name: "Sneha Patel", role: "Senior Agent", avatar: "SP", color: "bg-emerald-500" },
    { id: 5, name: "Vikash Jain", role: "Field Agent", avatar: "VJ", color: "bg-violet-500" },
];

// Deterministic mock data (seeded by employeeId + day)
function getAttendance(empId: number, day: number): AttendanceRecord {
    const dayOfWeek = new Date(2026, 1, day).getDay(); // Feb 2026
    if (dayOfWeek === 0 || dayOfWeek === 6) return { employeeId: empId, day, status: "weekend" };

    const seed = (empId * 31 + day * 7) % 20;
    if (seed === 0) return { employeeId: empId, day, status: "absent" };
    if (seed === 1) return { employeeId: empId, day, status: "leave" };
    if (seed === 2) return { employeeId: empId, day, status: "half-day", checkIn: "09:15 AM", checkOut: "01:30 PM", hours: "4.2h", location: "Office" };
    if (seed === 3) return { employeeId: empId, day, status: "late", checkIn: "10:45 AM", checkOut: "06:30 PM", hours: "7.8h", location: "Field" };
    const hrs = ["7.5h", "8.0h", "8.5h", "9.0h", "7.8h"];
    const locs = ["Office", "Field", "Office", "Site Visit", "Office"];
    return { employeeId: empId, day, status: "present", checkIn: "09:00 AM", checkOut: "06:00 PM", hours: hrs[seed % 5], location: locs[seed % 5] };
}

const TODAY = 14; // Feb 14
const DAYS_IN_MONTH = 28;
const DAYS = Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1);
const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const statusColors: Record<string, { bg: string; text: string; border: string; label: string }> = {
    present: { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200", label: "P" },
    absent: { bg: "bg-red-100", text: "text-red-700", border: "border-red-200", label: "A" },
    late: { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200", label: "L" },
    leave: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200", label: "LV" },
    "half-day": { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200", label: "½" },
    weekend: { bg: "bg-neutral-50", text: "text-neutral-300", border: "border-neutral-100", label: "—" },
};

export default function AttendancePage() {
    const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
    const [view, setView] = useState<"table" | "cards">("cards");

    // Calculate stats
    const allRecords = EMPLOYEES.flatMap((emp) => DAYS.filter((d) => d <= TODAY).map((d) => getAttendance(emp.id, d)));
    const workingDays = allRecords.filter((r) => r.status !== "weekend");
    const totalPresent = workingDays.filter((r) => r.status === "present" || r.status === "late" || r.status === "half-day").length;
    const totalAbsent = workingDays.filter((r) => r.status === "absent").length;
    const totalLate = workingDays.filter((r) => r.status === "late").length;
    const totalLeave = workingDays.filter((r) => r.status === "leave").length;

    // Per-employee stats
    function getEmpStats(empId: number) {
        const records = DAYS.filter((d) => d <= TODAY).map((d) => getAttendance(empId, d));
        const work = records.filter((r) => r.status !== "weekend");
        const present = work.filter((r) => ["present", "late", "half-day"].includes(r.status)).length;
        const absent = work.filter((r) => r.status === "absent").length;
        const late = work.filter((r) => r.status === "late").length;
        const leaves = work.filter((r) => r.status === "leave").length;
        const pct = work.length > 0 ? Math.round((present / work.length) * 100) : 0;
        const todayRec = getAttendance(empId, TODAY);
        return { present, absent, late, leaves, pct, total: work.length, todayStatus: todayRec.status, todayCheckIn: todayRec.checkIn, todayCheckOut: todayRec.checkOut, todayHours: todayRec.hours, todayLocation: todayRec.location };
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Attendance</h1>
                    <p className="text-sm text-neutral-500 mt-1">Track daily attendance and working hours</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white border border-neutral-200 rounded-xl px-2 py-1 shadow-sm">
                        <button className="p-1 hover:bg-neutral-50 rounded-lg text-neutral-500 hover:text-neutral-900"><ChevronLeft size={18} /></button>
                        <span className="text-sm font-bold text-neutral-800 px-3">February 2026</span>
                        <button className="p-1 hover:bg-neutral-50 rounded-lg text-neutral-500 hover:text-neutral-900"><ChevronRight size={18} /></button>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm font-semibold hover:bg-neutral-50 transition-colors shadow-sm">
                        <Download size={16} /> Report
                    </button>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: "Present Today", value: EMPLOYEES.filter((e) => { const s = getAttendance(e.id, TODAY).status; return s === "present" || s === "late" || s === "half-day"; }).length.toString(), sub: `of ${EMPLOYEES.length} agents`, icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50", iconBg: "bg-emerald-100" },
                    { label: "Absent Today", value: EMPLOYEES.filter((e) => getAttendance(e.id, TODAY).status === "absent").length.toString(), sub: "need follow-up", icon: UserX, color: "text-red-600", bg: "bg-red-50", iconBg: "bg-red-100" },
                    { label: "Late Arrivals", value: totalLate.toString(), sub: "this month", icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50", iconBg: "bg-amber-100" },
                    { label: "Overall Rate", value: `${workingDays.length > 0 ? Math.round((totalPresent / workingDays.length) * 100) : 0}%`, sub: "attendance rate", icon: TrendingUp, color: "text-primary", bg: "bg-primary/5", iconBg: "bg-primary/10" },
                ].map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">{stat.label}</p>
                                <div className={`w-8 h-8 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                                    <Icon size={16} className={stat.color} />
                                </div>
                            </div>
                            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                            <span className="text-[10px] text-neutral-400">{stat.sub}</span>
                        </div>
                    );
                })}
            </div>

            {/* View Toggle */}
            <div className="p-4 bg-white border border-neutral-100 rounded-2xl shadow-sm flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <Calendar size={14} /> <span className="font-semibold">Today: Feb {TODAY}, 2026</span>
                    <span className="text-neutral-300">|</span>
                    <span>{EMPLOYEES.length} agents tracked</span>
                </div>
                <div className="flex-1" />
                <div className="flex bg-neutral-100 rounded-xl p-1 gap-1">
                    <button onClick={() => setView("cards")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${view === "cards" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}>
                        <Users size={14} /> Cards
                    </button>
                    <button onClick={() => setView("table")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${view === "table" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}>
                        <BarChart3 size={14} /> Calendar
                    </button>
                </div>
            </div>

            {view === "cards" ? (
                /* ─── Employee Cards View ─── */
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {EMPLOYEES.map((emp) => {
                        const stats = getEmpStats(emp.id);
                        const todayColor = statusColors[stats.todayStatus] || statusColors.present;
                        return (
                            <div
                                key={emp.id}
                                onClick={() => setSelectedEmployee(selectedEmployee === emp.id ? null : emp.id)}
                                className={`bg-white rounded-2xl border p-5 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden ${selectedEmployee === emp.id ? "border-primary/30 ring-2 ring-primary/10" : "border-neutral-100"}`}
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-11 h-11 rounded-2xl ${emp.color} text-white flex items-center justify-center text-sm font-bold`}>
                                            {emp.avatar}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-neutral-900">{emp.name}</h3>
                                            <p className="text-[10px] text-neutral-400 uppercase tracking-wider">{emp.role}</p>
                                        </div>
                                    </div>
                                    <div className={`flex flex-col items-center px-3 py-1.5 rounded-xl ${todayColor.bg} border ${todayColor.border}`}>
                                        <span className={`text-[9px] font-semibold ${todayColor.text} uppercase`}>Today</span>
                                        <span className={`text-sm font-bold ${todayColor.text}`}>{todayColor.label}</span>
                                    </div>
                                </div>

                                {/* Today's details */}
                                {stats.todayCheckIn && (
                                    <div className="flex items-center gap-4 mb-4 px-3 py-2.5 bg-neutral-50 rounded-xl border border-neutral-100">
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={11} className="text-emerald-500" />
                                            <span className="text-[10px] text-neutral-600"><b>In:</b> {stats.todayCheckIn}</span>
                                        </div>
                                        {stats.todayCheckOut && (
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={11} className="text-red-400" />
                                                <span className="text-[10px] text-neutral-600"><b>Out:</b> {stats.todayCheckOut}</span>
                                            </div>
                                        )}
                                        {stats.todayHours && (
                                            <div className="flex items-center gap-1.5">
                                                <Timer size={11} className="text-blue-500" />
                                                <span className="text-[10px] font-semibold text-neutral-700">{stats.todayHours}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Stats Row */}
                                <div className="grid grid-cols-4 gap-2 mb-4">
                                    {[
                                        { label: "Present", value: stats.present, color: "text-emerald-600", bg: "bg-emerald-50" },
                                        { label: "Absent", value: stats.absent, color: "text-red-600", bg: "bg-red-50" },
                                        { label: "Late", value: stats.late, color: "text-amber-600", bg: "bg-amber-50" },
                                        { label: "Leave", value: stats.leaves, color: "text-blue-600", bg: "bg-blue-50" },
                                    ].map((s) => (
                                        <div key={s.label} className={`text-center py-2 rounded-lg ${s.bg}`}>
                                            <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
                                            <p className="text-[8px] text-neutral-400 uppercase font-semibold">{s.label}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Attendance Rate Bar */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-[10px] font-semibold text-neutral-500">Attendance Rate</span>
                                        <span className={`text-xs font-bold ${stats.pct >= 90 ? "text-emerald-600" : stats.pct >= 75 ? "text-amber-600" : "text-red-600"}`}>{stats.pct}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${stats.pct >= 90 ? "bg-emerald-500" : stats.pct >= 75 ? "bg-amber-500" : "bg-red-500"}`}
                                            style={{ width: `${stats.pct}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Mini Calendar (Expanded) */}
                                {selectedEmployee === emp.id && (
                                    <div className="mt-4 pt-4 border-t border-neutral-100">
                                        <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">February Calendar</p>
                                        <div className="grid grid-cols-7 gap-1">
                                            {DAY_NAMES.map((dn) => (
                                                <div key={dn} className="text-center text-[8px] font-semibold text-neutral-400 py-1">{dn}</div>
                                            ))}
                                            {/* Offset for Feb 2026: Feb 1 is Sunday = 0 */}
                                            {DAYS.map((day) => {
                                                const rec = getAttendance(emp.id, day);
                                                const sc = statusColors[rec.status];
                                                const isFuture = day > TODAY;
                                                return (
                                                    <div
                                                        key={day}
                                                        className={`aspect-square rounded-lg flex items-center justify-center text-[9px] font-bold border transition-all ${isFuture ? "bg-neutral-50 text-neutral-300 border-transparent" : `${sc.bg} ${sc.text} ${sc.border}`} ${day === TODAY ? "ring-2 ring-primary/30" : ""}`}
                                                        title={`${day} Feb — ${rec.status}`}
                                                    >
                                                        {day}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="flex flex-wrap gap-3 mt-3">
                                            {Object.entries(statusColors).filter(([k]) => k !== "weekend").map(([key, val]) => (
                                                <div key={key} className="flex items-center gap-1.5">
                                                    <div className={`w-3 h-3 rounded ${val.bg} border ${val.border}`} />
                                                    <span className="text-[9px] text-neutral-500 capitalize">{key}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* ─── Table / Calendar Grid View ─── */
                <div className="bg-white border border-neutral-100 rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-neutral-100 bg-neutral-50/50">
                                    <th className="sticky left-0 z-10 bg-neutral-50 p-4 min-w-[200px] text-xs font-bold text-neutral-500 uppercase tracking-wider border-r border-neutral-200">Employee</th>
                                    {DAYS.map((day) => {
                                        const dow = new Date(2026, 1, day).getDay();
                                        return (
                                            <th key={day} className={`p-1.5 text-center min-w-[38px] ${day === TODAY ? "bg-primary/5" : ""}`}>
                                                <div className={`text-[10px] font-bold ${day === TODAY ? "text-primary" : "text-neutral-400"}`}>{day}</div>
                                                <div className="text-[8px] font-medium text-neutral-300">{DAY_NAMES[dow]}</div>
                                            </th>
                                        );
                                    })}
                                    <th className="p-4 text-center text-xs font-bold text-neutral-500 uppercase tracking-wider min-w-[60px] border-l border-neutral-200">Rate</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {EMPLOYEES.map((emp) => {
                                    const stats = getEmpStats(emp.id);
                                    return (
                                        <tr key={emp.id} className="hover:bg-neutral-50/30 transition-colors">
                                            <td className="sticky left-0 z-10 bg-white p-4 border-r border-neutral-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-xl ${emp.color} text-white flex items-center justify-center text-[10px] font-bold`}>
                                                        {emp.avatar}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-neutral-900">{emp.name}</p>
                                                        <p className="text-[9px] text-neutral-400">{emp.role}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            {DAYS.map((day) => {
                                                const rec = getAttendance(emp.id, day);
                                                const sc = statusColors[rec.status];
                                                const isFuture = day > TODAY;
                                                return (
                                                    <td key={day} className={`p-1.5 text-center ${day === TODAY ? "bg-primary/5" : ""}`}>
                                                        {isFuture ? (
                                                            <div className="w-7 h-7 rounded-lg bg-neutral-50 mx-auto" />
                                                        ) : (
                                                            <div className={`w-7 h-7 rounded-lg ${sc.bg} border ${sc.border} ${sc.text} text-[9px] font-bold flex items-center justify-center mx-auto cursor-default`} title={`${rec.status}${rec.checkIn ? ` — ${rec.checkIn}` : ""}`}>
                                                                {sc.label}
                                                            </div>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                            <td className="p-4 text-center border-l border-neutral-200">
                                                <span className={`text-xs font-bold ${stats.pct >= 90 ? "text-emerald-600" : stats.pct >= 75 ? "text-amber-600" : "text-red-600"}`}>{stats.pct}%</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Legend */}
                    <div className="px-6 py-4 border-t border-neutral-100 flex flex-wrap gap-4">
                        {Object.entries(statusColors).map(([key, val]) => (
                            <div key={key} className="flex items-center gap-1.5">
                                <div className={`w-5 h-5 rounded-md ${val.bg} border ${val.border} ${val.text} text-[8px] font-bold flex items-center justify-center`}>{val.label}</div>
                                <span className="text-[10px] text-neutral-500 capitalize">{key}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
