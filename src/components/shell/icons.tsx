"use client";

import {
  LayoutDashboard,
  Building2,
  Route,
  PoundSterling,
  ShieldCheck,
  Users,
  GaugeCircle,
  ScrollText,
  Flag,
  Settings,
  type LucideIcon,
} from "lucide-react";
import type { IconKey } from "@/lib/nav";

export const NAV_ICONS: Record<IconKey, LucideIcon> = {
  dashboard: LayoutDashboard,
  building: Building2,
  route: Route,
  pound: PoundSterling,
  shield: ShieldCheck,
  users: Users,
  gauge: GaugeCircle,
  scroll: ScrollText,
  flag: Flag,
  settings: Settings,
};
