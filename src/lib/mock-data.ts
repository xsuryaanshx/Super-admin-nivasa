/**
 * mock-data.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * TYPE DEFINITIONS ONLY — no more hard-coded fake data.
 * All runtime data now comes from Supabase via src/lib/supabase-data.ts.
 *
 * The static constants (tiers, systemStatus, aiInsights) that are genuinely
 * config-level (not per-landlord data) are kept here.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── ENUMS / UNION TYPES ─────────────────────────────────────────────────────

export type Plan = "Starter" | "Growth" | "Scale" | "Enterprise";
export type PaymentStatus = "paid" | "pending" | "failed";

// ─── ENTITY INTERFACES ───────────────────────────────────────────────────────

export interface Landlord {
  id: string;
  name: string;
  org: string;
  email: string;
  avatar: string;
  plan: Plan;
  buildings: number;
  tenants: number;
  occupancy: number;
  revenue: number;
  paymentStatus: PaymentStatus;
  verified: boolean;
  lastActive: string;
  joinedAt: string;
  city: string;
}

export interface Building {
  id: string;
  name: string;
  landlord: string;
  city: string;
  rooms: number;
  occupied: number;
  health: "excellent" | "good" | "needs-attention";
  maintenanceOpen: number;
  imageHue: number;
}

export interface ActivityEvent {
  id: string;
  type: "signup" | "upgrade" | "payment" | "ticket" | "system";
  title: string;
  meta: string;
  time: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  landlord: string;
  priority: "P1" | "P2" | "P3";
  status: "open" | "in-progress" | "resolved";
  agent: string;
  age: string;
}

export interface PlatformMetrics {
  activeLandlords: number;
  totalBuildings: number;
  totalProperties: number;
  totalRooms: number;
  totalTenants: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
  churnRate: number;
  occupancyRate: number;
}

export interface RevenueSeries {
  month: string;
  mrr: number;
  new: number;
  churn: number;
}

export interface LandlordGrowth {
  month: string;
  landlords: number;
  buildings: number;
}

export interface OccupancyByCity {
  city: string;
  occupancy: number;
  buildings: number;
}

export interface PlanDistribution {
  plan: Plan;
  count: number;
}

// ─── STATIC CONFIG DATA (not per-user, fine to keep here) ────────────────────

export const aiInsights = [
  {
    id: 1,
    severity: "alert",
    title: "Churn risk detected",
    body: "Landlords with 40%+ usage drop in the last 14 days. Recommend proactive outreach.",
  },
  {
    id: 2,
    severity: "opportunity",
    title: "Upsell candidates",
    body: "Scale customers at 92% of plan limits — Enterprise upgrade could lift MRR significantly.",
  },
  {
    id: 3,
    severity: "info",
    title: "Occupancy trend",
    body: "Tier 1 cities leading occupancy growth MoM.",
  },
  {
    id: 4,
    severity: "alert",
    title: "Anomaly: payment retries",
    body: "Failed payments spiked — check with payment gateway.",
  },
];

export const systemStatus = [
  { name: "API Gateway", status: "operational", latency: 84 },
  { name: "Database", status: "operational", latency: 12 },
  { name: "Realtime", status: "operational", latency: 41 },
  { name: "AI Pipeline", status: "degraded", latency: 312 },
  { name: "Payments", status: "operational", latency: 156 },
];

export const tiers: {
  name: Plan;
  price: number;
  features: string[];
  highlight?: boolean;
}[] = [
  {
    name: "Starter",
    price: 999,
    features: [
      "Up to 2 buildings",
      "50 tenants",
      "Email support",
      "Basic analytics",
    ],
  },
  {
    name: "Growth",
    price: 3500,
    features: [
      "Up to 8 buildings",
      "300 tenants",
      "Priority support",
      "Advanced analytics",
    ],
  },
  {
    name: "Scale",
    price: 9000,
    features: [
      "Up to 25 buildings",
      "1500 tenants",
      "Dedicated CSM",
      "AI insights",
    ],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: 24000,
    features: [
      "Unlimited",
      "SSO + audit logs",
      "24/7 support",
      "Custom integrations",
    ],
  },
];
