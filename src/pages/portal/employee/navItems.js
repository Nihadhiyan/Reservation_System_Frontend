import { QrCode, ClipboardCheck } from "lucide-react";

export const employeeNavItems = [
  { to: "/portal/employee", label: "Scan", icon: QrCode },
  { to: "/portal/employee/checkins", label: "Check-ins", icon: ClipboardCheck },
];
