import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AgentLayoutClient from "./AgentLayoutClient";

export default async function AgentLayout({ children }: { children: React.ReactNode }) {
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

    if (profile?.role !== "agent") {
        if (profile?.role === "admin") {
            redirect("/admin/dashboard");
        } else {
            redirect("/login");
        }
    }

    return <AgentLayoutClient>{children}</AgentLayoutClient>;
}
