/**
 * supabase-data.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Every function here is a drop-in replacement for a mock-data export.
 * Import these in your routes instead of importing from "mock-data".
 *
 * The shapes returned intentionally match the Landlord / Building / etc.
 * interfaces in mock-data.ts so you don't have to change component code —
 * just swap the import source.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "./supabase";
import type {
  Landlord,
  Building,
  ActivityEvent,
  SupportTicket,
  PlatformMetrics,
  RevenueSeries,
  LandlordGrowth,
  OccupancyByCity,
  PlanDistribution,
} from "./mock-data";

// ─── LANDLORDS ────────────────────────────────────────────────────────────────

export function useLandlords() {
  return useQuery<Landlord[]>({
    queryKey: ["landlords"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("landlords")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Map DB row → Landlord shape expected by the UI
      return (data ?? []).map(rowToLandlord);
    },
    staleTime: 30_000,
  });
}

export function useLandlord(id: string) {
  return useQuery<Landlord | null>({
    queryKey: ["landlords", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("landlords")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data ? rowToLandlord(data) : null;
    },
    enabled: Boolean(id),
  });
}

// ─── BUILDINGS ────────────────────────────────────────────────────────────────

export function useBuildings() {
  return useQuery<Building[]>({
    queryKey: ["buildings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties") // uses your existing 'properties' table
        .select(
          `
          id,
          title,
          city,
          address,
          total_rooms,
          available_rooms,
          property_type,
          price,
          owner_id,
          landlords ( org_name )
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data ?? []).map(rowToBuilding);
    },
    staleTime: 30_000,
  });
}

// ─── PLATFORM METRICS ────────────────────────────────────────────────────────

export function usePlatformMetrics() {
  return useQuery<PlatformMetrics>({
    queryKey: ["platform-metrics"],
    queryFn: async () => {
      const [
        { count: landlordCount },
        { count: propertyCount },
        { data: revData },
      ] = await Promise.all([
        supabase
          .from("landlords")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("properties")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("landlords")
          .select("subscription_plan, payment_status, total_rooms, total_tenants"),
      ]);

      const landlords = revData ?? [];
      const totalRooms = landlords.reduce(
        (s: number, l: Record<string, number>) => s + (l.total_rooms ?? 0),
        0
      );
      const totalTenants = landlords.reduce(
        (s: number, l: Record<string, number>) => s + (l.total_tenants ?? 0),
        0
      );
      const planRevMap: Record<string, number> = {
        Starter: 999,
        Growth: 3500,
        Scale: 9000,
        Enterprise: 24000,
      };
      const monthlyRevenue = landlords.reduce(
        (s: number, l: Record<string, string>) =>
          s + (planRevMap[l.subscription_plan] ?? 0),
        0
      );
      const activeSubscriptions = landlords.filter(
        (l: Record<string, string>) => l.payment_status !== "failed"
      ).length;

      return {
        activeLandlords: landlordCount ?? 0,
        totalBuildings: propertyCount ?? 0,
        totalProperties: propertyCount ?? 0,
        totalRooms,
        totalTenants,
        monthlyRevenue,
        activeSubscriptions,
        churnRate: 0,
        occupancyRate: 0,
      };
    },
    staleTime: 60_000,
  });
}

// ─── ACTIVITY FEED ───────────────────────────────────────────────────────────

export function useActivityFeed() {
  return useQuery<ActivityEvent[]>({
    queryKey: ["activity-feed"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activity_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;

      return (data ?? []).map(
        (row: Record<string, string>, idx: number): ActivityEvent => ({
          id: row.id ?? `a${idx}`,
          type: (row.event_type as ActivityEvent["type"]) ?? "system",
          title: row.title ?? "",
          meta: row.meta ?? "",
          time: timeAgo(new Date(row.created_at)),
        })
      );
    },
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}

// ─── SUPPORT TICKETS ─────────────────────────────────────────────────────────

export function useSupportTickets() {
  return useQuery<SupportTicket[]>({
    queryKey: ["support-tickets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("support_tickets")
        .select(
          `
          id,
          subject,
          priority,
          status,
          agent,
          created_at,
          landlords ( org_name )
        `
        )
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;

      return (data ?? []).map(
        (row: Record<string, string & { org_name?: string }>): SupportTicket => ({
          id: row.id,
          subject: row.subject,
          landlord:
            (row.landlords as unknown as { org_name: string })?.org_name ??
            "—",
          priority: (row.priority as SupportTicket["priority"]) ?? "P3",
          status: (row.status as SupportTicket["status"]) ?? "open",
          agent: row.agent ?? "—",
          age: timeAgo(new Date(row.created_at)),
        })
      );
    },
    staleTime: 30_000,
  });
}

// ─── ANALYTICS SERIES (computed server-side via aggregate view or fallback) ───

export function useRevenueSeries() {
  return useQuery<RevenueSeries[]>({
    queryKey: ["revenue-series"],
    queryFn: async () => {
      // Try a Supabase view first; gracefully fall back to empty
      const { data, error } = await supabase
        .from("revenue_series_monthly")
        .select("*")
        .order("month_date", { ascending: true })
        .limit(12);

      if (error || !data?.length) return fallbackRevenueSeries();

      return data.map(
        (row: Record<string, string | number>): RevenueSeries => ({
          month: new Date(row.month_date as string).toLocaleString("en", {
            month: "short",
          }),
          mrr: Number(row.mrr ?? 0),
          new: Number(row.new_revenue ?? 0),
          churn: Number(row.churn ?? 0),
        })
      );
    },
    staleTime: 300_000,
  });
}

export function useLandlordGrowth() {
  return useQuery<LandlordGrowth[]>({
    queryKey: ["landlord-growth"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("landlord_growth_monthly")
        .select("*")
        .order("month_date", { ascending: true })
        .limit(12);

      if (error || !data?.length) return fallbackLandlordGrowth();

      return data.map(
        (row: Record<string, string | number>): LandlordGrowth => ({
          month: new Date(row.month_date as string).toLocaleString("en", {
            month: "short",
          }),
          landlords: Number(row.landlords ?? 0),
          buildings: Number(row.buildings ?? 0),
        })
      );
    },
    staleTime: 300_000,
  });
}

export function useOccupancyByCity() {
  return useQuery<OccupancyByCity[]>({
    queryKey: ["occupancy-by-city"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("occupancy_by_city")
        .select("*");

      if (error || !data?.length) return [];

      return data.map(
        (row: Record<string, string | number>): OccupancyByCity => ({
          city: String(row.city),
          occupancy: Number(row.occupancy_pct ?? 0),
          buildings: Number(row.building_count ?? 0),
        })
      );
    },
    staleTime: 300_000,
  });
}

export function usePlanDistribution() {
  return useQuery<PlanDistribution[]>({
    queryKey: ["plan-distribution"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("plan_distribution");

      if (error || !data?.length) {
        // fallback: count from landlords table
        const { data: rows } = await supabase
          .from("landlords")
          .select("subscription_plan");
        const counts: Record<string, number> = {};
        (rows ?? []).forEach((r: Record<string, string>) => {
          counts[r.subscription_plan] =
            (counts[r.subscription_plan] ?? 0) + 1;
        });
        return (["Starter", "Growth", "Scale", "Enterprise"] as const).map(
          (p) => ({ plan: p, count: counts[p] ?? 0 })
        );
      }

      return data;
    },
    staleTime: 60_000,
  });
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

type DbLandlordRow = Record<string, unknown>;

function rowToLandlord(row: DbLandlordRow): Landlord {
  const name = String(row.full_name ?? row.name ?? "");
  const org = String(row.org_name ?? row.org ?? `${name} Estates`);
  const nameParts = name.split(" ");
  const avatar =
    nameParts.length >= 2
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      : name.slice(0, 2).toUpperCase();

  const plan = (row.subscription_plan ?? row.plan ?? "Starter") as Landlord["plan"];
  const planRevMap: Record<string, number> = {
    Starter: 999,
    Growth: 3500,
    Scale: 9000,
    Enterprise: 24000,
  };

  return {
    id: String(row.id),
    name,
    org,
    email: String(row.email ?? ""),
    avatar,
    plan,
    buildings: Number(row.total_buildings ?? row.buildings ?? 0),
    tenants: Number(row.total_tenants ?? row.tenants ?? 0),
    occupancy: Number(row.occupancy_rate ?? row.occupancy ?? 0),
    revenue: Number(row.mrr ?? planRevMap[plan] ?? 999),
    paymentStatus: (row.payment_status ?? "pending") as Landlord["paymentStatus"],
    verified: Boolean(row.is_verified ?? row.verified ?? false),
    lastActive: row.last_active_at
      ? timeAgo(new Date(String(row.last_active_at)))
      : "—",
    joinedAt: String(
      row.created_at
        ? new Date(String(row.created_at)).toISOString().slice(0, 10)
        : row.joined_at ?? ""
    ),
    city: String(row.city ?? ""),
  };
}

type DbPropertyRow = Record<string, unknown>;

function rowToBuilding(row: DbPropertyRow): Building {
  const rooms = Number(row.total_rooms ?? 10);
  const occupied = rooms - Number(row.available_rooms ?? 0);
  const occPct = rooms > 0 ? Math.round((occupied / rooms) * 100) : 0;
  return {
    id: String(row.id),
    name: String(row.title ?? "Unnamed Property"),
    landlord: String(
      (row.landlords as { org_name?: string })?.org_name ?? "—"
    ),
    city: String(row.city ?? ""),
    rooms,
    occupied,
    health:
      occPct >= 85
        ? "excellent"
        : occPct >= 60
          ? "good"
          : "needs-attention",
    maintenanceOpen: 0, // extend if you have a maintenance table
    imageHue: Math.abs(String(row.id).charCodeAt(0) * 37) % 360,
  };
}

function timeAgo(date: Date): string {
  const seconds = Math.round((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

// ─── FALLBACK STUBS (used until analytics views exist) ───────────────────────

function fallbackRevenueSeries(): RevenueSeries[] {
  return Array.from({ length: 12 }).map((_, i) => ({
    month: new Date(2025, i, 1).toLocaleString("en", { month: "short" }),
    mrr: 0,
    new: 0,
    churn: 0,
  }));
}

function fallbackLandlordGrowth(): LandlordGrowth[] {
  return Array.from({ length: 12 }).map((_, i) => ({
    month: new Date(2025, i, 1).toLocaleString("en", { month: "short" }),
    landlords: 0,
    buildings: 0,
  }));
}
