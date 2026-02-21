"use client";

import { ChevronLeft, ChevronRight, CheckCircle2, XCircle } from "lucide-react";

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

export default function AgentAttendancePage() {
    return (
        <div className="space-y-6 animate-fade-in max-w-4xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">My Attendance</h1>
                    <p className="text-sm text-neutral-500 mt-1">Your attendance record for Feb 2026</p>
                </div>
                <div className="flex items-center bg-white border border-neutral-200 rounded-xl px-2 py-1 shadow-sm">
                    <button className="p-1 hover:bg-neutral-50 rounded-lg text-neutral-500 hover:text-neutral-900"><ChevronLeft size={18} /></button>
                    <span className="text-sm font-bold text-neutral-800 px-3">February 2026</span>
                    <button className="p-1 hover:bg-neutral-50 rounded-lg text-neutral-500 hover:text-neutral-900"><ChevronRight size={18} /></button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm card-shadow">
                <div className="grid grid-cols-7 gap-4 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-xs font-bold text-neutral-400 uppercase tracking-wider">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-4">
                    {/* Empty slots for start of month (mock) */}
                    <div /> <div /> <div />

                    {DAYS.map(day => {
                        const isWeekend = (day + 3) % 7 === 0 || (day + 3) % 7 === 6; // Mock weekend logic
                        const isToday = day === 14;
                        const isPresent = !isWeekend && day < 14;

                        return (
                            <div key={day} className="flex flex-col items-center gap-1">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${isToday ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-110' :
                                        isWeekend ? 'bg-neutral-50 text-neutral-400' :
                                            isPresent ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                                'bg-white text-neutral-600 border border-neutral-100'
                                    }`}>
                                    {day}
                                </div>
                                {isPresent && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex flex-col items-center text-center">
                    <span className="text-2xl font-bold text-emerald-700">12</span>
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide mt-1">Days Present</span>
                </div>
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex flex-col items-center text-center">
                    <span className="text-2xl font-bold text-red-700">0</span>
                    <span className="text-xs font-bold text-red-600 uppercase tracking-wide mt-1">Days Absent</span>
                </div>
                <div className="p-4 bg-neutral-100 border border-neutral-200 rounded-2xl flex flex-col items-center text-center">
                    <span className="text-2xl font-bold text-neutral-700">98%</span>
                    <span className="text-xs font-bold text-neutral-600 uppercase tracking-wide mt-1">Attendance</span>
                </div>
            </div>
        </div>
    );
}
