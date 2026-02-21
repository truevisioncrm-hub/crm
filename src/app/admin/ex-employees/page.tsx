"use client";

import { Search, Download, Trash2, RotateCcw } from "lucide-react";

const EX_EMPLOYEES = [
    { id: 1, name: "Suresh Kumar", role: "Junior Agent", left: "Jan 12, 2026", reason: "Resigned", contacts: 120 },
    { id: 2, name: "Meera Reddy", role: "Property Specialist", left: "Dec 05, 2025", reason: "Terminated", contacts: 45 },
    { id: 3, name: "Kiran Rao", role: "Senior Agent", left: "Nov 20, 2025", reason: "Resigned", contacts: 210 },
];

export default function ExEmployeesPage() {
    return (
        <div className="space-y-6 animate-fade-in">
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
                        className="pl-9 pr-4 py-2 border border-neutral-200 rounded-xl text-sm w-64 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-neutral-200 rounded-3xl shadow-sm card-shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-neutral-50/50">
                        <tr className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                            <th className="px-6 py-4">Employee</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Depature Date</th>
                            <th className="px-6 py-4">Reason</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                        {EX_EMPLOYEES.map((emp) => (
                            <tr key={emp.id} className="hover:bg-neutral-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-bold text-neutral-500 grayscale opacity-70">
                                            {emp.name.charAt(0)}
                                        </div>
                                        <span className="font-bold text-neutral-700">{emp.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-neutral-500">{emp.role}</td>
                                <td className="px-6 py-4 text-sm text-neutral-500">{emp.left}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${emp.reason === 'Resigned' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                                        }`}>
                                        {emp.reason}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-50 hover:bg-primary/10 text-neutral-600 hover:text-primary rounded-lg text-xs font-bold transition-all border border-neutral-200 hover:border-primary/20">
                                            <RotateCcw size={14} /> Restore
                                        </button>
                                        <button className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
