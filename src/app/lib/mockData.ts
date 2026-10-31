import { DollarSign, TrendingUp, Users, MessageSquare } from "lucide-react";

/* ═══════════════════════════════════════════════════
   BOMBIN AI — Mock Data Layer
   Realistic demo data for dashboard metrics
   ═══════════════════════════════════════════════════ */

// ── Revenue / Stat Cards ──────────────────────────

export const revenueStats = [
  {
    label: "Revenue Influenced",
    value: "₦15,770,460",
    change: "+31.2%",
    icon: DollarSign,
    trend: [42, 55, 48, 62, 71, 68, 85, 92, 88, 105, 112, 128],
  },
  {
    label: "Active Deals",
    value: "47",
    change: "+8 today",
    icon: TrendingUp,
    trend: [12, 15, 18, 22, 25, 28, 31, 35, 38, 40, 44, 47],
  },
  {
    label: "Contacts Reached",
    value: "3,291",
    change: "+342 this week",
    icon: Users,
    trend: [800, 1100, 1400, 1650, 1920, 2180, 2400, 2680, 2850, 3010, 3150, 3291],
  },
  {
    label: "AI Responses",
    value: "1,083",
    change: "97.6% quality",
    icon: MessageSquare,
    trend: [120, 180, 250, 340, 420, 510, 620, 740, 830, 920, 1010, 1083],
  },
];

// ── Deal Momentum Data ────────────────────────────

export const dealMomentum = [
  {
    name: "Sarah Johnson",
    company: "TechVenture Co.",
    stage: "Proposal Sent",
    progress: 75,
    sentiment: "🔥",
    value: "$12,400",
    lastActive: "2 min ago",
  },
  {
    name: "Marcus Chen",
    company: "DataFlow Inc.",
    stage: "Negotiation",
    progress: 60,
    sentiment: "💬",
    value: "$8,900",
    lastActive: "15 min ago",
  },
  {
    name: "Amara Osei",
    company: "GrowthStack",
    stage: "Discovery Call",
    progress: 35,
    sentiment: "🔥",
    value: "$22,000",
    lastActive: "1 hr ago",
  },
  {
    name: "James Whitfield",
    company: "Apex Solutions",
    stage: "Follow-up",
    progress: 45,
    sentiment: "❄️",
    value: "$6,200",
    lastActive: "3 hrs ago",
  },
  {
    name: "Priya Sharma",
    company: "NexGen Labs",
    stage: "Closing",
    progress: 90,
    sentiment: "🔥",
    value: "$34,500",
    lastActive: "Just now",
  },
  {
    name: "David Kim",
    company: "Bright AI",
    stage: "Interest Shown",
    progress: 20,
    sentiment: "💬",
    value: "$5,000",
    lastActive: "30 min ago",
  },
  {
    name: "Elena Rodriguez",
    company: "Scala Digital",
    stage: "Demo Scheduled",
    progress: 55,
    sentiment: "🔥",
    value: "$18,700",
    lastActive: "45 min ago",
  },
  {
    name: "Omar Hassan",
    company: "FinLedger",
    stage: "Proposal Review",
    progress: 70,
    sentiment: "💬",
    value: "$41,200",
    lastActive: "10 min ago",
  },
];

// ── Sales Performance Chart Data ──────────────────

export const salesChartData = {
  weekly: [
    { name: "Mon", sales: 4200, deals: 5 },
    { name: "Tue", sales: 3800, deals: 3 },
    { name: "Wed", sales: 6100, deals: 7 },
    { name: "Thu", sales: 5400, deals: 6 },
    { name: "Fri", sales: 7800, deals: 9 },
    { name: "Sat", sales: 3200, deals: 2 },
    { name: "Sun", sales: 2100, deals: 1 },
  ],
  monthly: [
    { name: "Wk 1", sales: 18400, deals: 12 },
    { name: "Wk 2", sales: 24200, deals: 17 },
    { name: "Wk 3", sales: 19800, deals: 14 },
    { name: "Wk 4", sales: 28600, deals: 22 },
  ],
  yearly: [
    { name: "Jan", sales: 42000, deals: 34 },
    { name: "Feb", sales: 38000, deals: 28 },
    { name: "Mar", sales: 51000, deals: 42 },
    { name: "Apr", sales: 48000, deals: 38 },
    { name: "May", sales: 55000, deals: 45 },
    { name: "Jun", sales: 62000, deals: 52 },
    { name: "Jul", sales: 58000, deals: 47 },
    { name: "Aug", sales: 67000, deals: 55 },
    { name: "Sep", sales: 71000, deals: 60 },
    { name: "Oct", sales: 65000, deals: 53 },
    { name: "Nov", sales: 78000, deals: 65 },
    { name: "Dec", sales: 82000, deals: 70 },
  ],
};

// ── Closing Categories ────────────────────────────

export const closingCategories = [
  { name: "Deals Closed", value: 42, color: "#00C9FF" },
  { name: "Pending", value: 28, color: "#7B2FBE" },
  { name: "Follow-ups", value: 18, color: "#FFB300" },
  { name: "Lost", value: 12, color: "#FF5252" },
];

// ── Navigation Items ──────────────────────────────

export const navItems = [
  { icon: "Home", label: "Home", id: "home", href: "/dashboard" },
  { icon: "Zap", label: "Momentum", id: "momentum", href: "/momentum" },
  { icon: "Brain", label: "AI Training", id: "training", href: "/training" },
  { icon: "BarChart3", label: "Analytics", id: "analytics", href: "/analytics" },
  { icon: "CreditCard", label: "Billing", id: "billing", href: "/billing" },
];
