"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface AttendanceRecord {
    id: number;
    date: string;
    status: string;
    check_in_time: string;
    check_out_time: string | null;
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AgentAttendancePage() {
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Get current month info
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    
    const DAYS = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const EMPTY_SLOTS = Array.from({ length: firstDayOfMonth }, (_, i) => i);

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/agent/attendance');
            const data = await response.json();
            if (Array.isArray(data)) {
                setRecords(data);
            }
        } catch (err) {
            console.error("Fetch Attendance Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const getRecordForDay = (day: number) => {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return records.find(r => r.date === dateStr);
    };

    const presentDays = records.filter(r => r.status === 'Online' || r.status === 'On Visit').length;
    const attendancePct = daysInMonth > 0 ? Math.round((presentDays / (now.getDate())) * 100) : 0;

    if (loading) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in max-w-4xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">My Attendance</h1>
                    <p className="text-sm text-neutral-500 mt-1">
                        Your attendance record for {now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                </div>
                <div className="flex items-center bg-white border border-neutral-200 rounded-xl px-2 py-1 shadow-sm">
                    <button className="p-1 hover:bg-neutral-50 rounded-lg text-neutral-500 hover:text-neutral-900"><ChevronLeft size={18} /></button>
                    <span className="text-sm font-bold text-neutral-800 px-3">
                        {now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    <button className="p-1 hover:bg-neutral-50 rounded-lg text-neutral-500 hover:text-neutral-900"><ChevronRight size={18} /></button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm card-shadow">
                <div className="grid grid-cols-7 gap-4 mb-4">
                    {DAY_NAMES.map(day => (
                        <div key={day} className="text-center text-xs font-bold text-neutral-400 uppercase tracking-wider">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-4">
                    {EMPTY_SLOTS.map(i => <div key={`empty-${i}`} />)}

                    {DAYS.map(day => {
                        const record = getRecordForDay(day);
                        const isToday = day === now.getDate();
                        const dateObj = new Date(currentYear, currentMonth, day);
                        const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
                        const isPast = day < now.getDate();
                        const isPresent = !!record;

                        return (
                            <div key={day} className="flex flex-col items-center gap-1">
                                <div 
                                    title={record ? `Check-in: ${new Date(record.check_in_time).toLocaleTimeString()}` : ''}
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                                        isToday ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-110' :
                                        isWeekend ? 'bg-neutral-50 text-neutral-400' :
                                        isPresent ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                        isPast ? 'bg-red-50 text-red-400 border border-red-50' :
                                        'bg-white text-neutral-600 border border-neutral-100'
                                    }`}
                                >
                                    {day}
                                </div>
                                {isPresent && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                                {!isPresent && isPast && !isWeekend && <div className="w-1.5 h-1.5 rounded-full bg-red-400" />}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex flex-col items-center text-center">
                    <span className="text-2xl font-bold text-emerald-700">{presentDays}</span>
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide mt-1">Days Present</span>
                </div>
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex flex-col items-center text-center">
                    <span className="text-2xl font-bold text-red-700">
                        {DAYS.filter(d => d < now.getDate() && !getRecordForDay(d) && (new Date(currentYear, currentMonth, d).getDay() !== 0 && new Date(currentYear, currentMonth, d).getDay() !== 6)).length}
                    </span>
                    <span className="text-xs font-bold text-red-600 uppercase tracking-wide mt-1">Days Absent</span>
                </div>
                <div className="p-4 bg-neutral-100 border border-neutral-200 rounded-2xl flex flex-col items-center text-center">
                    <span className="text-2xl font-bold text-neutral-700">{attendancePct > 100 ? 100 : attendancePct}%</span>
                    <span className="text-xs font-bold text-neutral-600 uppercase tracking-wide mt-1">Rate</span>
                </div>
            </div>
        </div>
    );
}
