import { LayoutDashboard, Map, Building } from "lucide-react";

export const ownerNavItems = [
  { to: "/portal/owner", label: "Overview", icon: LayoutDashboard },
  { to: "/portal/owner/venues", label: "Venues", icon: Building },
  { to: "/portal/owner/blueprint", label: "Blueprint Editor", icon: Map },
];
