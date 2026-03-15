"use client";

import { Search, Send, MoreVertical, Phone, Video, Paperclip, MessageSquare } from "lucide-react";
import { useState } from "react";

export default function MessagingPage() {
    const [activeContact, setActiveContact] = useState<any>(null);

    return (
        <div className="h-[calc(100vh-8rem)] bg-white border border-neutral-200 rounded-3xl shadow-sm card-shadow overflow-hidden flex animate-fade-in">
            {/* Sidebar */}
            <div className="w-80 border-r border-neutral-200 flex flex-col bg-neutral-50/30">
                <div className="p-4 border-b border-neutral-200">
                    <h2 className="text-lg font-bold text-neutral-900 mb-4">Messages</h2>
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            disabled
                            className="w-full pl-9 pr-4 py-2.5 bg-neutral-100 border border-neutral-200 rounded-xl text-sm cursor-not-allowed opacity-50"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center text-neutral-300 mb-4">
                        <MessageSquare size={24} />
                    </div>
                    <p className="text-xs font-bold text-neutral-900 mb-1">No Active Chats</p>
                    <p className="text-[10px] text-neutral-400 leading-relaxed">Broadcast messaging and direct agent chat are currently under development.</p>
                </div>
            </div>

            {/* Chat Area - Empty State */}
            <div className="flex-1 flex flex-col bg-neutral-50/20 items-center justify-center p-12 text-center">
                <div className="max-w-md space-y-4">
                    <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-neutral-100 flex items-center justify-center text-neutral-200 mx-auto">
                        <MessageSquare size={40} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-neutral-900">TrueVision Broadcast Center</h2>
                        <p className="text-sm text-neutral-500 mt-2">
                            A powerful communication hub is being built. Soon you&apos;ll be able to send bulk messages to leads and chat directly with your sales team.
                        </p>
                    </div>
                    <div className="pt-4">
                        <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary/5 text-primary text-xs font-bold border border-primary/10">
                            Status: Database Integration Pending
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
