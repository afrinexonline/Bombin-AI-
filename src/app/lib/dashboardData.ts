import { TrendingUp, Users, MessageSquare, type LucideIcon } from "lucide-react";
import NairaIcon from "../components/NairaIcon";

/* ═══════════════════════════════════════════════════
   BOMBIN AI — Real dashboard data (placeholder)

   Real users must never see fake numbers. Until real data
   is wired in (milestone M3), everything here is empty and
   the UI shows honest "No data yet" states.

   M3: replace these empty values with data loaded from
   Supabase for the signed-in merchant. The shapes below are
   what the existing cards, lists and charts already expect.
   ═══════════════════════════════════════════════════ */

export type StatCard = {
  label: string;
  /** Formatted value, e.g. "₦1,250,000". null = no data yet. */
  value: string | null;
  /** Short change note, e.g. "+12% this week". null = hide. */
  change: string | null;
  icon: LucideIcon | typeof NairaIcon;
};

export const statCards: StatCard[] = [
  { label: "Revenue Influenced", value: null, change: null, icon: NairaIcon },
  { label: "Active Deals", value: null, change: null, icon: TrendingUp },
  { label: "Contacts Reached", value: null, change: null, icon: Users },
  { label: "AI Responses", value: null, change: null, icon: MessageSquare },
];

export type Deal = {
  name: string;
  company: string;
  stage: string;
  /** 0–100 */
  progress: number;
  sentiment: string;
  /** Amount in Naira (whole number). */
  amount: number;
  /** Formatted amount, e.g. "₦2,400,000". */
  value: string;
  lastActive: string;
};

export const deals: Deal[] = [];

/** sales = Naira amount, deals = number of deals, for one time bucket. */
export type ChartPoint = { name: string; sales: number; deals: number };
export const weeklySales: ChartPoint[] = [];
export const monthlySales: ChartPoint[] = [];
export const yearlySales: ChartPoint[] = [];

export type CategorySlice = { name: string; value: number; color: string };
export const closingCategories: CategorySlice[] = [];

export type Product = {
  name: string;
  category: string;
  /** Formatted price, e.g. "₦50,000". */
  price: string;
};
export const products: Product[] = [];

/** Summary numbers on the Analytics page. null = no data yet. */
export const analyticsSummary: { label: string; value: string | null; change: string | null }[] = [
  { label: "Conversion Rate", value: null, change: null },
  { label: "Avg. Deal Size", value: null, change: null },
  { label: "Win Rate", value: null, change: null },
  { label: "Avg. Close Time", value: null, change: null },
];

export const formatNaira = (n: number) => `₦${n.toLocaleString("en-NG")}`;
