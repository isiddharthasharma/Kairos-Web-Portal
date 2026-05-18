import { redirect } from "next/navigation";

// Kairos is a staff-only monitoring console — no public landing.
// Root always routes to the sign-in screen.
export default function RootPage() {
  redirect("/login");
}
