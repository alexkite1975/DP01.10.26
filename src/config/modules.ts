export interface DashboardModule {
  id: string;
  name: string;
  description: string;
  path: string;
  icon: string;
  role: "driver" | "haulier" | "admin";
  category: string;
}

export const FLEETOPS_MODULE_REGISTRY: DashboardModule[] = [
  // --- DRIVER IN-CAB MODULES ---
  {
    id: "driver-jobs",
    name: "Live Dispatch & Tours",
    description: "Active loads, route navigation, and Amazon tours",
    path: "/driver",
    icon: "Truck",
    role: "driver",
    category: "Operations"
  },
  {
    id: "driver-walkaround",
    name: "AI Vehicle Inspection",
    description: "Pre-trip DVSA walkaround check with AI defect vision",
    path: "/driver?tab=walkaround",
    icon: "ShieldAlert",
    role: "driver",
    category: "Safety & Compliance"
  },
  {
    id: "driver-tacho",
    name: "Tachograph AI & .DDD",
    description: "OCR printout scanner & driver card file analyzer",
    path: "/driver?tab=tacho",
    icon: "FileText",
    role: "driver",
    category: "Safety & Compliance"
  },
  {
    id: "driver-bridge-shield",
    name: "Bridge & Safety Shield",
    description: "Real-time height clearance & low-bridge warning HUD",
    path: "/driver?tab=bridgeshield",
    icon: "AlertTriangle",
    role: "driver",
    category: "Safety & Compliance"
  },

  // --- HAULIER COMMAND CENTRE MODULES ---
  {
    id: "haulier-fleet",
    name: "Fleet & Asset Tracker",
    description: "Real-time telematics, vehicle status & live GPS tracking",
    path: "/haulier",
    icon: "Activity",
    role: "haulier",
    category: "Fleet Management"
  },
  {
    id: "haulier-dispatch",
    name: "Dispatch Control Room",
    description: "Automated routing, shift allocations & manual override",
    path: "/haulier?tab=dispatch",
    icon: "Send",
    role: "haulier",
    category: "Dispatch"
  },
  {
    id: "haulier-compliance",
    name: "DVSA ERS & London DVS",
    description: "Earned recognition, London Direct Vision Standard, VOR grounding",
    path: "/haulier?tab=compliance",
    icon: "CheckCircle2",
    role: "haulier",
    category: "Compliance"
  },
  {
    id: "haulier-payroll",
    name: "Self-Billing & Payroll",
    description: "Automated driver pay sheets, invoice generation & P&L",
    path: "/haulier?tab=finance",
    icon: "DollarSign",
    role: "haulier",
    category: "Finance"
  },

  // --- SITE ADMIN MODULES ---
  {
    id: "admin-users",
    name: "Identity & RBAC Access",
    description: "Manage driver accounts, haulier permissions & impersonation",
    path: "/admin",
    icon: "Users",
    role: "admin",
    category: "Administration"
  },
  {
    id: "admin-system",
    name: "System Control Plane",
    description: "Cloud Run telemetry, API rates, database migrations & cache",
    path: "/admin?tab=system",
    icon: "Settings",
    role: "admin",
    category: "Administration"
  }
];

export const getModulesForRole = (role: "driver" | "haulier" | "admin") =>
  FLEETOPS_MODULE_REGISTRY.filter((m) => m.role === role);
