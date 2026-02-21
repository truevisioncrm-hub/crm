"use client";

import { useState } from "react";
import { Eye, EyeOff, Building2, UserCircle, Lock } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
    const { login } = useAuth();
    const [role, setRole] = useState<'admin' | 'agent'>('admin');
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await login(email, password);
            if (!res.success) {
                setError(res.error || "Invalid credentials");
                setIsLoading(false);
            }
            // Redirect is handled in auth provider on success
        } catch (err) {
            setError("Something went wrong");
            setIsLoading(false);
        }
    };

    const handleDemoLogin = (demoRole: 'admin' | 'agent') => {
        setRole(demoRole);
        setError("");
        if (demoRole === 'admin') {
            setEmail('admin@truevision.com');
            setPassword('admin123');
        } else {
            setEmail('agent@truevision.com');
            setPassword('agent123');
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-neutral-50 animate-fade-in">

            {/* Left: Branding & Visuals */}
            <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-primary text-white">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/80 to-primary/80" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                            <Building2 className="text-primary" size={20} />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">TrueVision<span className="text-white/60">CRM</span></span>
                    </div>
                </div>

                <div className="relative z-10 max-w-lg">
                    <h1 className="text-5xl font-bold leading-tight mb-6">Manage Your Real Estate Empire.</h1>
                    <p className="text-lg text-white/80 leading-relaxed">
                        Experience the premium dashboard designed for modern real estate professionals. Track leads, manage properties, and close deals faster.
                    </p>
                </div>

                <div className="relative z-10 flex gap-4 text-xs font-medium text-white/60">
                    <span>© 2026 TrueVision Inc.</span>
                    <span>Privacy Policy</span>
                    <span>Terms of Service</span>
                </div>
            </div>

            {/* Right: Login Form */}
            <div className="flex flex-col justify-center items-center p-6 lg:p-24">
                <div className="w-full max-w-md space-y-8">

                    <div className="text-center lg:text-left">
                        <div className="lg:hidden flex justify-center mb-6">
                            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                                <Building2 className="text-white" size={24} />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-neutral-900">Welcome Back</h2>
                        <p className="text-neutral-500 mt-2">Please sign in to your account</p>
                    </div>

                    {/* Role Switcher */}
                    <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100 rounded-2xl">
                        <button
                            onClick={() => setRole('admin')}
                            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${role === 'admin'
                                    ? 'bg-white text-primary shadow-sm card-shadow'
                                    : 'text-neutral-500 hover:text-neutral-700'
                                }`}
                        >
                            <Building2 size={16} /> Admin
                        </button>
                        <button
                            onClick={() => setRole('agent')}
                            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${role === 'agent'
                                    ? 'bg-white text-primary shadow-sm card-shadow'
                                    : 'text-neutral-500 hover:text-neutral-700'
                                }`}
                        >
                            <UserCircle size={16} /> Agent
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl font-medium text-center animate-fade-in">
                                {error}
                            </div>
                        )}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none placeholder:text-neutral-400"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Password</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none placeholder:text-neutral-400"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-[38px] text-neutral-400 hover:text-neutral-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-primary focus:ring-primary" />
                                <span className="text-neutral-600 font-medium">Remember me</span>
                            </label>
                            <a href="#" className="text-primary font-bold hover:underline">Forgot password?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Lock size={16} /> Sign In
                                </>
                            )}
                        </button>
                    </form>

                    {/* Quick Demo Login */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-neutral-200"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-neutral-50 px-2 text-neutral-400 font-bold tracking-wider">Quick Demo Access</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => handleDemoLogin('admin')}
                            className="py-3 px-4 bg-white border border-neutral-200 rounded-xl text-xs font-bold text-neutral-600 hover:border-primary hover:text-primary transition-all shadow-sm hover:shadow-md"
                        >
                            Affiliate Admin
                        </button>
                        <button
                            type="button"
                            onClick={() => handleDemoLogin('agent')}
                            className="py-3 px-4 bg-white border border-neutral-200 rounded-xl text-xs font-bold text-neutral-600 hover:border-primary hover:text-primary transition-all shadow-sm hover:shadow-md"
                        >
                            Sample Agent
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
