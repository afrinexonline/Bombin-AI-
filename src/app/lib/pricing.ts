/* ═══════════════════════════════════════════════════════════════════════════
   BOMBIN AI — SERVICE PRICES (Step 4A)

   ► This is the ONE place where every price, multiplier, minimum, maximum and
     delivery time lives. The calculators on the website AND the order server
     both read this file, so a change here changes everything at once.

   ► How to change a price: find the line, change the number, save. Example:
       { id: "landing", label: "Landing page", price: 270_000, ... }
     The underscore in 270_000 is only there to make big numbers easy to read.

   ► How a price is worked out (all three calculators):
       total = (base price + all extras) × every multiplier
       → rounded to the nearest ₦5,000 (ROUND_TO below)
       → never below the service's minimum
       → above the maximum, we show "Custom project: let's talk on WhatsApp"
     Monthly items (care plans, monthly marketing) are a separate "per month"
     line and are never added to the one-time total.

   ► Delivery times are in weeks: [shortest, longest].

   (Technical note: keep this file plain — no imports — so the price tests in
    tests/pricing.test.ts can run it directly.)
   ═══════════════════════════════════════════════════════════════════════════ */

/** Every total is rounded to the nearest ₦5,000. */
export const ROUND_TO = 5_000;

/** Where orders and "WhatsApp us" messages go (international format, no +). */
export const WHATSAPP_NUMBER = "2349064626982";

/* ─────────────────────────────────────────────────────────────────────────────
   Shared building blocks (you normally don't need to touch these)
   ───────────────────────────────────────────────────────────────────────────── */

export type ServiceId = "website" | "marketing" | "automation";

/** A pick-one option. `price` = money added, `mult` = multiplier, `monthly` = per month. */
export interface Option {
  id: string;
  label: string;
  hint?: string;
  price?: number;
  mult?: number;
  monthly?: number;
  weeks?: [number, number];
  /** Multiplier applied to delivery weeks (e.g. 0.7 = about 30% sooner). */
  weeksFactor?: number;
  /** Shown instead of the price, e.g. "from ₦1,000,000". */
  priceNote?: string;
  /** Website types: pages (or screens) included in the base price. */
  includedPages?: number;
  /** Website types: price of each extra page/screen. */
  extraPagePrice?: number;
  /** Website types: the products card applies. */
  hasProducts?: boolean;
  /** Website types: call them "screens" instead of "pages". */
  pageWord?: "pages" | "screens";
}

/** A tick-box or quantity item. `max` 1 = simple tick; more = +/- stepper. */
export interface Item {
  id: string;
  label: string;
  hint?: string;
  price: number;
  /** Words after the price, e.g. "each", "per page". */
  unit?: string;
  max: number;
  /** Shown under the item, e.g. a fee warning. */
  note?: string;
}

export type CardKind = "single" | "items" | "stepper";

export interface Card {
  id: string;
  number: number;
  title: string;
  hint: string;
  /** Plain-English explanation behind the small "?" button. */
  help: string;
  kind: CardKind;
  options?: Option[];
  items?: Item[];
  stepper?: { min: number; max: number; unitPrice?: number; unitLabel: string };
  /** Short note always shown on the card (e.g. "Ad budget not included"). */
  note?: string;
}

export interface ServiceInfo {
  id: ServiceId;
  letter: "W" | "M" | "A";
  name: string;
  slug: string;
  minimum: number;
  maximum: number;
  cards: Card[];
}

/* ═════════════════════════════════════════════════════════════════════════════
   A. WEBSITE DEVELOPMENT   (minimum ₦270,000 · maximum ₦15,000,000)
   ═════════════════════════════════════════════════════════════════════════════ */

export const WEBSITE: ServiceInfo = {
  id: "website",
  letter: "W",
  name: "Website Development",
  slug: "website-development",
  minimum: 270_000,
  maximum: 15_000_000,
  cards: [
    {
      id: "type",
      number: 1,
      title: "Website type",
      hint: "What kind of website do you need?",
      help: "Pick the closest match. The price already includes a number of pages (or screens for apps). You can add more pages in the next card.",
      kind: "single",
      options: [
        { id: "landing", label: "Landing page", hint: "1 page", price: 270_000, includedPages: 1, extraPagePrice: 35_000, weeks: [1, 2] },
        { id: "portfolio", label: "Portfolio / personal brand", hint: "4 pages", price: 380_000, includedPages: 4, extraPagePrice: 35_000, weeks: [2, 3] },
        { id: "business", label: "Business website", hint: "5 pages", price: 450_000, includedPages: 5, extraPagePrice: 35_000, weeks: [2, 4] },
        { id: "blog", label: "Blog / news / magazine", hint: "6 pages", price: 550_000, includedPages: 6, extraPagePrice: 35_000, weeks: [3, 4] },
        { id: "ecommerce", label: "E-commerce store", hint: "8 pages, up to 30 products", price: 850_000, includedPages: 8, extraPagePrice: 35_000, weeks: [3, 6], hasProducts: true },
        { id: "booking", label: "Booking / service platform", hint: "8 pages", price: 1_200_000, includedPages: 8, extraPagePrice: 35_000, weeks: [4, 7] },
        { id: "webapp", label: "Custom web app", hint: "Logins and dashboard, 10 screens", price: 2_000_000, includedPages: 10, extraPagePrice: 75_000, weeks: [6, 12], pageWord: "screens" },
        { id: "marketplace", label: "Marketplace / multi-vendor", hint: "15 screens", price: 4_500_000, includedPages: 15, extraPagePrice: 75_000, weeks: [10, 16], hasProducts: true, pageWord: "screens" },
      ],
    },
    {
      id: "pages",
      number: 2,
      title: "Number of pages",
      hint: "Extra pages beyond the ones included cost a little more.",
      help: "A page is one screen of your website, like Home, About, Services or Contact. Pages beyond those included cost ₦35,000 each (₦75,000 per screen for web apps and marketplaces).",
      kind: "stepper",
      stepper: { min: 1, max: 60, unitLabel: "pages" },
    },
    {
      id: "design",
      number: 3,
      title: "Design level",
      hint: "How special should it look?",
      help: "Clean is neat and professional. Premium is designed just for your brand. Luxury adds smooth animations and a futuristic feel.",
      kind: "single",
      options: [
        { id: "clean", label: "Clean & professional", mult: 1.0 },
        { id: "premium", label: "Premium custom design", mult: 1.35 },
        { id: "luxury", label: "Luxury & futuristic", hint: "With animations", mult: 1.7 },
      ],
    },
    {
      id: "features",
      number: 4,
      title: "Features",
      hint: "Tick anything you need. WhatsApp chat button and contact form are free.",
      help: "Extra things your website can do. For example, online payments let customers pay you directly with Paystack or Flutterwave.",
      kind: "items",
      items: [
        { id: "blog", label: "Blog section", price: 80_000, max: 1 },
        { id: "payments", label: "Online payments", hint: "Paystack / Flutterwave", price: 150_000, max: 1 },
        { id: "accounts", label: "Customer accounts & logins", price: 250_000, max: 1 },
        { id: "admin", label: "Admin dashboard to edit content", price: 300_000, max: 1 },
        { id: "bookings", label: "Bookings & appointments", price: 200_000, max: 1 },
        { id: "search", label: "Search & filters", price: 120_000, max: 1 },
        { id: "multilang", label: "Multi-language", price: 150_000, max: 1 },
        { id: "aichat", label: "AI chat assistant on the site", price: 350_000, max: 1 },
        { id: "connections", label: "Connections to other tools", hint: "CRM, email, other apps", price: 200_000, unit: "each", max: 10 },
      ],
    },
    {
      id: "products",
      number: 5,
      title: "Products",
      hint: "How many products will your store show?",
      help: "Up to 30 products are included. Bigger catalogues take more setup work.",
      kind: "single",
      options: [
        { id: "upto30", label: "Up to 30", hint: "Included", price: 0 },
        { id: "upto100", label: "31 – 100", price: 100_000 },
        { id: "upto500", label: "101 – 500", price: 300_000 },
        { id: "over500", label: "500+", price: 600_000 },
      ],
    },
    {
      id: "content",
      number: 6,
      title: "Content & branding",
      hint: "Want us to handle the words, logo or pictures?",
      help: "Copywriting means we write the words for every page. SEO setup helps Google find your website. Domain & hosting setup gets your web address live.",
      kind: "items",
      items: [
        { id: "copywriting", label: "Copywriting", price: 20_000, unit: "per page", max: 1 },
        { id: "logo", label: "Logo & brand kit", price: 150_000, max: 1 },
        { id: "images", label: "Professional images / AI visuals", price: 100_000, max: 1 },
        { id: "seo", label: "SEO setup", price: 120_000, max: 1 },
        { id: "domain", label: "Domain & hosting setup", price: 60_000, max: 1 },
      ],
    },
    {
      id: "testing",
      number: 7,
      title: "Testing & bug protection",
      hint: "How carefully should we test before launch?",
      help: "Every website is tested. Higher levels check more phones and browsers, test speed and security, and give you more days of free bug fixes after launch.",
      kind: "single",
      options: [
        { id: "standard", label: "Standard", hint: "30 days of free bug fixes", mult: 1.0 },
        { id: "advanced", label: "Advanced", hint: "Every phone & browser, speed and security checks, 60 days of fixes", mult: 1.12 },
        { id: "critical", label: "Mission-critical", hint: "Load testing, security audit, 90 days of fixes", mult: 1.25 },
      ],
    },
    {
      id: "speed",
      number: 8,
      title: "Delivery speed",
      hint: "Need it sooner?",
      help: "Faster delivery means more of our team works on your project at the same time, so it costs more.",
      kind: "single",
      options: [
        { id: "standard", label: "Standard", mult: 1.0, weeksFactor: 1 },
        { id: "fast", label: "Fast", hint: "About 30% sooner", mult: 1.25, weeksFactor: 0.7 },
        { id: "express", label: "Express", hint: "About 50% sooner", mult: 1.5, weeksFactor: 0.5 },
      ],
    },
    {
      id: "care",
      number: 9,
      title: "Care after launch",
      hint: "Optional monthly support. Not added to the one-time price.",
      help: "We look after your website every month: updates, backups and fixes. You can stop anytime.",
      kind: "single",
      options: [
        { id: "none", label: "None", monthly: 0 },
        { id: "basic", label: "Basic", hint: "Updates, backups, small fixes", monthly: 25_000 },
        { id: "pro", label: "Pro", hint: "Plus monthly improvements and reports", monthly: 75_000 },
        { id: "premium", label: "Premium", hint: "Priority support, new sections monthly", monthly: 200_000 },
      ],
    },
  ],
};

/* ═════════════════════════════════════════════════════════════════════════════
   B. AI MARKETING   (minimum ₦25,000 · maximum ₦4,000,000)
   ═════════════════════════════════════════════════════════════════════════════ */

/** Monthly discount on extras when "Monthly" is chosen (packages are already bundle prices). */
export const MARKETING_MONTHLY_DISCOUNT = 0.1;
/** Items the "Video quality" multiplier applies to. */
export const MARKETING_VIDEO_ITEMS = ["aiShort", "aiUgc", "creator", "editing"];
/** Ads: one-time setup fee (charged once if any ad platform is chosen). */
export const MARKETING_ADS_SETUP = 100_000;

export const MARKETING: ServiceInfo = {
  id: "marketing",
  letter: "M",
  name: "AI Marketing",
  slug: "ai-marketing",
  minimum: 25_000,
  maximum: 4_000_000,
  cards: [
    {
      id: "package",
      number: 1,
      title: "Start from a package",
      hint: "Optional. One tap fills a ready-made monthly bundle.",
      help: "Packages are monthly bundles at a set price. You can still add extras below. Choose \"Build my own\" to pick everything yourself.",
      kind: "single",
      options: [
        { id: "none", label: "Build my own", monthly: 0 },
        { id: "starter", label: "Starter", hint: "2 platforms, 12 posts, 4 AI short videos", monthly: 180_000 },
        { id: "growth", label: "Growth", hint: "3 platforms, 24 posts, 8 AI videos, ads on 1 platform", monthly: 450_000 },
        { id: "premium", label: "Premium", hint: "4+ platforms, 40+ pieces, AI UGC videos, ads on 2 platforms, AI SEO", monthly: 1_000_000, priceNote: "from ₦1,000,000" },
      ],
    },
    {
      id: "billing",
      number: 2,
      title: "One-time or monthly",
      hint: "Monthly saves 10% on extras every month.",
      help: "One-time is a single project. Monthly means we keep your marketing running every month, and extras are 10% cheaper. Packages are always monthly.",
      kind: "single",
      options: [
        { id: "oneTime", label: "One-time project" },
        { id: "monthly", label: "Monthly", hint: "10% off extras every month" },
      ],
    },
    {
      id: "content",
      number: 3,
      title: "Videos & content",
      hint: "How many of each would you like?",
      help: "AI videos are made with AI tools. UGC-style videos look like a real customer talking about your product. Real creator videos are made by real people we find for you.",
      kind: "items",
      items: [
        { id: "aiShort", label: "AI short videos / reels", hint: "15–60 seconds", price: 25_000, unit: "each", max: 50 },
        { id: "aiUgc", label: "AI UGC-style videos", hint: "With an AI presenter", price: 45_000, unit: "each", max: 50 },
        { id: "creator", label: "Real creator / influencer videos", hint: "We find the creator", price: 80_000, unit: "each", max: 20, note: "Creator fees can vary; we confirm before you pay." },
        { id: "editing", label: "AI editing of your own videos", price: 20_000, unit: "each", max: 50 },
        { id: "graphics", label: "AI graphics, flyers & carousels", price: 15_000, unit: "each", max: 100 },
        { id: "captions", label: "AI captions & ad copy pack", hint: "10 pieces per pack", price: 25_000, unit: "per pack", max: 20 },
      ],
    },
    {
      id: "services",
      number: 4,
      title: "Marketing services",
      hint: "Tick anything you'd like us to run for you.",
      help: "SEO helps you rank on Google. Ads management means we create and run your paid ads. Social media management means we post and reply to comments for you.",
      kind: "items",
      note: "Ad budget is paid directly to Meta/TikTok/Google and is not included.",
      items: [
        // SEO is a 3-level choice: the stepper picks 0 = none, 1 = Starter, 2 = Growth, 3 = Pro.
        { id: "seo", label: "AI SEO (Google ranking)", hint: "Starter / Growth / Pro", price: 0, max: 3 },
        { id: "ads", label: "AI ads management", hint: "Meta, TikTok or Google · ₦100,000 setup", price: 150_000, unit: "per platform / month", max: 3 },
        { id: "social", label: "Social media management", hint: "Posting, captions, replying to comments", price: 80_000, unit: "per platform / month", max: 6 },
        { id: "broadcast", label: "Email or WhatsApp broadcast campaigns", price: 100_000, unit: "per campaign", max: 10 },
        { id: "strategy", label: "Brand & strategy session", hint: "One-time", price: 75_000, max: 1 },
      ],
    },
    {
      id: "quality",
      number: 5,
      title: "Video quality",
      hint: "Applies to videos only.",
      help: "Premium adds motion graphics, a custom voice and sound design. Cinematic is our most polished, film-like finish.",
      kind: "single",
      options: [
        { id: "standard", label: "Standard", mult: 1.0 },
        { id: "premium", label: "Premium", hint: "Motion graphics, custom voice, sound design", mult: 1.3 },
        { id: "cinematic", label: "Cinematic", mult: 1.7 },
      ],
    },
    {
      id: "complexity",
      number: 6,
      title: "Brand complexity",
      hint: "How big is your brand?",
      help: "More products, audiences or countries means more planning and versions of every piece of content.",
      kind: "single",
      options: [
        { id: "simple", label: "Simple", hint: "One product, local", mult: 1.0 },
        { id: "growing", label: "Growing", hint: "Several products or audiences", mult: 1.2 },
        { id: "advanced", label: "Advanced", hint: "Many products, regulated industry or several countries", mult: 1.45 },
      ],
    },
    {
      id: "turnaround",
      number: 7,
      title: "Turnaround",
      hint: "Need it in a hurry?",
      help: "Rush puts your work at the front of the queue.",
      kind: "single",
      options: [
        { id: "standard", label: "Standard", hint: "First content in 1–2 weeks", mult: 1.0, weeks: [1, 2] },
        { id: "rush", label: "Rush", hint: "First content within 1 week", mult: 1.3, weeks: [1, 1] },
      ],
    },
  ],
};

/** AI SEO levels (stepper value 1, 2, 3). Per month when "Monthly" is chosen. */
export const MARKETING_SEO_LEVELS = [
  { id: "starter", label: "Starter", price: 150_000 },
  { id: "growth", label: "Growth", price: 350_000 },
  { id: "pro", label: "Pro", price: 700_000 },
];

/* ═════════════════════════════════════════════════════════════════════════════
   C. AI AUTOMATION   (minimum ₦2,000,000 · maximum ₦50,000,000)
   ═════════════════════════════════════════════════════════════════════════════ */

/** Workflows: 1 included; each extra costs this and adds about 1 week. */
export const AUTOMATION_EXTRA_WORKFLOW = 600_000;
export const AUTOMATION_WEEKS_PER_EXTRA_WORKFLOW = 1;
/** Tools: the first 2 are included; each extra costs this. */
export const AUTOMATION_INCLUDED_TOOLS = 2;
export const AUTOMATION_EXTRA_TOOL = 250_000;

export const AUTOMATION: ServiceInfo = {
  id: "automation",
  letter: "A",
  name: "AI Automation",
  slug: "ai-automation",
  minimum: 2_000_000,
  maximum: 50_000_000,
  cards: [
    {
      id: "type",
      number: 1,
      title: "What do you want to automate?",
      hint: "Pick the closest match.",
      help: "Each choice is a starting point. We'll shape it around how your business works.",
      kind: "single",
      options: [
        { id: "workflow", label: "Single workflow", hint: "e.g. new lead → CRM → WhatsApp alert", price: 2_000_000, weeks: [2, 3] },
        { id: "support", label: "Customer support AI agent", hint: "WhatsApp, website or email", price: 3_500_000, weeks: [3, 5] },
        { id: "sales", label: "Sales & lead generation system", price: 4_000_000, weeks: [4, 6] },
        { id: "backoffice", label: "Back-office operations", hint: "Invoices, reports, documents", price: 4_500_000, weeks: [4, 7] },
        { id: "documents", label: "AI document & data processing", hint: "Reads PDFs, receipts, forms", price: 5_000_000, weeks: [5, 8] },
        { id: "business", label: "Business-wide automation", hint: "Several departments", price: 9_000_000, weeks: [8, 14] },
        { id: "custom", label: "Custom AI agent / platform", price: 15_000_000, weeks: [12, 20] },
      ],
    },
    {
      id: "workflows",
      number: 2,
      title: "Number of workflows",
      hint: "1 is included. Each extra adds about a week.",
      help: "A workflow is one job the automation does from start to finish, like \"when a new order comes in, send a receipt and update the sheet\".",
      kind: "stepper",
      stepper: { min: 1, max: 20, unitPrice: AUTOMATION_EXTRA_WORKFLOW, unitLabel: "workflows" },
    },
    {
      id: "tools",
      number: 3,
      title: "Tools to connect",
      hint: "e.g. WhatsApp, Gmail, Google Sheets, CRM, accounting software. First 2 included.",
      help: "Count every app the automation needs to read from or send to. Custom or old in-house systems take extra work to connect.",
      kind: "items",
      items: [
        { id: "standard", label: "Everyday tools", hint: "First 2 included, then ₦250,000 each", price: AUTOMATION_EXTRA_TOOL, unit: "each extra", max: 22 },
        { id: "custom", label: "Custom or old in-house systems", price: 750_000, unit: "each", max: 10 },
      ],
    },
    {
      id: "smart",
      number: 4,
      title: "How smart it must be",
      hint: "From simple rules to careful, high-security AI.",
      help: "Simple rules follow fixed steps. AI can read messages and documents and decide what to do. Mission-critical adds the extra care that finance and health businesses need.",
      kind: "single",
      options: [
        { id: "rules", label: "Simple rules", mult: 1.0 },
        { id: "ai", label: "AI reads and decides", mult: 1.4 },
        { id: "agents", label: "Advanced AI agents", hint: "Multi-step, with human approval", mult: 1.9 },
        { id: "critical", label: "Mission-critical", hint: "Finance, health, audit logs, high security", mult: 2.5 },
      ],
    },
    {
      id: "volume",
      number: 5,
      title: "Work per month",
      hint: "Roughly how many tasks will it handle each month?",
      help: "A task is one thing done, like one message answered or one invoice processed. Bigger volumes need a stronger setup.",
      kind: "single",
      options: [
        { id: "v1", label: "Up to 1,000", mult: 1.0 },
        { id: "v2", label: "1,000 – 10,000", mult: 1.15 },
        { id: "v3", label: "10,000 – 100,000", mult: 1.35 },
        { id: "v4", label: "100,000+", mult: 1.6 },
      ],
    },
    {
      id: "security",
      number: 6,
      title: "Data & security",
      hint: "Tick if your automation handles private information.",
      help: "Sensitive data means things like bank details, health records or ID numbers. A security review is an extra independent check before launch.",
      kind: "items",
      items: [
        { id: "sensitive", label: "Sensitive data handling", price: 1_000_000, max: 1 },
        { id: "review", label: "Extra security review", price: 1_500_000, max: 1 },
      ],
    },
    {
      id: "training",
      number: 7,
      title: "Training & handover",
      hint: "Written guides are always included.",
      help: "We hand over clear documentation for free. A training session walks your team through everything live.",
      kind: "items",
      items: [{ id: "session", label: "Team training session", price: 300_000, max: 1 }],
    },
    {
      id: "speed",
      number: 8,
      title: "Delivery speed",
      hint: "Need it sooner?",
      help: "Priority means more of our team works on your project at once.",
      kind: "single",
      options: [
        { id: "standard", label: "Standard", mult: 1.0, weeksFactor: 1 },
        { id: "priority", label: "Priority", hint: "About 30% sooner", mult: 1.3, weeksFactor: 0.7 },
      ],
    },
    {
      id: "care",
      number: 9,
      title: "Care plan",
      hint: "Optional monthly support. Not added to the one-time price.",
      help: "We watch your automations, fix problems and keep improving them every month.",
      kind: "single",
      note: "AI usage fees (e.g. AI model costs) are billed at cost.",
      options: [
        { id: "none", label: "None", monthly: 0 },
        { id: "basic", label: "Basic", monthly: 150_000 },
        { id: "growth", label: "Growth", monthly: 400_000 },
        { id: "enterprise", label: "Enterprise", monthly: 1_000_000 },
      ],
    },
  ],
};

export const SERVICES: Record<ServiceId, ServiceInfo> = { website: WEBSITE, marketing: MARKETING, automation: AUTOMATION };

/* ═════════════════════════════════════════════════════════════════════════════
   Starting choices (pre-selected so a price shows straight away)
   ═════════════════════════════════════════════════════════════════════════════ */

export type Choices = Record<string, string | number | Record<string, number>>;

export const DEFAULT_CHOICES: Record<ServiceId, Choices> = {
  website: {
    type: "business",
    pages: 5,
    design: "clean",
    features: {},
    products: "upto30",
    content: {},
    testing: "standard",
    speed: "standard",
    care: "none",
  },
  marketing: {
    package: "starter",
    billing: "monthly",
    content: {},
    services: {},
    quality: "standard",
    complexity: "simple",
    turnaround: "standard",
  },
  automation: {
    type: "support",
    workflows: 1,
    tools: { standard: 2, custom: 0 },
    smart: "ai",
    volume: "v1",
    security: {},
    training: {},
    speed: "standard",
    care: "none",
  },
};

/* ═════════════════════════════════════════════════════════════════════════════
   The maths (you shouldn't need to change anything below to update prices)
   ═════════════════════════════════════════════════════════════════════════════ */

export function roundPrice(n: number): number {
  return Math.round(n / ROUND_TO) * ROUND_TO;
}

/** ₦ with commas, e.g. ₦1,250,000 (same result in every browser and on the server). */
export function naira(n: number): string {
  return "₦" + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function card(service: ServiceInfo, id: string): Card {
  const c = service.cards.find((x) => x.id === id);
  if (!c) throw new Error(`Unknown card ${id}`);
  return c;
}

function option(service: ServiceInfo, cardId: string, optionId: unknown): Option {
  const opts = card(service, cardId).options ?? [];
  return opts.find((o) => o.id === optionId) ?? opts[0];
}

/** Website: is the products card shown for this website type? */
export function websiteHasProducts(choices: Choices): boolean {
  return !!option(WEBSITE, "type", choices.type).hasProducts;
}

/** Which cards to show (some only apply to certain choices). */
export function visibleCards(service: ServiceInfo, choices: Choices): Card[] {
  if (service.id === "website") return service.cards.filter((c) => c.id !== "products" || websiteHasProducts(choices));
  return service.cards;
}

/**
 * Make any choices object safe: unknown values fall back to the defaults, numbers are
 * kept inside their allowed range. The order server runs this on whatever the browser
 * sends, so a tampered request can never change the price rules.
 */
export function cleanChoices(serviceId: ServiceId, raw: unknown): Choices {
  const service = SERVICES[serviceId];
  const def = DEFAULT_CHOICES[serviceId];
  const src = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const out: Choices = {};
  for (const c of service.cards) {
    const v = src[c.id];
    if (c.kind === "single") {
      const ok = (c.options ?? []).some((o) => o.id === v);
      out[c.id] = ok ? (v as string) : (def[c.id] as string);
    } else if (c.kind === "stepper") {
      const n = Math.round(Number(v));
      const s = c.stepper!;
      out[c.id] = Number.isFinite(n) ? Math.min(s.max, Math.max(s.min, n)) : (def[c.id] as number);
    } else {
      const given = (v && typeof v === "object" ? v : def[c.id]) as Record<string, unknown>;
      const items: Record<string, number> = {};
      for (const it of c.items ?? []) {
        const n = Math.round(Number(given?.[it.id] ?? 0));
        const clamped = Number.isFinite(n) ? Math.min(it.max, Math.max(0, n)) : 0;
        if (clamped > 0) items[it.id] = clamped;
      }
      out[c.id] = items;
    }
  }
  // Marketing: a package is always monthly.
  if (serviceId === "marketing" && out.package !== "none") out.billing = "monthly";
  return out;
}

/* ── Quote shape (what the calculators, review screen and server all use) ── */

export interface QuoteLine {
  label: string;
  /** e.g. "Business website", "3 × ₦25,000" */
  detail?: string;
  amount?: number;
  /** Shown instead of an amount, e.g. "×1.35" or "Included". */
  tag?: string;
  /** Which total it belongs to. */
  part: "oneTime" | "monthly" | "multiplier" | "info";
}

export interface Quote {
  service: ServiceId;
  lines: QuoteLine[];
  /** Plain-words explanation of every multiplier used. */
  multipliers: { label: string; factor: number; appliesTo: string }[];
  /** Which line is the headline price. */
  main: "oneTime" | "monthly";
  /** One-time price after rounding and limits (null = nothing one-time). */
  oneTime: number | null;
  /** Monthly price after rounding (null = nothing monthly). */
  monthly: number | null;
  /** The headline price fell below the minimum and was raised to it. */
  atMinimum: boolean;
  /** The headline price is above the maximum: show "Custom project". */
  custom: boolean;
  /** The package price is a "from" price. */
  fromPrice: boolean;
  weeks: [number, number];
  deliveryText: string;
  notes: string[];
}

function weeksText(w: [number, number]): string {
  return w[0] === w[1] ? `${w[0]} week${w[0] === 1 ? "" : "s"}` : `${w[0]}–${w[1]} weeks`;
}

function scaleWeeks(w: [number, number], factor: number): [number, number] {
  const a = Math.max(1, Math.round(w[0] * factor));
  const b = Math.max(a, Math.round(w[1] * factor));
  return [a, b];
}

/** Apply rounding and the minimum/maximum to the headline price. */
function limit(service: ServiceInfo, raw: number): { value: number; atMinimum: boolean; custom: boolean } {
  const rounded = roundPrice(raw);
  if (rounded > service.maximum) return { value: rounded, atMinimum: false, custom: true };
  if (rounded < service.minimum) return { value: service.minimum, atMinimum: true, custom: false };
  return { value: rounded, atMinimum: false, custom: false };
}

/* ── A. Website ── */
function quoteWebsite(ch: Choices): Quote {
  const S = WEBSITE;
  const lines: QuoteLine[] = [];
  const type = option(S, "type", ch.type);
  const pages = Number(ch.pages);
  const word = type.pageWord ?? "pages";
  lines.push({ label: "Website type", detail: `${type.label} (${type.includedPages} ${word} included)`, amount: type.price!, part: "oneTime" });
  let sum = type.price!;

  const extra = Math.max(0, pages - (type.includedPages ?? 0));
  if (extra > 0) {
    const a = extra * (type.extraPagePrice ?? 0);
    lines.push({ label: `Extra ${word}`, detail: `${extra} × ${naira(type.extraPagePrice ?? 0)}`, amount: a, part: "oneTime" });
    sum += a;
  }

  const feats = ch.features as Record<string, number>;
  for (const it of card(S, "features").items!) {
    const q = feats[it.id] ?? 0;
    if (!q) continue;
    const a = q * it.price;
    lines.push({ label: it.label, detail: q > 1 ? `${q} × ${naira(it.price)}` : undefined, amount: a, part: "oneTime" });
    sum += a;
  }
  lines.push({ label: "WhatsApp chat button & contact form", tag: "Included", part: "info" });

  if (type.hasProducts) {
    const p = option(S, "products", ch.products);
    lines.push({ label: "Products", detail: p.label, amount: p.price, tag: p.price ? undefined : "Included", part: "oneTime" });
    sum += p.price ?? 0;
  }

  const content = ch.content as Record<string, number>;
  for (const it of card(S, "content").items!) {
    if (!content[it.id]) continue;
    const a = it.id === "copywriting" ? it.price * pages : it.price;
    lines.push({ label: it.label, detail: it.id === "copywriting" ? `${pages} ${word} × ${naira(it.price)}` : undefined, amount: a, part: "oneTime" });
    sum += a;
  }

  const design = option(S, "design", ch.design);
  const testing = option(S, "testing", ch.testing);
  const speed = option(S, "speed", ch.speed);
  const multipliers = [
    { label: `Design: ${design.label}`, factor: design.mult!, appliesTo: "the whole price" },
    { label: `Testing: ${testing.label}`, factor: testing.mult!, appliesTo: "the whole price" },
    { label: `Delivery: ${speed.label}`, factor: speed.mult!, appliesTo: "the whole price" },
  ];
  for (const m of multipliers) lines.push({ label: m.label, tag: `×${m.factor}`, part: "multiplier" });
  const raw = sum * design.mult! * testing.mult! * speed.mult!;
  const lim = limit(S, raw);

  const care = option(S, "care", ch.care);
  if (care.monthly) lines.push({ label: "Care after launch", detail: care.label, amount: care.monthly, part: "monthly" });

  const weeks = scaleWeeks(type.weeks!, speed.weeksFactor ?? 1);
  return {
    service: "website",
    lines,
    multipliers,
    main: "oneTime",
    oneTime: lim.value,
    monthly: care.monthly ? care.monthly : null,
    atMinimum: lim.atMinimum,
    custom: lim.custom,
    fromPrice: false,
    weeks,
    deliveryText: weeksText(weeks),
    notes: [],
  };
}

/* ── B. Marketing ── */
function quoteMarketing(ch: Choices): Quote {
  const S = MARKETING;
  const lines: QuoteLine[] = [];
  const pkg = option(S, "package", ch.package);
  const monthlyMode = ch.billing === "monthly" || pkg.id !== "none";
  const quality = option(S, "quality", ch.quality);
  const complexity = option(S, "complexity", ch.complexity);
  const turnaround = option(S, "turnaround", ch.turnaround);
  const period = monthlyMode ? "monthly" : "oneTime";

  let recurring = 0; // extras that repeat each month in monthly mode
  let setup = 0; // always one-time
  if (pkg.monthly) lines.push({ label: "Package", detail: `${pkg.label}${pkg.priceNote ? " (from)" : ""}`, amount: pkg.monthly, part: "monthly" });

  const content = ch.content as Record<string, number>;
  for (const it of card(S, "content").items!) {
    const q = content[it.id] ?? 0;
    if (!q) continue;
    const isVideo = MARKETING_VIDEO_ITEMS.includes(it.id);
    const a = q * it.price * (isVideo ? quality.mult! : 1);
    lines.push({ label: it.label, detail: `${q} × ${naira(it.price)}${isVideo && quality.mult !== 1 ? ` × ${quality.mult}` : ""}`, amount: a, part: period });
    recurring += a;
  }

  const svc = ch.services as Record<string, number>;
  if (svc.seo) {
    const lvl = MARKETING_SEO_LEVELS[Math.min(MARKETING_SEO_LEVELS.length, svc.seo) - 1];
    lines.push({ label: "AI SEO", detail: lvl.label, amount: lvl.price, part: period });
    recurring += lvl.price;
  }
  const items = card(S, "services").items!;
  const it = (id: string) => items.find((x) => x.id === id)!;
  if (svc.ads) {
    const a = svc.ads * it("ads").price;
    lines.push({ label: "AI ads management", detail: `${svc.ads} platform${svc.ads > 1 ? "s" : ""} × ${naira(it("ads").price)}`, amount: a, part: period });
    lines.push({ label: "Ads setup", detail: "One-time", amount: MARKETING_ADS_SETUP, part: "oneTime" });
    recurring += a;
    setup += MARKETING_ADS_SETUP;
  }
  if (svc.social) {
    const a = svc.social * it("social").price;
    lines.push({ label: "Social media management", detail: `${svc.social} platform${svc.social > 1 ? "s" : ""} × ${naira(it("social").price)}`, amount: a, part: period });
    recurring += a;
  }
  if (svc.broadcast) {
    const a = svc.broadcast * it("broadcast").price;
    lines.push({ label: "Broadcast campaigns", detail: `${svc.broadcast} × ${naira(it("broadcast").price)}`, amount: a, part: period });
    recurring += a;
  }
  if (svc.strategy) {
    lines.push({ label: "Brand & strategy session", detail: "One-time", amount: it("strategy").price, part: "oneTime" });
    setup += it("strategy").price;
  }

  const multipliers: Quote["multipliers"] = [];
  if (quality.mult !== 1) multipliers.push({ label: `Video quality: ${quality.label}`, factor: quality.mult!, appliesTo: "videos only" });
  multipliers.push({ label: `Brand complexity: ${complexity.label}`, factor: complexity.mult!, appliesTo: "everything" });
  multipliers.push({ label: `Turnaround: ${turnaround.label}`, factor: turnaround.mult!, appliesTo: "everything" });
  if (monthlyMode && recurring > 0) {
    lines.push({ label: "Monthly saving on extras", tag: `−${MARKETING_MONTHLY_DISCOUNT * 100}%`, part: "multiplier" });
  }
  for (const m of multipliers) if (m.appliesTo !== "videos only") lines.push({ label: m.label, tag: `×${m.factor}`, part: "multiplier" });

  const both = complexity.mult! * turnaround.mult!;
  let main: number;
  let other: number | null;
  if (monthlyMode) {
    main = ((pkg.monthly ?? 0) + recurring * (1 - MARKETING_MONTHLY_DISCOUNT)) * both;
    other = setup > 0 ? roundPrice(setup * both) : null;
  } else {
    main = (recurring + setup) * both;
    other = null;
  }
  const lim = limit(S, main);
  const notes: string[] = [];
  if (svc.ads) notes.push("Ad budget is paid directly to Meta/TikTok/Google and is not included.");
  if (content.creator) notes.push("Creator fees can vary; we confirm before you pay.");

  const weeks = turnaround.weeks!;
  return {
    service: "marketing",
    lines,
    multipliers,
    main: monthlyMode ? "monthly" : "oneTime",
    oneTime: monthlyMode ? other : lim.value,
    monthly: monthlyMode ? lim.value : null,
    atMinimum: lim.atMinimum,
    custom: lim.custom,
    fromPrice: !!pkg.priceNote,
    weeks,
    deliveryText: weeks[1] === 1 ? "First content within 1 week" : `First content in ${weeksText(weeks)}`,
    notes,
  };
}

/* ── C. Automation ── */
function quoteAutomation(ch: Choices): Quote {
  const S = AUTOMATION;
  const lines: QuoteLine[] = [];
  const type = option(S, "type", ch.type);
  lines.push({ label: "Automation", detail: type.label, amount: type.price!, part: "oneTime" });
  let sum = type.price!;

  const wf = Number(ch.workflows);
  if (wf > 1) {
    const a = (wf - 1) * AUTOMATION_EXTRA_WORKFLOW;
    lines.push({ label: "Extra workflows", detail: `${wf - 1} × ${naira(AUTOMATION_EXTRA_WORKFLOW)}`, amount: a, part: "oneTime" });
    sum += a;
  }
  const tools = ch.tools as Record<string, number>;
  const extraTools = Math.max(0, (tools.standard ?? 0) - AUTOMATION_INCLUDED_TOOLS);
  lines.push({ label: "Tools connected", detail: `${tools.standard ?? 0} (first ${AUTOMATION_INCLUDED_TOOLS} included)`, amount: extraTools * AUTOMATION_EXTRA_TOOL || undefined, tag: extraTools ? undefined : "Included", part: "oneTime" });
  sum += extraTools * AUTOMATION_EXTRA_TOOL;
  const customItem = card(S, "tools").items!.find((x) => x.id === "custom")!;
  if (tools.custom) {
    const a = tools.custom * customItem.price;
    lines.push({ label: "Custom / in-house systems", detail: `${tools.custom} × ${naira(customItem.price)}`, amount: a, part: "oneTime" });
    sum += a;
  }
  for (const cid of ["security", "training"]) {
    const sel = ch[cid] as Record<string, number>;
    for (const it of card(S, cid).items!) {
      if (!sel[it.id]) continue;
      lines.push({ label: it.label, amount: it.price, part: "oneTime" });
      sum += it.price;
    }
  }
  lines.push({ label: "Documentation", tag: "Included", part: "info" });

  const smart = option(S, "smart", ch.smart);
  const volume = option(S, "volume", ch.volume);
  const speed = option(S, "speed", ch.speed);
  const multipliers = [
    { label: `Intelligence: ${smart.label}`, factor: smart.mult!, appliesTo: "the whole price" },
    { label: `Work per month: ${volume.label}`, factor: volume.mult!, appliesTo: "the whole price" },
    { label: `Delivery: ${speed.label}`, factor: speed.mult!, appliesTo: "the whole price" },
  ];
  for (const m of multipliers) lines.push({ label: m.label, tag: `×${m.factor}`, part: "multiplier" });
  const lim = limit(S, sum * smart.mult! * volume.mult! * speed.mult!);

  const care = option(S, "care", ch.care);
  if (care.monthly) lines.push({ label: "Care plan", detail: care.label, amount: care.monthly, part: "monthly" });

  const extraWeeks = Math.max(0, wf - 1) * AUTOMATION_WEEKS_PER_EXTRA_WORKFLOW;
  const weeks = scaleWeeks([type.weeks![0] + extraWeeks, type.weeks![1] + extraWeeks], speed.weeksFactor ?? 1);
  return {
    service: "automation",
    lines,
    multipliers,
    main: "oneTime",
    oneTime: lim.value,
    monthly: care.monthly ? care.monthly : null,
    atMinimum: lim.atMinimum,
    custom: lim.custom,
    fromPrice: false,
    weeks,
    deliveryText: weeksText(weeks),
    notes: ["AI usage fees (e.g. AI model costs) are billed at cost."],
  };
}

/** Work out the full quote for any service. Always cleans the choices first. */
export function quote(serviceId: ServiceId, rawChoices: unknown): Quote {
  const ch = cleanChoices(serviceId, rawChoices);
  if (serviceId === "website") return quoteWebsite(ch);
  if (serviceId === "marketing") return quoteMarketing(ch);
  return quoteAutomation(ch);
}

/** Text for the headline price, e.g. "₦1,250,000" or "from ₦1,000,000 / month". */
export function headlinePrice(q: Quote): string {
  if (q.custom) return "Custom project: let's talk on WhatsApp";
  const value = q.main === "monthly" ? q.monthly : q.oneTime;
  const base = (q.fromPrice ? "from " : "") + naira(value ?? 0);
  return q.main === "monthly" ? `${base} / month` : base;
}
