// Mock data for the Nivasa Admin Control Center.
// Designed to be swapped with a Supabase/REST layer later — every export here
// represents a future query.

export type Plan = "Starter" | "Growth" | "Scale" | "Enterprise";
export type PaymentStatus = "paid" | "pending" | "failed";

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
  revenue: number; // MRR contributed
  paymentStatus: PaymentStatus;
  verified: boolean;
  lastActive: string;
  joinedAt: string;
  city: string;
}

const cities = ["Mumbai", "Bengaluru", "Pune", "Hyderabad", "Delhi", "Chennai", "Kolkata", "Ahmedabad"];
const plans: Plan[] = ["Starter", "Growth", "Scale", "Enterprise"];
const firstNames = ["Aarav", "Vivaan", "Aditya", "Ishaan", "Kabir", "Rohan", "Ananya", "Isha", "Diya", "Saanvi", "Meera", "Riya"];
const lastNames = ["Sharma", "Verma", "Iyer", "Nair", "Kapoor", "Mehta", "Shah", "Reddy", "Patel", "Joshi"];

const seed = (i: number) => ((i * 9301 + 49297) % 233280) / 233280;

export const landlords: Landlord[] = Array.from({ length: 28 }).map((_, i) => {
  const r = seed(i + 1);
  const r2 = seed(i + 13);
  const fn = firstNames[Math.floor(r * firstNames.length)];
  const ln = lastNames[Math.floor(r2 * lastNames.length)];
  const plan = plans[Math.floor(r * plans.length)];
  const buildings = Math.floor(r2 * 12) + 1;
  return {
    id: `LD-${1000 + i}`,
    name: `${fn} ${ln}`,
    org: `${ln} Estates`,
    email: `${fn.toLowerCase()}@${ln.toLowerCase()}-estates.in`,
    avatar: `${fn[0]}${ln[0]}`,
    plan,
    buildings,
    tenants: buildings * (Math.floor(r * 30) + 12),
    occupancy: Math.round(60 + r * 38),
    revenue: Math.round((plan === "Enterprise" ? 24000 : plan === "Scale" ? 9000 : plan === "Growth" ? 3500 : 999) * (0.9 + r2 * 0.4)),
    paymentStatus: r > 0.85 ? "failed" : r > 0.7 ? "pending" : "paid",
    verified: r > 0.25,
    lastActive: `${Math.floor(r * 23) + 1}h ago`,
    joinedAt: `${2023 + Math.floor(r2 * 3)}-${String(Math.floor(r * 12) + 1).padStart(2, "0")}-${String(Math.floor(r2 * 28) + 1).padStart(2, "0")}`,
    city: cities[i % cities.length],
  };
});

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

export const buildings: Building[] = Array.from({ length: 18 }).map((_, i) => {
  const r = seed(i + 7);
  const rooms = 20 + Math.floor(r * 80);
  const occupied = Math.floor(rooms * (0.6 + seed(i + 31) * 0.38));
  return {
    id: `BLD-${500 + i}`,
    name: ["Aurora", "Skyline", "Verde", "Lumen", "Cobalt", "Nimbus", "Solace", "Helix", "Orion"][i % 9] + " " + ["Heights", "Towers", "Residency", "Square", "Park", "House"][i % 6],
    landlord: landlords[i % landlords.length].org,
    city: cities[i % cities.length],
    rooms,
    occupied,
    health: r > 0.75 ? "needs-attention" : r > 0.4 ? "good" : "excellent",
    maintenanceOpen: Math.floor(r * 6),
    imageHue: Math.floor(r * 360),
  };
});

export const platformMetrics = {
  activeLandlords: landlords.length,
  totalBuildings: buildings.reduce((a, b) => a + 1, 0) + 142, // total across platform
  totalProperties: 428,
  totalRooms: 9_842,
  totalTenants: 24_318,
  monthlyRevenue: landlords.reduce((a, b) => a + b.revenue, 0),
  activeSubscriptions: landlords.filter((l) => l.paymentStatus !== "failed").length + 84,
  churnRate: 2.4,
  occupancyRate: 87.3,
};

export const revenueSeries = Array.from({ length: 12 }).map((_, i) => {
  const month = new Date(2025, i, 1).toLocaleString("en", { month: "short" });
  const base = 180_000 + i * 22_000;
  return {
    month,
    mrr: Math.round(base + Math.sin(i) * 18_000),
    new: Math.round(28_000 + i * 4200 + Math.cos(i) * 9_000),
    churn: Math.round(8_000 + Math.abs(Math.sin(i * 1.3)) * 6_000),
  };
});

export const landlordGrowth = Array.from({ length: 12 }).map((_, i) => ({
  month: new Date(2025, i, 1).toLocaleString("en", { month: "short" }),
  landlords: Math.round(40 + i * 18 + Math.sin(i) * 6),
  buildings: Math.round(120 + i * 32 + Math.cos(i) * 10),
}));

export const occupancyByCity = cities.map((c, i) => ({
  city: c,
  occupancy: Math.round(70 + seed(i + 4) * 28),
  buildings: Math.round(20 + seed(i + 11) * 60),
}));

export const planDistribution = (["Starter", "Growth", "Scale", "Enterprise"] as Plan[]).map((p) => ({
  plan: p,
  count: landlords.filter((l) => l.plan === p).length,
}));

export interface ActivityEvent {
  id: string;
  type: "signup" | "upgrade" | "payment" | "ticket" | "system";
  title: string;
  meta: string;
  time: string;
}

export const activityFeed: ActivityEvent[] = [
  { id: "a1", type: "signup", title: "Verma Estates joined platform", meta: "Growth plan · Mumbai", time: "2m ago" },
  { id: "a2", type: "payment", title: "₹24,000 received from Iyer Holdings", meta: "Enterprise renewal", time: "11m ago" },
  { id: "a3", type: "upgrade", title: "Mehta Properties upgraded to Scale", meta: "+₹5,500 MRR", time: "32m ago" },
  { id: "a4", type: "ticket", title: "P1 ticket opened by Kapoor Estates", meta: "Tenant import failed", time: "47m ago" },
  { id: "a5", type: "system", title: "AI insights model refreshed", meta: "v2.4.1 · 0 anomalies", time: "1h ago" },
  { id: "a6", type: "signup", title: "Reddy Holdings joined platform", meta: "Starter plan · Hyderabad", time: "2h ago" },
  { id: "a7", type: "payment", title: "Payment failed for Joshi Group", meta: "Card declined · retry queued", time: "3h ago" },
];

export interface SupportTicket {
  id: string;
  subject: string;
  landlord: string;
  priority: "P1" | "P2" | "P3";
  status: "open" | "in-progress" | "resolved";
  agent: string;
  age: string;
}

export const tickets: SupportTicket[] = [
  { id: "T-2041", subject: "Tenant CSV import fails for >500 rows", landlord: "Kapoor Estates", priority: "P1", status: "in-progress", agent: "Aisha", age: "47m" },
  { id: "T-2039", subject: "Cannot generate rent invoice PDF", landlord: "Iyer Holdings", priority: "P2", status: "open", agent: "—", age: "2h" },
  { id: "T-2032", subject: "SSO with Google Workspace request", landlord: "Sharma Group", priority: "P3", status: "open", agent: "—", age: "5h" },
  { id: "T-2028", subject: "Building deletion not propagating", landlord: "Reddy Holdings", priority: "P2", status: "resolved", agent: "Vikram", age: "1d" },
  { id: "T-2014", subject: "Occupancy chart shows wrong totals", landlord: "Mehta Properties", priority: "P1", status: "resolved", agent: "Aisha", age: "2d" },
];

export const aiInsights = [
  { id: 1, severity: "alert", title: "Churn risk detected", body: "3 Growth-plan landlords show 40%+ usage drop in the last 14 days. Recommend proactive outreach." },
  { id: 2, severity: "opportunity", title: "Upsell candidates", body: "8 Scale customers are at 92% of plan limits — Enterprise upgrade could yield ₹1.7L MRR." },
  { id: 3, severity: "info", title: "Occupancy trend", body: "Bengaluru and Pune lead occupancy growth at +6.2% MoM. Mumbai flat." },
  { id: 4, severity: "alert", title: "Anomaly: payment retries", body: "Failed payments spiked 3.2× yesterday — investigating with Razorpay." },
];

export const systemStatus = [
  { name: "API Gateway", status: "operational", latency: 84 },
  { name: "Database", status: "operational", latency: 12 },
  { name: "Realtime", status: "operational", latency: 41 },
  { name: "AI Pipeline", status: "degraded", latency: 312 },
  { name: "Payments", status: "operational", latency: 156 },
];

export const tiers: { name: Plan; price: number; features: string[]; highlight?: boolean }[] = [
  { name: "Starter", price: 999, features: ["Up to 2 buildings", "50 tenants", "Email support", "Basic analytics"] },
  { name: "Growth", price: 3500, features: ["Up to 8 buildings", "300 tenants", "Priority support", "Advanced analytics"] },
  { name: "Scale", price: 9000, features: ["Up to 25 buildings", "1500 tenants", "Dedicated CSM", "AI insights"], highlight: true },
  { name: "Enterprise", price: 24000, features: ["Unlimited", "SSO + audit logs", "24/7 support", "Custom integrations"] },
];
