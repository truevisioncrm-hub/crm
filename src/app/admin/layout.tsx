import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AdminLayoutClient from "./AdminLayoutClient";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

    if (profile?.role !== "admin") {
        if (profile?.role === "agent") {
            redirect("/agent/dashboard");
        } else {
            redirect("/login");
        }
    }

    return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
