"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { ArrowDown, Check, ClipboardList, Globe, Image as ImageIcon, Paperclip, Users } from "lucide-react";
import { BRAND_ICONS, type BrandId } from "../brandIcons";
import { ShowcaseHeading } from "./Frames";

/*
 * AI Automation showcase (Step 4B): "Watch your business run itself".
 * Each flow is a row of small app-screen cards joined by glowing cyan lines; a light pulse
 * runs step by step, the Bombin AI card "thinks" and then replies, and the flow loops.
 * Phones: one flow at a time, top to bottom. Computers: left to right.
 * App icons are the official Simple Icons glyphs (see brandIcons.ts), shown small and unaltered.
 * Names and figures inside the cards are made-up examples; no results are claimed.
 */

type AppKind = BrandId | "bombin" | "crm" | "orders" | "form";
interface Step {
  app: AppKind | AppKind[];
  name: string;
  /** For the Bombin AI step, this shows after a short "thinking" animation. */
  body: ReactNode;
}
interface Flow {
  id: string;
  tab: string;
  tabIcon: AppKind;
  title: string;
  steps: Step[];
}

/* ── Little UI pieces used inside the cards ── */
const Bubble = ({ side, children, tone = "grey" }: { side: "l" | "r"; children: ReactNode; tone?: "grey" | "cyan" | "green" | "white" }) => {
  const tones = {
    grey: "bg-[#eef0f4] text-[#1c2233]",
    white: "bg-white text-[#1c2233]",
    cyan: "bg-gradient-to-br from-[#01C4FA] to-[#1a8fd6] text-white",
    green: "bg-[#d9fdd3] text-[#10301c]",
  };
  return (
    <div className={`max-w-[92%] rounded-2xl px-3 py-2 text-[13px] leading-snug shadow-sm ${tones[tone]} ${side === "l" ? "self-start rounded-tl-sm" : "self-end rounded-tr-sm"}`}>{children}</div>
  );
};
const Row = ({ cells, hot }: { cells: string[]; hot?: boolean }) => (
  <div className={`grid grid-cols-3 gap-1 border-t border-[#e3e8ef] px-2 py-1.5 text-[11px] ${hot ? "bg-[#e6f6ec] font-semibold text-[#0f6b3a]" : "text-[#5b6476]"}`}>
    {cells.map((c, i) => <span key={i} className="truncate">{c}</span>)}
  </div>
);
const Sheet = ({ head, rows, hot }: { head: string[]; rows: string[][]; hot: string[] }) => (
  <div className="overflow-hidden rounded-lg border border-[#e3e8ef] bg-white">
    <div className="grid grid-cols-3 gap-1 bg-[#f3f6f9] px-2 py-1.5 text-[11px] font-bold text-[#1c2233]">{head.map((h) => <span key={h} className="truncate">{h}</span>)}</div>
    {rows.map((r, i) => <Row key={i} cells={r} />)}
    <Row cells={hot} hot />
  </div>
);
const Field = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg border border-[#e3e8ef] bg-white px-2.5 py-1.5">
    <div className="text-[10px] font-semibold uppercase tracking-wide text-[#8a93a6]">{label}</div>
    <div className="truncate text-[12px] font-semibold text-[#1c2233]">{value}</div>
  </div>
);
const Mail = ({ from, subject, sent, attach }: { from: string; subject: string; sent?: boolean; attach?: string }) => (
  <div className="rounded-lg border border-[#e3e8ef] bg-white p-2.5">
    <div className="flex items-center justify-between text-[11px] text-[#8a93a6]"><span className="font-semibold text-[#1c2233]">{from}</span><span>{sent ? "Sent" : "now"}</span></div>
    <div className="mt-0.5 text-[12px] font-bold leading-snug text-[#1c2233]">{subject}</div>
    {attach && <div className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-[#fdecea] px-2 py-0.5 text-[10px] font-semibold text-[#c5221f]"><Paperclip size={10} /> {attach}</div>}
  </div>
);
const Post = ({ from, to, children }: { from: string; to: string; children?: ReactNode }) => (
  <div className="relative h-14 overflow-hidden rounded-lg" style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}>{children}</div>
);

/* ── The six flows ── */
const FLOWS: Flow[] = [
  {
    id: "instagram", tab: "Instagram", tabIcon: "instagram", title: "Instagram DM → reply → lead saved → you get alerted",
    steps: [
      { app: "instagram", name: "Instagram DM", body: <div className="flex flex-col gap-1.5"><Post from="#d9b88f" to="#5a3a22" /><Bubble side="l">How much is this bag?</Bubble></div> },
      { app: "bombin", name: "Bombin AI", body: <Bubble side="r" tone="cyan">It&apos;s ₦45,000 😊 Which size would you like: small or large?</Bubble> },
      { app: "googlesheets", name: "Google Sheets", body: <Sheet head={["Name", "Item", "Status"]} rows={[["Kemi", "Wallet", "Paid"]]} hot={["Amaka", "Tote bag", "Hot lead"]} /> },
      { app: "whatsapp", name: "WhatsApp alert", body: <Bubble side="l" tone="white"><b>🔥 New hot lead</b><br />Amaka wants the tote bag (large).</Bubble> },
    ],
  },
  {
    id: "facebook", tab: "Facebook", tabIcon: "facebook", title: "Facebook comment → reply + private message → order taken → order list",
    steps: [
      { app: "facebook", name: "Facebook comment", body: <div className="flex flex-col gap-1.5"><Post from="#f4a259" to="#bc4b51" /><Bubble side="l"><b>Chioma:</b> Price?</Bubble></div> },
      { app: "bombin", name: "Bombin AI", body: <div className="flex flex-col gap-1.5"><Bubble side="r" tone="cyan">Replied: &ldquo;Sent you a message! 📩&rdquo;</Bubble><Bubble side="r" tone="cyan">DM: Hi Chioma! It&apos;s ₦18,000. Where should we deliver?</Bubble></div> },
      { app: "form", name: "Order details", body: <div className="grid gap-1.5"><Field label="Name" value="Chioma O." /><Field label="Item" value="Ankara bag" /><Field label="Deliver to" value="Yaba, Lagos" /></div> },
      { app: "orders", name: "Order list", body: <Sheet head={["Order", "Customer", "Status"]} rows={[["#1041", "Ife", "Shipped"]]} hot={["#1042", "Chioma", "New"]} /> },
    ],
  },
  {
    id: "tiktok", tab: "TikTok", tabIcon: "tiktok", title: "TikTok comment → DM with link → follow-up email → saved to CRM",
    steps: [
      { app: "tiktok", name: "TikTok comment", body: <div className="flex flex-col gap-1.5"><Post from="#3a1f2b" to="#c4807a" /><Bubble side="l"><b>@tobi:</b> I want this 😍</Bubble></div> },
      { app: "bombin", name: "Bombin AI", body: <Bubble side="r" tone="cyan">Hi Tobi! Here&apos;s the link to order 👉 glowra.ng/set</Bubble> },
      { app: "gmail", name: "Follow-up email", body: <Mail from="Glowra Skin" subject="Your glow set is waiting for you ✨" sent /> },
      { app: "crm", name: "CRM", body: <div className="rounded-lg border border-[#e3e8ef] bg-white p-2.5"><div className="flex items-center gap-2"><span className="h-7 w-7 rounded-full bg-gradient-to-br from-[#01C4FA] to-[#233067]" /><div><div className="text-[12px] font-bold text-[#1c2233]">Tobi A.</div><div className="text-[11px] text-[#8a93a6]">Source: TikTok</div></div></div><div className="mt-2 inline-flex rounded-full bg-[#e6f6ec] px-2 py-0.5 text-[10px] font-bold text-[#0f6b3a]">New contact · Interested</div></div> },
    ],
  },
  {
    id: "email", tab: "Email", tabIcon: "gmail", title: "Invoice email → amount and date read → accounts updated → confirmation sent",
    steps: [
      { app: "gmail", name: "Gmail inbox", body: <Mail from="Prime Supplies" subject="Invoice INV-2041 for December" attach="INV-2041.pdf" /> },
      { app: "bombin", name: "Bombin AI", body: <div className="grid gap-1.5"><Field label="Amount" value="₦185,000" /><Field label="Date" value="12 Dec" /><Field label="Supplier" value="Prime Supplies" /></div> },
      { app: "googlesheets", name: "Accounting sheet", body: <Sheet head={["Date", "Supplier", "Amount"]} rows={[["10 Dec", "Kola Prints", "₦42,000"]]} hot={["12 Dec", "Prime Supplies", "₦185,000"]} /> },
      { app: "gmail", name: "Confirmation email", body: <Mail from="You" subject="Logged: INV-2041, ₦185,000. Thank you!" sent /> },
    ],
  },
  {
    id: "whatsapp", tab: "WhatsApp", tabIcon: "whatsapp", title: "Payment screenshot → details checked → marked paid → customer told",
    steps: [
      { app: "whatsapp", name: "WhatsApp", body: <div className="flex flex-col gap-1.5"><div className="self-start rounded-xl bg-white p-1.5 shadow-sm"><div className="flex h-14 w-24 flex-col justify-center rounded-lg bg-gradient-to-br from-[#e8f5ff] to-[#cfe3f7] px-2 text-[9px] text-[#1c2233]"><span className="flex items-center gap-1 font-bold"><ImageIcon size={9} /> Transfer</span><span className="text-[11px] font-extrabold">₦25,000</span><span>Successful</span></div></div><Bubble side="l">I don pay o 🙏</Bubble></div> },
      { app: "bombin", name: "Bombin AI", body: <div className="flex flex-col gap-1.5">{["Amount matches ₦25,000", "Account name correct", "Order #2087 found"].map((x) => <div key={x} className="flex items-center gap-1.5 rounded-lg bg-[#e6f6ec] px-2 py-1 text-[11px] font-semibold text-[#0f6b3a]"><Check size={12} /> {x}</div>)}</div> },
      { app: "googlesheets", name: "Orders sheet", body: <Sheet head={["Order", "Amount", "Status"]} rows={[["#2086", "₦12,000", "Paid"]]} hot={["#2087", "₦25,000", "Paid ✓"]} /> },
      { app: "whatsapp", name: "WhatsApp reply", body: <Bubble side="r" tone="green">Payment received, your order is on the way 🚚</Bubble> },
    ],
  },
  {
    id: "website", tab: "Website", tabIcon: "form", title: "Website form → lead scored → call booked → reminders sent",
    steps: [
      { app: "form", name: "Website form", body: <div className="grid gap-1.5"><Field label="Name" value="Ngozi E." /><Field label="Needs" value="Wedding planning" /><Field label="Budget" value="₦5,000,000" /></div> },
      { app: "bombin", name: "Bombin AI", body: <div className="flex flex-col gap-1.5"><div className="self-start rounded-full bg-[#fff1e6] px-2.5 py-1 text-[11px] font-bold text-[#c2410c]">🔥 Hot lead</div><Bubble side="r" tone="cyan">Ready to book. Suggest a call this week.</Bubble></div> },
      { app: "googlecalendar", name: "Google Calendar", body: <div className="rounded-lg border border-[#e3e8ef] bg-white p-2"><div className="text-[10px] font-bold uppercase text-[#8a93a6]">Tuesday</div><div className="mt-1 rounded-md border-l-4 border-[#4285F4] bg-[#e8f0fe] px-2 py-1.5"><div className="text-[12px] font-bold text-[#1c2233]">Call with Ngozi</div><div className="text-[11px] text-[#5b6476]">10:00 – 10:30</div></div></div> },
      { app: ["whatsapp", "gmail"], name: "Reminders", body: <div className="flex flex-col gap-1.5"><Bubble side="l" tone="green">Reminder: your call is tomorrow at 10:00 ⏰</Bubble><Mail from="Owambe Nights" subject="See you on Tuesday at 10:00" sent /></div> },
    ],
  },
];

/* ── App identity chip ── */
function AppIcon({ kind, size = 28 }: { kind: AppKind; size?: number }) {
  if (kind === "bombin") {
    return (
      <span className="flex shrink-0 items-center justify-center rounded-lg bg-[#0b1230] ring-1 ring-[#01C4FA]/40" style={{ width: size, height: size }}>
        <Image src="/logo-mark.png" alt="" width={size} height={size} className="h-[90%] w-[90%] object-contain" />
      </span>
    );
  }
  if (kind === "crm" || kind === "orders" || kind === "form") {
    const Icon = kind === "crm" ? Users : kind === "orders" ? ClipboardList : Globe;
    return (
      <span className="flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#01C4FA] to-[#233067] text-white" style={{ width: size, height: size }}>
        <Icon size={size * 0.55} />
      </span>
    );
  }
  const b = BRAND_ICONS[kind];
  return (
    <span className="flex shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-black/5" style={{ width: size, height: size }}>
      <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6} role="img" aria-label={b.title}>
        <path d={b.path} fill={b.hex} />
      </svg>
    </span>
  );
}

/* ── One card ── */
function StepCard({ step, lit, current, thinking }: { step: Step; lit: boolean; current: boolean; thinking: boolean }) {
  const apps = Array.isArray(step.app) ? step.app : [step.app];
  const isAI = apps[0] === "bombin";
  return (
    <div
      className={`relative w-full rounded-2xl border p-3 transition-all duration-500 ${
        lit
          ? "border-[#01C4FA]/55 bg-[#0d1733]/80 shadow-[0_0_0_1px_rgba(1,196,250,0.25),0_0_26px_rgba(1,196,250,0.22)] light:bg-white/90"
          : "border-[var(--border-card)] bg-[var(--bg-card)] opacity-45"
      } ${current ? "scale-[1.02]" : ""}`}
    >
      <div className="mb-2.5 flex items-center gap-2">
        <span className="flex -space-x-1.5">{apps.map((a) => <AppIcon key={a} kind={a} />)}</span>
        <span className="truncate text-[13px] font-bold text-[var(--text-primary)]">{step.name}</span>
      </div>
      <div className="flex min-h-[92px] flex-col justify-center gap-1.5 rounded-xl bg-[#f7f9fc] p-2">
        {isAI && thinking ? (
          <div className="flex items-center gap-2 self-start rounded-2xl rounded-tl-sm bg-[#eef0f4] px-3 py-2.5" aria-label="Thinking">
            {[0, 1, 2].map((i) => <span key={i} className="flow-anim h-1.5 w-1.5 rounded-full bg-[#01C4FA]" style={{ animation: `flow-think 1s ${i * 0.15}s infinite ease-in-out` }} />)}
            <span className="text-[11px] font-semibold text-[#5b6476]">Thinking…</span>
          </div>
        ) : (
          <div className={`flex flex-col gap-1.5 transition-opacity duration-500 ${lit ? "opacity-100" : "opacity-70"}`}>{step.body}</div>
        )}
      </div>
    </div>
  );
}

/* ── Line between cards with a travelling light pulse ── */
function Connector({ done, running, vertical }: { done: boolean; running: boolean; vertical: boolean }) {
  return (
    <div className={`relative shrink-0 ${vertical ? "mx-auto h-9 w-[3px]" : "my-auto h-[3px] w-full min-w-[20px]"}`} aria-hidden="true">
      <div className={`absolute inset-0 rounded-full transition-all duration-500 ${done ? "bg-[#01C4FA] shadow-[0_0_12px_rgba(1,196,250,0.8)]" : "bg-[var(--text-faint)]"}`} />
      {running && (
        <span
          key={String(running)}
          className={`flow-anim absolute h-3 w-3 rounded-full bg-white shadow-[0_0_14px_4px_rgba(1,196,250,0.9)] ${vertical ? "left-1/2 -translate-x-1/2" : "top-1/2 -translate-y-1/2"}`}
          style={{ animation: `${vertical ? "flow-pulse-y" : "flow-pulse-x"} 0.7s ease-in-out forwards` }}
        />
      )}
    </div>
  );
}

/* ── Runs one flow: lights each step in turn, AI "thinks", then loops ── */
function FlowRunner({ flow, vertical }: { flow: Flow; vertical: boolean }) {
  const n = flow.steps.length;
  const [active, setActive] = useState(0);
  const [thinking, setThinking] = useState(false);
  const [running, setRunning] = useState(-1); // connector index currently pulsing
  const box = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = box.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setActive(n - 1); setThinking(false); setRunning(-1); return; }
    if (!visible) return;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) => new Promise<void>((res) => { timers.push(setTimeout(res, ms)); });
    (async () => {
      while (!cancelled) {
        setActive(0); setThinking(false); setRunning(-1);
        await wait(1300);
        for (let i = 1; i < n && !cancelled; i++) {
          setRunning(i - 1);
          await wait(700);
          if (cancelled) return;
          setRunning(-1);
          setActive(i);
          const isAI = (Array.isArray(flow.steps[i].app) ? flow.steps[i].app[0] : flow.steps[i].app) === "bombin";
          if (isAI) { setThinking(true); await wait(1200); if (cancelled) return; setThinking(false); }
          await wait(1100);
        }
        await wait(2400);
      }
    })();
    return () => { cancelled = true; timers.forEach(clearTimeout); };
  }, [flow, n, visible]);

  return (
    <div ref={box} className={`flex ${vertical ? "mx-auto max-w-sm flex-col" : "flex-row items-stretch"} `}>
      {flow.steps.map((s, i) => (
        <div key={i} className={`flex ${vertical ? "flex-col" : "min-w-0 flex-1 flex-row items-center"}`}>
          {i > 0 && (
            <div className={vertical ? "" : "w-8 shrink-0 self-center xl:w-10"}>
              <Connector done={active >= i} running={running === i - 1} vertical={vertical} />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <StepCard step={s} lit={active >= i} current={active === i} thinking={thinking && active === i} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AutomationShowcase() {
  const [tab, setTab] = useState(0);
  const [isWide, setIsWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const on = () => setIsWide(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  const flow = FLOWS[tab];

  return (
    <section aria-labelledby="asc-title" className="relative mx-auto mb-16 max-w-6xl px-4 sm:px-6">
      <div className="pointer-events-none absolute left-1/2 top-28 z-0 h-72 w-[80%] -translate-x-1/2 rounded-full bg-[#01C4FA]/[0.08] blur-3xl" aria-hidden="true" />
      <div id="asc-title" className="relative z-10">
        <ShowcaseHeading title="Watch your business run itself" sub="Real-world automations we can build around the apps you already use." />
      </div>

      <div className="relative z-10">
        <div role="tablist" aria-label="Automation examples" className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:justify-center [&::-webkit-scrollbar]:hidden">
          {FLOWS.map((f, i) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              id={`flow-tab-${f.id}`}
              aria-selected={tab === i}
              aria-controls="flow-panel"
              onClick={(e) => { setTab(i); e.currentTarget.scrollIntoView({ inline: "nearest", block: "nearest" }); }}
              style={{ touchAction: "manipulation" }}
              className={`pointer-events-auto relative z-30 flex shrink-0 cursor-pointer touch-action-manipulation items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition-all ${
                tab === i
                  ? "border-[#01C4FA]/70 bg-[#01C4FA]/12 text-[var(--text-primary)] shadow-[0_0_18px_rgba(1,196,250,0.25)]"
                  : "border-[var(--border-card)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:border-[#01C4FA]/40"
              }`}
            >
              <AppIcon kind={f.tabIcon} size={20} />
              {f.tab}
            </button>
          ))}
        </div>

        <div id="flow-panel" role="tabpanel" aria-labelledby={`flow-tab-${flow.id}`} className="glass-card-static rounded-3xl p-4 shadow-[0_20px_60px_rgba(0,0,0,0.25)] sm:p-6 light:shadow-[0_20px_50px_rgba(35,48,103,0.1)]">
          <p className="mb-5 text-center text-[15px] font-bold text-[var(--text-primary)] sm:text-base">{flow.title}</p>
          <FlowRunner key={`${flow.id}-${isWide}`} flow={flow} vertical={!isWide} />
        </div>
      </div>

      <div className="relative z-10 mt-8 flex justify-center">
        <a
          href="#calculator"
          style={{ touchAction: "manipulation" }}
          className="btn-gradient btn-ready pointer-events-auto relative z-30 flex cursor-pointer touch-action-manipulation items-center gap-2 px-7 py-3.5 text-base font-bold text-white"
        >
          Get your price
          <ArrowDown className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

