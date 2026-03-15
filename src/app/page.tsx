import { redirect } from "next/navigation";

export default function Home() {
  // Let the client explicitly hit /login or the Proxy handle it. 
  // Root index redirects aggressively cache in Next.js 15+ causing 307 death loops.
  redirect("/login");
}
