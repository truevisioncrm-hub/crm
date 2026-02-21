"use client";

import { Search, Send, MoreVertical, Phone, Video, Paperclip } from "lucide-react";
import { useState } from "react";

const CONTACTS = [
    { id: 1, name: "Ahmed Khan", msg: "When can we schedule the visit?", time: "2m", unread: 2, online: true },
    { id: 2, name: "Sara Mirza", msg: "I'll discuss with my husband and...", time: "1h", unread: 0, online: false },
    { id: 3, name: "Ravi Patel", msg: "Is the price negotiable?", time: "3h", unread: 0, online: true },
    { id: 4, name: "Agent Rahul", msg: "Lead update for Sobha City", time: "5h", unread: 1, online: true },
    { id: 5, name: "Priya K.", msg: "Thanks for the information.", time: "1d", unread: 0, online: false },
];

const MESSAGES = [
    { id: 1, sender: "me", text: "Hello Ahmed, thanks for your interest in Prestige Lakeside Villa.", time: "10:30 AM" },
    { id: 2, sender: "them", text: "Yes, I saw the photos. It looks great!", time: "10:32 AM" },
    { id: 3, sender: "me", text: "Would you like to schedule a site visit this weekend?", time: "10:33 AM" },
    { id: 4, sender: "them", text: "Saturday morning works for me.", time: "10:35 AM" },
    { id: 5, sender: "them", text: "When can we schedule the visit?", time: "10:36 AM" },
];

export default function MessagingPage() {
    const [activeContact, setActiveContact] = useState(CONTACTS[0]);

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
                            className="w-full pl-9 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {CONTACTS.map((contact) => (
                        <div
                            key={contact.id}
                            onClick={() => setActiveContact(contact)}
                            className={`p-4 flex gap-3 hover:bg-neutral-50 cursor-pointer transition-colors border-b border-neutral-100 last:border-0 ${activeContact.id === contact.id ? 'bg-primary/5 hover:bg-primary/5' : ''}`}
                        >
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-sm font-bold text-neutral-600">
                                    {contact.name.charAt(0)}
                                </div>
                                {contact.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h3 className={`text-sm font-bold truncate ${activeContact.id === contact.id ? 'text-primary' : 'text-neutral-900'}`}>{contact.name}</h3>
                                    <span className="text-[10px] text-neutral-400">{contact.time}</span>
                                </div>
                                <p className="text-xs text-neutral-500 truncate mt-0.5">{contact.msg}</p>
                            </div>
                            {contact.unread > 0 && (
                                <div className="flex flex-col justify-center">
                                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                                        {contact.unread}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white">
                {/* Chat Header */}
                <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-sm font-bold text-neutral-600">
                            {activeContact.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-bold text-neutral-900">{activeContact.name}</h3>
                            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Online
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 rounded-xl hover:bg-neutral-50 text-neutral-400 hover:text-primary transition-colors"><Phone size={20} /></button>
                        <button className="p-2 rounded-xl hover:bg-neutral-50 text-neutral-400 hover:text-primary transition-colors"><Video size={20} /></button>
                        <button className="p-2 rounded-xl hover:bg-neutral-50 text-neutral-400 hover:text-neutral-900 transition-colors"><MoreVertical size={20} /></button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-neutral-50/30">
                    <div className="text-center">
                        <span className="text-xs font-medium text-neutral-400 bg-neutral-100 px-3 py-1 rounded-full">Today</span>
                    </div>
                    {MESSAGES.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] rounded-2xl p-4 shadow-sm ${msg.sender === 'me'
                                    ? 'bg-primary text-white rounded-br-none'
                                    : 'bg-white border border-neutral-100 text-neutral-800 rounded-bl-none'
                                }`}>
                                <p className="text-sm">{msg.text}</p>
                                <p className={`text-[10px] mt-1 text-right ${msg.sender === 'me' ? 'text-primary-light/70' : 'text-neutral-400'}`}>
                                    {msg.time}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-neutral-200">
                    <div className="flex items-center gap-3 p-2 bg-neutral-50 rounded-2xl border border-neutral-200 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                        <button className="p-2 rounded-xl text-neutral-400 hover:text-neutral-600 hover:bg-neutral-200/50 transition-colors">
                            <Paperclip size={20} />
                        </button>
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="flex-1 bg-transparent border-none focus:outline-none text-sm text-neutral-900 placeholder:text-neutral-400 !shadow-none !ring-0"
                            style={{ background: 'transparent !important', boxShadow: 'none !important', border: 'none !important' }}
                        />
                        <button className="p-2 rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors shadow-md shadow-primary/20">
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
