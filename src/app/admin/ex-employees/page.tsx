"use client";

import { useState, useEffect } from "react";
import { Search, Download, Trash2, RotateCcw, Loader2 } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

interface ExEmployee {
    id: string;
    name: string;
    role: string;
    avatar_url: string | null;
    updated_at: string;
}

export default function ExEmployeesPage() {
    const [exEmployees, setExEmployees] = useState<ExEmployee[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchExEmployees();
    }, []);

    const fetchExEmployees = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/ex-employees');
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            setExEmployees(data);
        } catch (err: any) {
            console.error("Fetch Ex-Employees Error:", err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async (id: string) => {
        try {
            const response = await fetch('/api/admin/ex-employees', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, is_active: true }),
            });
            const result = await response.json();
            if (result.error) throw new Error(result.error);

            // Remove from the local list
            setExEmployees(exEmployees.filter(emp => emp.id !== id));
        } catch (err: any) {
            console.error("Restore Error:", err.message);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Ex-Employees</h1>
                    <p className="text-sm text-neutral-500 mt-1">Manage departed staff and data retention</p>
                </div>
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-9 pr-4 py-2 border border-neutral-200 rounded-xl text-sm w-64 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : exEmployees.length === 0 ? (
                <div className="text-center p-12 bg-white rounded-3xl border border-neutral-100">
                    <p className="text-neutral-500">No ex-employees found.</p>
                </div>
            ) : (
                /* Table */
                <div className="bg-white border border-neutral-200 rounded-3xl shadow-sm card-shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-neutral-50/50">
                                <tr className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                                    <th className="px-6 py-4">Employee</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Depature Date</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {exEmployees.map((emp) => (
                                    <tr key={emp.id} className="hover:bg-neutral-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-bold text-neutral-500 grayscale opacity-70">
                                                    {emp.avatar_url ? <Image src={emp.avatar_url} alt="Avatar" width={40} height={40} className="w-full h-full rounded-full object-cover" /> : emp.name.charAt(0)}
                                                </div>
                                                <span className="font-bold text-neutral-700">{emp.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-500">{emp.role}</td>
                                        <td className="px-6 py-4 text-sm text-neutral-500">
                                            {new Date(emp.updated_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600 border border-neutral-200">
                                                Archived
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleRestore(emp.id)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-50 hover:bg-emerald-50 text-neutral-600 hover:text-emerald-700 rounded-lg text-xs font-bold transition-all border border-neutral-200 hover:border-emerald-200"
                                                >
                                                    <RotateCcw size={14} /> Restore
                                                </button>
                                            </div>
                                        </td>
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
