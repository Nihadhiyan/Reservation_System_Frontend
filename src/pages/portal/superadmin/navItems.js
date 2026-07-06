import { LayoutDashboard, Building2, Users } from "lucide-react";

export const superAdminNavItems = [
  { to: "/portal/superadmin", label: "Overview", icon: LayoutDashboard },
  { to: "/portal/superadmin/tenants", label: "Tenants", icon: Building2 },
  { to: "/portal/superadmin/users", label: "Users", icon: Users },
];
