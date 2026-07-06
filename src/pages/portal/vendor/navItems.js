import { LayoutDashboard, Store, ClipboardList } from "lucide-react";

export const vendorNavItems = [
  { to: "/portal/vendor", label: "Overview", icon: LayoutDashboard },
  { to: "/portal/vendor/discover", label: "Discover Stalls", icon: Store },
  { to: "/portal/vendor/reservations", label: "My Reservations", icon: ClipboardList },
];
