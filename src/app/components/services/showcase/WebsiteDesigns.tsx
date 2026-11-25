"use client";

import type { CSSProperties, ReactNode } from "react";
import {
  ArrowRight, BarChart3, Bath, BedDouble, Bell, BookOpen, CalendarDays, Check, ChefHat, ChevronRight, CircleDollarSign,
  Clock, CreditCard, GraduationCap, Heart, Home, LayoutDashboard, Lock, MapPin, Package, Search, ShieldCheck, ShoppingBag,
  SlidersHorizontal, Truck, User, Users, Wallet,
} from "lucide-react";

/*
 * Six website / web-app designs for the Website Development showcase (Step 4B).
 * Drawn entirely in code. Brand names are invented: Luxe Atelier, Ember & Spice,
 * Nestora Homes, Vaultly, Lumora Academy, Swiftlane. No real clients, reviews or results.
 *
 * Desktop screens are drawn at 960 × 600, phone screens at 300 × 640, then scaled to fit.
 */

export const DESK = { w: 960, h: 600 };
export const MOB = { w: 300, h: 640 };

type Theme = { bg: string; panel: string; ink: string; soft: string; accent: string; accent2: string; line: string; font?: string };

const T = {
  fashion: { bg: "#f6f1ea", panel: "#ffffff", ink: "#1b1714", soft: "#8a7f74", accent: "#b08d57", accent2: "#1b1714", line: "#e6ddd1", font: "Georgia, 'Times New Roman', serif" },
  food: { bg: "#140c0a", panel: "#1f1512", ink: "#fbeee6", soft: "#c4a99b", accent: "#f2662f", accent2: "#ffb547", line: "#3a2621" },
  estate: { bg: "#f3f7f5", panel: "#ffffff", ink: "#0f2a22", soft: "#5f7a71", accent: "#0f8a62", accent2: "#0f2a22", line: "#dce8e3" },
  fintech: { bg: "#0b1220", panel: "#111b2e", ink: "#e8f0ff", soft: "#8ea0bf", accent: "#22c39a", accent2: "#3d8bff", line: "#1e2b44" },
  school: { bg: "#f7f8fc", panel: "#ffffff", ink: "#1a2340", soft: "#6b7491", accent: "#f2a516", accent2: "#2b4acb", line: "#e4e7f2" },
  logistics: { bg: "#0e0f12", panel: "#17191e", ink: "#f4f4f5", soft: "#9ca0aa", accent: "#ff7a1a", accent2: "#ffd166", line: "#272a31" },
} satisfies Record<string, Theme>;

/* ── Tiny drawing helpers ── */
const Screen = ({ t, children, style }: { t: Theme; children: ReactNode; style?: CSSProperties }) => (
  <div style={{ width: "100%", height: "100%", background: t.bg, color: t.ink, fontFamily: t.font ?? "Inter, system-ui, sans-serif", overflow: "hidden", position: "relative", ...style }}>{children}</div>
);
const Bar = ({ w, h = 8, c, r = 4, style }: { w: number | string; h?: number; c: string; r?: number; style?: CSSProperties }) => (
  <div style={{ width: w, height: h, background: c, borderRadius: r, ...style }} />
);
const Pill = ({ children, bg, fg, style }: { children: ReactNode; bg: string; fg: string; style?: CSSProperties }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: bg, color: fg, borderRadius: 999, padding: "6px 14px", fontSize: 13, fontWeight: 600, ...style }}>{children}</span>
);
const Art = ({ from, to, children, style }: { from: string; to: string; children?: ReactNode; style?: CSSProperties }) => (
  <div style={{ background: `linear-gradient(135deg, ${from}, ${to})`, borderRadius: 12, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", ...style }}>
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.35), transparent 55%)" }} />
    {children}
  </div>
);
const Nav = ({ t, brand, links, cta }: { t: Theme; brand: ReactNode; links: string[]; cta?: string }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 36px", borderBottom: `1px solid ${t.line}` }}>
    <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: 0.3 }}>{brand}</div>
    <div style={{ display: "flex", gap: 26, fontSize: 13, color: t.soft }}>{links.map((l) => <span key={l}>{l}</span>)}</div>
    {cta ? <Pill bg={t.accent} fg="#fff">{cta}</Pill> : <ShoppingBag size={20} />}
  </div>
);

/* ═══════════════ 1. Luxe Atelier — fashion e-commerce ═══════════════ */
const fashionHome = () => {
  const t = T.fashion;
  const items = [["Aso-Oke Wrap Dress", "₦85,000", "#c9a27a", "#6e4b2a"], ["Silk Kaftan", "₦62,000", "#d8c3a5", "#8b6b4a"], ["Ankara Two-Piece", "₦48,500", "#b8865b", "#4a3020"], ["Linen Agbada", "₦120,000", "#e2d4bf", "#9a7b57"]];
  return (
    <Screen t={t}>
      <Nav t={t} brand={<span>LUXE <span style={{ color: t.accent }}>ATELIER</span></span>} links={["New In", "Women", "Men", "Occasion", "Sale"]} />
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 28, padding: "30px 36px" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: 12, letterSpacing: 3, color: t.accent, fontWeight: 700 }}>NEW SEASON · OWAMBE EDIT</div>
          <div style={{ fontSize: 46, lineHeight: 1.05, marginTop: 12 }}>Dressed for every<br />celebration.</div>
          <div style={{ fontSize: 14, color: t.soft, marginTop: 14, maxWidth: 340 }}>Handcrafted pieces in rich fabrics. Free delivery in Lagos and Abuja.</div>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <Pill bg={t.ink} fg="#fff" style={{ padding: "10px 22px" }}>Shop the edit <ArrowRight size={14} /></Pill>
            <Pill bg="transparent" fg={t.ink} style={{ border: `1px solid ${t.ink}`, padding: "10px 22px" }}>Book a fitting</Pill>
          </div>
        </div>
        <Art from="#d9b88f" to="#5a3a22" style={{ height: 250 }}>
          <div style={{ width: 120, height: 190, borderRadius: "60px 60px 12px 12px", background: "linear-gradient(180deg,#f3e3cc,#a87a4f)", boxShadow: "0 20px 40px rgba(0,0,0,0.25)" }} />
        </Art>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, padding: "0 36px" }}>
        {items.map(([n, p, a, b]) => (
          <div key={n} style={{ background: t.panel, borderRadius: 12, padding: 10, border: `1px solid ${t.line}` }}>
            <Art from={a} to={b} style={{ height: 120 }}><Heart size={16} color="#fff" style={{ position: "absolute", top: 10, right: 10 }} /></Art>
            <div style={{ fontSize: 13, marginTop: 8 }}>{n}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: t.accent, fontFamily: "Inter, system-ui, sans-serif" }}>{p}</div>
          </div>
        ))}
      </div>
    </Screen>
  );
};
const fashionProduct = () => {
  const t = T.fashion;
  return (
    <Screen t={t}>
      <Nav t={t} brand={<span>LUXE <span style={{ color: t.accent }}>ATELIER</span></span>} links={["New In", "Women", "Men", "Occasion", "Sale"]} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36, padding: "28px 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "70px 1fr", gap: 12 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {["#d6b48a", "#a8794c", "#e8d6bd", "#7a5232"].map((c) => <Art key={c} from={c} to="#4a2f1b" style={{ height: 80, borderRadius: 8 }} />)}
          </div>
          <Art from="#e0c29c" to="#5a3a22" style={{ height: 360 }}>
            <div style={{ width: 130, height: 260, borderRadius: "65px 65px 14px 14px", background: "linear-gradient(180deg,#f6e8d4,#b0835a)" }} />
          </Art>
        </div>
        <div>
          <div style={{ fontSize: 12, letterSpacing: 2, color: t.soft }}>WOMEN · DRESSES</div>
          <div style={{ fontSize: 34, marginTop: 8 }}>Aso-Oke Wrap Dress</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: t.accent, marginTop: 8, fontFamily: "Inter, system-ui, sans-serif" }}>₦85,000</div>
          <div style={{ fontSize: 13, color: t.soft, marginTop: 14, lineHeight: 1.6 }}>Hand-woven aso-oke with a flattering wrap waist. Made to order in 5 days.</div>
          <div style={{ fontSize: 12, fontWeight: 700, marginTop: 22, fontFamily: "Inter, system-ui, sans-serif" }}>SIZE</div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            {["8", "10", "12", "14", "16"].map((s, i) => (
              <div key={s} style={{ width: 44, height: 40, border: `1px solid ${i === 2 ? t.ink : t.line}`, background: i === 2 ? t.ink : t.panel, color: i === 2 ? "#fff" : t.ink, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontFamily: "Inter, system-ui, sans-serif" }}>{s}</div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <Pill bg={t.ink} fg="#fff" style={{ padding: "13px 28px", fontSize: 14 }}><ShoppingBag size={15} /> Add to bag</Pill>
            <Pill bg="transparent" fg={t.ink} style={{ border: `1px solid ${t.line}`, padding: "13px 16px" }}><Heart size={15} /></Pill>
          </div>
          <div style={{ display: "flex", gap: 18, marginTop: 22, fontSize: 12, color: t.soft, fontFamily: "Inter, system-ui, sans-serif" }}>
            <span style={{ display: "flex", gap: 6, alignItems: "center" }}><Truck size={14} /> Delivery in 2–4 days</span>
            <span style={{ display: "flex", gap: 6, alignItems: "center" }}><ShieldCheck size={14} /> Secure checkout</span>
          </div>
        </div>
      </div>
    </Screen>
  );
};
const fashionCheckout = () => {
  const t = T.fashion;
  return (
    <Screen t={t} style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <Nav t={t} brand={<span style={{ fontFamily: t.font }}>LUXE <span style={{ color: t.accent }}>ATELIER</span></span>} links={["Bag", "Delivery", "Payment"]} />
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 28, padding: "28px 48px" }}>
        <div style={{ background: t.panel, borderRadius: 16, padding: 24, border: `1px solid ${t.line}` }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Delivery details</div>
          {["Full name", "Phone number", "Address", "City / State"].map((f) => (
            <div key={f} style={{ marginTop: 14 }}>
              <div style={{ fontSize: 11, color: t.soft, marginBottom: 6 }}>{f}</div>
              <div style={{ height: 40, border: `1px solid ${t.line}`, borderRadius: 10, background: t.bg }} />
            </div>
          ))}
        </div>
        <div style={{ background: t.panel, borderRadius: 16, padding: 24, border: `1px solid ${t.line}` }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Your bag</div>
          {[["Aso-Oke Wrap Dress · 12", "₦85,000"], ["Silk Kaftan · M", "₦62,000"]].map(([n, p]) => (
            <div key={n} style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 16 }}>
              <Art from="#d9b88f" to="#5a3a22" style={{ width: 52, height: 60, borderRadius: 8 }} />
              <div style={{ flex: 1, fontSize: 13 }}>{n}</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{p}</div>
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${t.line}`, marginTop: 18, paddingTop: 14, display: "flex", justifyContent: "space-between", fontSize: 13, color: t.soft }}><span>Delivery</span><span>₦3,500</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 800, marginTop: 8 }}><span>Total</span><span>₦150,500</span></div>
          <div style={{ marginTop: 18, background: "#0ba4db", color: "#fff", borderRadius: 12, padding: "14px 0", textAlign: "center", fontWeight: 700, fontSize: 14, display: "flex", justifyContent: "center", gap: 8, alignItems: "center" }}>
            <Lock size={15} /> Pay ₦150,500 with Paystack
          </div>
          <div style={{ fontSize: 11, color: t.soft, textAlign: "center", marginTop: 10 }}>Cards, bank transfer and USSD</div>
        </div>
      </div>
    </Screen>
  );
};
const fashionMobile = () => {
  const t = T.fashion;
  return (
    <Screen t={t}>
      <div style={{ padding: "34px 16px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 800, fontSize: 16 }}>LUXE <span style={{ color: t.accent }}>ATELIER</span></div>
        <ShoppingBag size={18} />
      </div>
      <Art from="#d9b88f" to="#5a3a22" style={{ height: 230, margin: "6px 16px", borderRadius: 16, alignItems: "flex-end", justifyContent: "flex-start", padding: 16 }}>
        <div style={{ color: "#fff", fontSize: 24, lineHeight: 1.1, position: "relative" }}>Owambe<br />Edit</div>
      </Art>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "12px 16px" }}>
        {[["Wrap Dress", "₦85,000", "#c9a27a"], ["Silk Kaftan", "₦62,000", "#d8c3a5"], ["Two-Piece", "₦48,500", "#b8865b"], ["Agbada", "₦120,000", "#e2d4bf"]].map(([n, p, c]) => (
          <div key={n}>
            <Art from={c} to="#4a3020" style={{ height: 110 }} />
            <div style={{ fontSize: 12, marginTop: 6 }}>{n}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: t.accent, fontFamily: "Inter, system-ui, sans-serif" }}>{p}</div>
          </div>
        ))}
      </div>
    </Screen>
  );
};

/* ═══════════════ 2. Ember & Spice — restaurant ═══════════════ */
const dish = (n: string, d: string, p: string, a: string, b: string, t: Theme) => (
  <div key={n} style={{ display: "flex", gap: 14, alignItems: "center", background: t.panel, border: `1px solid ${t.line}`, borderRadius: 14, padding: 12 }}>
    <Art from={a} to={b} style={{ width: 76, height: 76, borderRadius: "50%", flexShrink: 0 }}><div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.25)" }} /></Art>
    <div style={{ flex: 1 }}>
      <div style={{ fontWeight: 700, fontSize: 15 }}>{n}</div>
      <div style={{ fontSize: 12, color: t.soft, marginTop: 3 }}>{d}</div>
    </div>
    <div style={{ textAlign: "right" }}>
      <div style={{ fontWeight: 800, color: t.accent2 }}>{p}</div>
      <div style={{ marginTop: 6, width: 30, height: 30, borderRadius: 10, background: t.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginLeft: "auto" }}>+</div>
    </div>
  </div>
);
const foodMenu = () => {
  const t = T.food;
  return (
    <Screen t={t}>
      <Nav t={t} brand={<span>Ember <span style={{ color: t.accent }}>&amp;</span> Spice</span>} links={["Menu", "Book a table", "Catering", "Contact"]} cta="Order now" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 28, padding: "26px 36px" }}>
        <div>
          <div style={{ fontSize: 12, letterSpacing: 3, color: t.accent2, fontWeight: 700 }}>SMOKY · SPICY · LOCAL</div>
          <div style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.05, marginTop: 10 }}>Party jollof,<br />any day.</div>
          <div style={{ fontSize: 14, color: t.soft, marginTop: 12 }}>Order for delivery in 45 minutes, or book your table tonight.</div>
          <div style={{ display: "flex", gap: 8, marginTop: 18, flexWrap: "wrap" }}>
            {["Rice", "Grills", "Soups", "Drinks"].map((c, i) => <Pill key={c} bg={i === 0 ? t.accent : t.panel} fg={i === 0 ? "#fff" : t.soft} style={{ border: `1px solid ${t.line}` }}>{c}</Pill>)}
          </div>
          <Art from="#ff8a3d" to="#7a1d0c" style={{ height: 170, marginTop: 20, borderRadius: 18 }}><ChefHat size={56} color="rgba(255,255,255,0.85)" /></Art>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {dish("Smoky Party Jollof", "With fried plantain and grilled chicken", "₦6,500", "#ff8a3d", "#a3260f", t)}
          {dish("Peppered Goat Meat", "Slow-cooked, extra spicy", "₦5,000", "#c2410c", "#5a1a0b", t)}
          {dish("Seafood Okra", "With pounded yam or eba", "₦8,500", "#84a33a", "#2f4a12", t)}
          {dish("Suya Platter", "Beef suya, onions, yaji spice", "₦7,000", "#d97706", "#6b2c09", t)}
        </div>
      </div>
    </Screen>
  );
};
const foodBooking = () => {
  const t = T.food;
  return (
    <Screen t={t}>
      <Nav t={t} brand={<span>Ember <span style={{ color: t.accent }}>&amp;</span> Spice</span>} links={["Menu", "Book a table", "Catering", "Contact"]} cta="Order now" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, padding: "30px 48px" }}>
        <div style={{ background: t.panel, border: `1px solid ${t.line}`, borderRadius: 18, padding: 26 }}>
          <div style={{ fontSize: 24, fontWeight: 800 }}>Book a table</div>
          <div style={{ fontSize: 13, color: t.soft, marginTop: 6 }}>We&apos;ll confirm on WhatsApp.</div>
          <div style={{ fontSize: 12, fontWeight: 700, marginTop: 20, color: t.soft }}>DATE</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginTop: 8 }}>
            {["Mon 9", "Tue 10", "Wed 11", "Thu 12", "Fri 13", "Sat 14", "Sun 15"].map((d, i) => (
              <div key={d} style={{ background: i === 4 ? t.accent : t.bg, color: i === 4 ? "#fff" : t.ink, border: `1px solid ${t.line}`, borderRadius: 10, padding: "8px 0", textAlign: "center", fontSize: 11, fontWeight: 600 }}>{d.split(" ")[0]}<br /><span style={{ fontSize: 15 }}>{d.split(" ")[1]}</span></div>
            ))}
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, marginTop: 18, color: t.soft }}>TIME</div>
          <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
            {["6:00 pm", "6:30 pm", "7:00 pm", "7:30 pm", "8:00 pm"].map((x, i) => <Pill key={x} bg={i === 2 ? t.accent2 : t.bg} fg={i === 2 ? "#1f1512" : t.ink} style={{ border: `1px solid ${t.line}` }}>{x}</Pill>)}
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, marginTop: 18, color: t.soft }}>GUESTS</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${t.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}>−</div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>4</div>
            <div style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${t.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}>+</div>
          </div>
          <div style={{ marginTop: 22, background: t.accent, borderRadius: 12, padding: "13px 0", textAlign: "center", fontWeight: 800 }}>Confirm booking</div>
        </div>
        <Art from="#ff8a3d" to="#3a0f08" style={{ borderRadius: 18 }}>
          <div style={{ position: "absolute", bottom: 22, left: 22, right: 22, background: "rgba(20,12,10,0.75)", borderRadius: 14, padding: 16, backdropFilter: "blur(6px)" }}>
            <div style={{ fontWeight: 800, fontSize: 16 }}>Friday, 7:00 pm · 4 guests</div>
            <div style={{ fontSize: 12, color: t.soft, marginTop: 4, display: "flex", gap: 6, alignItems: "center" }}><MapPin size={13} /> Ember &amp; Spice, Victoria Island</div>
          </div>
        </Art>
      </div>
    </Screen>
  );
};
const foodTracking = () => {
  const t = T.food;
  const steps = [["Order received", "7:02 pm", true], ["Cooking your food", "7:05 pm", true], ["Rider on the way", "7:31 pm", true], ["Delivered", "About 7:50 pm", false]] as const;
  return (
    <Screen t={t}>
      <Nav t={t} brand={<span>Ember <span style={{ color: t.accent }}>&amp;</span> Spice</span>} links={["Menu", "Book a table", "Catering", "Contact"]} cta="Order now" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, padding: "30px 48px" }}>
        <div style={{ background: t.panel, border: `1px solid ${t.line}`, borderRadius: 18, padding: 26 }}>
          <div style={{ fontSize: 13, color: t.soft }}>Order #ES-2481</div>
          <div style={{ fontSize: 26, fontWeight: 800, marginTop: 4 }}>Your food is on the way</div>
          <div style={{ marginTop: 22 }}>
            {steps.map(([n, time, done], i) => (
              <div key={n} style={{ display: "flex", gap: 14, minHeight: 58 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: done ? t.accent : t.bg, border: `2px solid ${done ? t.accent : t.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}>{done && <Check size={13} color="#fff" />}</div>
                  {i < steps.length - 1 && <div style={{ width: 2, flex: 1, background: done ? t.accent : t.line }} />}
                </div>
                <div><div style={{ fontWeight: 700 }}>{n}</div><div style={{ fontSize: 12, color: t.soft }}>{time}</div></div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: t.panel, border: `1px solid ${t.line}`, borderRadius: 18, padding: 22, position: "relative", overflow: "hidden" }}>
          <svg viewBox="0 0 400 300" width="100%" height="230">
            <rect width="400" height="300" fill="#24160f" />
            {[60, 140, 220].map((y) => <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#3a2621" strokeWidth="10" />)}
            {[90, 210, 320].map((x) => <line key={x} x1={x} y1="0" x2={x} y2="300" stroke="#3a2621" strokeWidth="10" />)}
            <path d="M40 260 L90 220 L90 140 L210 140 L210 60 L330 60" fill="none" stroke={t.accent} strokeWidth="5" strokeLinecap="round" strokeDasharray="10 8" />
            <circle cx="210" cy="100" r="11" fill={t.accent2} />
            <circle cx="330" cy="60" r="9" fill="#fff" />
          </svg>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: t.accent, display: "flex", alignItems: "center", justifyContent: "center" }}><Truck size={20} color="#fff" /></div>
            <div style={{ flex: 1 }}><div style={{ fontWeight: 700 }}>Your rider, Tunde</div><div style={{ fontSize: 12, color: t.soft }}>About 18 minutes away</div></div>
          </div>
        </div>
      </div>
    </Screen>
  );
};
const foodMobile = () => {
  const t = T.food;
  return (
    <Screen t={t}>
      <div style={{ padding: "34px 16px 8px" }}>
        <div style={{ fontWeight: 800, fontSize: 16 }}>Ember <span style={{ color: t.accent }}>&amp;</span> Spice</div>
        <div style={{ fontSize: 24, fontWeight: 800, marginTop: 10, lineHeight: 1.1 }}>What are you<br />craving?</div>
      </div>
      <div style={{ display: "flex", gap: 6, padding: "6px 16px" }}>{["Rice", "Grills", "Soups"].map((c, i) => <Pill key={c} bg={i === 0 ? t.accent : t.panel} fg={i === 0 ? "#fff" : t.soft} style={{ fontSize: 11, padding: "5px 11px" }}>{c}</Pill>)}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "10px 16px" }}>
        {[["Party Jollof", "₦6,500", "#ff8a3d", "#a3260f"], ["Goat Meat", "₦5,000", "#c2410c", "#5a1a0b"], ["Seafood Okra", "₦8,500", "#84a33a", "#2f4a12"], ["Suya Platter", "₦7,000", "#d97706", "#6b2c09"]].map(([n, p, a, b]) => (
          <div key={n} style={{ display: "flex", gap: 10, alignItems: "center", background: t.panel, borderRadius: 14, padding: 9 }}>
            <Art from={a} to={b} style={{ width: 52, height: 52, borderRadius: "50%" }} />
            <div style={{ flex: 1, fontWeight: 700, fontSize: 13 }}>{n}</div>
            <div style={{ fontWeight: 800, fontSize: 13, color: t.accent2 }}>{p}</div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", bottom: 16, left: 16, right: 16, background: t.accent, borderRadius: 14, padding: "12px 0", textAlign: "center", fontWeight: 800, fontSize: 13 }}>View cart · ₦11,500</div>
    </Screen>
  );
};

/* ═══════════════ 3. Nestora Homes — real estate ═══════════════ */
const listing = (t: Theme, title: string, area: string, price: string, beds: number, a: string, b: string) => (
  <div key={title} style={{ background: t.panel, border: `1px solid ${t.line}`, borderRadius: 14, overflow: "hidden" }}>
    <Art from={a} to={b} style={{ height: 120, borderRadius: 0 }}>
      <Home size={34} color="rgba(255,255,255,0.85)" />
      <span style={{ position: "absolute", top: 10, left: 10, background: "#fff", color: t.accent, fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 999 }}>For sale</span>
    </Art>
    <div style={{ padding: 12 }}>
      <div style={{ fontWeight: 800, color: t.accent }}>{price}</div>
      <div style={{ fontWeight: 700, fontSize: 13, marginTop: 3 }}>{title}</div>
      <div style={{ fontSize: 12, color: t.soft, display: "flex", gap: 4, alignItems: "center", marginTop: 3 }}><MapPin size={12} /> {area}</div>
      <div style={{ display: "flex", gap: 12, fontSize: 12, color: t.soft, marginTop: 8 }}>
        <span style={{ display: "flex", gap: 4, alignItems: "center" }}><BedDouble size={13} /> {beds}</span>
        <span style={{ display: "flex", gap: 4, alignItems: "center" }}><Bath size={13} /> {beds}</span>
      </div>
    </div>
  </div>
);
const estateSearch = () => {
  const t = T.estate;
  return (
    <Screen t={t}>
      <Nav t={t} brand={<span>Nestora<span style={{ color: t.accent }}> Homes</span></span>} links={["Buy", "Rent", "Shortlet", "Agents"]} cta="List a property" />
      <div style={{ padding: "20px 36px" }}>
        <div style={{ display: "flex", gap: 10, background: t.panel, border: `1px solid ${t.line}`, borderRadius: 14, padding: 8 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, padding: "0 10px", color: t.soft, fontSize: 13 }}><Search size={15} /> Lekki, Ikoyi, Ajah…</div>
          {["Any type", "2+ beds", "₦50m – ₦150m"].map((f) => <Pill key={f} bg={t.bg} fg={t.ink} style={{ border: `1px solid ${t.line}` }}>{f}</Pill>)}
          <Pill bg={t.accent} fg="#fff"><SlidersHorizontal size={14} /> Filters</Pill>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", margin: "16px 0 12px", fontSize: 13 }}>
          <span style={{ fontWeight: 700 }}>Homes in Lagos</span><span style={{ color: t.soft }}>Sort: Newest</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {listing(t, "4-bed duplex", "Lekki Phase 1", "₦145,000,000", 4, "#5fb796", "#0f4d3a")}
          {listing(t, "3-bed terrace", "Ikate, Lekki", "₦85,000,000", 3, "#7cc4a7", "#1b5e4a")}
          {listing(t, "2-bed apartment", "Ikoyi", "₦120,000,000", 2, "#4aa080", "#0c3b2d")}
          {listing(t, "5-bed detached", "Ajah", "₦98,000,000", 5, "#89c9ad", "#246a52")}
        </div>
      </div>
    </Screen>
  );
};
const estateDetail = () => {
  const t = T.estate;
  return (
    <Screen t={t}>
      <Nav t={t} brand={<span>Nestora<span style={{ color: t.accent }}> Homes</span></span>} links={["Buy", "Rent", "Shortlet", "Agents"]} cta="List a property" />
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24, padding: "22px 36px" }}>
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 10 }}>
            <Art from="#5fb796" to="#0f4d3a" style={{ height: 260 }}><Home size={60} color="rgba(255,255,255,0.85)" /></Art>
            <div style={{ display: "grid", gap: 10 }}><Art from="#a6d8c3" to="#2b6e57" style={{ height: 125 }} /><Art from="#7cc4a7" to="#1b5e4a" style={{ height: 125 }} /></div>
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, marginTop: 14 }}>4-bed duplex with BQ</div>
          <div style={{ fontSize: 13, color: t.soft, display: "flex", gap: 6, alignItems: "center", marginTop: 4 }}><MapPin size={14} /> Lekki Phase 1, Lagos</div>
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            {[["4 beds", BedDouble], ["5 baths", Bath], ["Fully fitted", Check]].map(([l, I]) => {
              const Icon = I as typeof Bath;
              return <Pill key={l as string} bg={t.panel} fg={t.ink} style={{ border: `1px solid ${t.line}` }}><Icon size={14} /> {l as string}</Pill>;
            })}
          </div>
        </div>
        <div style={{ background: t.panel, border: `1px solid ${t.line}`, borderRadius: 16, padding: 22, alignSelf: "start" }}>
          <div style={{ fontSize: 13, color: t.soft }}>Price</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: t.accent }}>₦145,000,000</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 18 }}>
            <div style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg,#7cc4a7,#0f4d3a)" }} />
            <div><div style={{ fontWeight: 700 }}>Adaeze, agent</div><div style={{ fontSize: 12, color: t.soft }}>Replies within an hour</div></div>
          </div>
          <div style={{ marginTop: 18, background: t.accent, color: "#fff", borderRadius: 12, padding: "12px 0", textAlign: "center", fontWeight: 700 }}>Book a viewing</div>
          <div style={{ marginTop: 10, border: `1px solid ${t.line}`, borderRadius: 12, padding: "12px 0", textAlign: "center", fontWeight: 700 }}>Chat on WhatsApp</div>
        </div>
      </div>
    </Screen>
  );
};
const estateMap = () => {
  const t = T.estate;
  return (
    <Screen t={t}>
      <Nav t={t} brand={<span>Nestora<span style={{ color: t.accent }}> Homes</span></span>} links={["Buy", "Rent", "Shortlet", "Agents"]} cta="List a property" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", height: 520 }}>
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12, borderRight: `1px solid ${t.line}` }}>
          <div style={{ fontWeight: 800, fontSize: 18 }}>Map view</div>
          {[["3-bed terrace", "₦85,000,000"], ["2-bed apartment", "₦120,000,000"], ["5-bed detached", "₦98,000,000"]].map(([n, p], i) => (
            <div key={n} style={{ display: "flex", gap: 12, alignItems: "center", background: i === 0 ? "#e5f4ee" : t.panel, border: `1px solid ${i === 0 ? t.accent : t.line}`, borderRadius: 12, padding: 10 }}>
              <Art from="#7cc4a7" to="#1b5e4a" style={{ width: 64, height: 54, borderRadius: 8 }} />
              <div><div style={{ fontWeight: 700, fontSize: 13 }}>{n}</div><div style={{ color: t.accent, fontWeight: 800, fontSize: 13 }}>{p}</div></div>
            </div>
          ))}
        </div>
        <svg viewBox="0 0 520 520" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
          <rect width="520" height="520" fill="#e6efe9" />
          <path d="M0 380 Q 160 330 260 380 T 520 360 L520 520 L0 520 Z" fill="#bfe0ea" />
          {[100, 210, 300].map((y) => <line key={y} x1="0" y1={y} x2="520" y2={y - 30} stroke="#fff" strokeWidth="12" />)}
          {[120, 260, 400].map((x) => <line key={x} x1={x} y1="0" x2={x + 20} y2="380" stroke="#fff" strokeWidth="12" />)}
          {[[150, 160, "₦85m", true], [300, 120, "₦120m", false], [410, 250, "₦98m", false], [220, 280, "₦145m", false]].map(([x, y, l, a]) => (
            <g key={l as string}>
              <rect x={(x as number) - 34} y={(y as number) - 16} width="68" height="30" rx="15" fill={a ? t.accent : "#fff"} stroke={t.accent} strokeWidth="2" />
              <text x={x as number} y={(y as number) + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill={a ? "#fff" : t.accent} fontFamily="Inter, sans-serif">{l as string}</text>
            </g>
          ))}
        </svg>
      </div>
    </Screen>
  );
};
const estateMobile = () => {
  const t = T.estate;
  return (
    <Screen t={t}>
      <div style={{ padding: "34px 14px 8px" }}>
        <div style={{ fontWeight: 800, fontSize: 16 }}>Nestora<span style={{ color: t.accent }}> Homes</span></div>
        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8, background: t.panel, border: `1px solid ${t.line}`, borderRadius: 12, padding: "10px 12px", fontSize: 12, color: t.soft }}><Search size={14} /> Search Lekki, Ikoyi…</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "6px 14px" }}>
        {listing(t, "4-bed duplex", "Lekki Phase 1", "₦145,000,000", 4, "#5fb796", "#0f4d3a")}
        {listing(t, "3-bed terrace", "Ikate, Lekki", "₦85,000,000", 3, "#7cc4a7", "#1b5e4a")}
      </div>
    </Screen>
  );
};

/* ═══════════════ 4. Vaultly — business / fintech dashboard ═══════════════ */
const side = (t: Theme, active: number) => (
  <div style={{ width: 190, background: t.panel, borderRight: `1px solid ${t.line}`, padding: "20px 14px", display: "flex", flexDirection: "column", gap: 4 }}>
    <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 16, display: "flex", gap: 8, alignItems: "center" }}><Wallet size={18} color={t.accent} /> Vaultly</div>
    {[["Overview", LayoutDashboard], ["Payments", CreditCard], ["Invoices", BookOpen], ["Customers", Users], ["Reports", BarChart3]].map(([l, I], i) => {
      const Icon = I as typeof Wallet;
      return (
        <div key={l as string} style={{ display: "flex", gap: 10, alignItems: "center", padding: "9px 10px", borderRadius: 10, fontSize: 13, background: i === active ? "rgba(34,195,154,0.12)" : "transparent", color: i === active ? t.accent : t.soft }}>
          <Icon size={15} /> {l as string}
        </div>
      );
    })}
  </div>
);
const areaChart = (t: Theme, h = 170) => (
  <svg viewBox="0 0 520 170" width="100%" height={h} preserveAspectRatio="none">
    <defs><linearGradient id="vf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={t.accent} stopOpacity="0.45" /><stop offset="1" stopColor={t.accent} stopOpacity="0" /></linearGradient></defs>
    {[40, 85, 130].map((y) => <line key={y} x1="0" y1={y} x2="520" y2={y} stroke={t.line} />)}
    <path d="M0 140 C 50 120 80 130 120 100 S 200 70 250 85 S 330 40 380 55 S 470 20 520 30 L520 170 L0 170 Z" fill="url(#vf)" />
    <path d="M0 140 C 50 120 80 130 120 100 S 200 70 250 85 S 330 40 380 55 S 470 20 520 30" fill="none" stroke={t.accent} strokeWidth="3" />
    <path d="M0 150 C 60 145 100 150 150 135 S 250 120 300 125 S 420 100 520 95" fill="none" stroke={t.accent2} strokeWidth="2" strokeDasharray="6 6" />
  </svg>
);
const finOverview = () => {
  const t = T.fintech;
  return (
    <Screen t={t} style={{ display: "flex" }}>
      {side(t, 0)}
      <div style={{ flex: 1, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div><div style={{ fontSize: 13, color: t.soft }}>Good morning, Chidi</div><div style={{ fontSize: 22, fontWeight: 800 }}>Business overview</div></div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}><Bell size={18} color={t.soft} /><div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#22c39a,#3d8bff)" }} /></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginTop: 18 }}>
          {[["Revenue this month", "₦18,450,000", t.accent], ["Payments received", "₦12,920,000", t.accent2], ["Outstanding invoices", "₦2,310,000", "#f5b544"]].map(([l, v, c]) => (
            <div key={l} style={{ background: t.panel, border: `1px solid ${t.line}`, borderRadius: 14, padding: 16 }}>
              <div style={{ fontSize: 12, color: t.soft }}>{l}</div>
              <div style={{ fontSize: 22, fontWeight: 800, marginTop: 6 }}>{v}</div>
              <Bar w="60%" h={4} c={c} style={{ marginTop: 10 }} />
            </div>
          ))}
        </div>
        <div style={{ background: t.panel, border: `1px solid ${t.line}`, borderRadius: 14, padding: 16, marginTop: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ fontWeight: 700 }}>Cash flow</span><span style={{ color: t.soft }}>Last 6 months</span></div>
          {areaChart(t)}
        </div>
      </div>
    </Screen>
  );
};
const finTx = () => {
  const t = T.fintech;
  const rows = [["Adaobi Stores", "Transfer", "₦450,000", "Paid"], ["Kelechi & Sons", "Card", "₦1,200,000", "Paid"], ["Bayo Ventures", "Invoice", "₦320,000", "Pending"], ["Zainab Foods", "Transfer", "₦86,500", "Paid"], ["Emeka Tech", "Invoice", "₦2,150,000", "Overdue"]];
  const col = (s: string) => (s === "Paid" ? t.accent : s === "Pending" ? "#f5b544" : "#ff6b6b");
  return (
    <Screen t={t} style={{ display: "flex" }}>
      {side(t, 1)}
      <div style={{ flex: 1, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 800 }}>Payments</div>
          <Pill bg={t.accent} fg="#06231b">+ New invoice</Pill>
        </div>
        <div style={{ background: t.panel, border: `1px solid ${t.line}`, borderRadius: 14, marginTop: 16, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.2fr 1fr", padding: "12px 18px", fontSize: 12, color: t.soft, borderBottom: `1px solid ${t.line}` }}><span>Customer</span><span>Method</span><span>Amount</span><span>Status</span></div>
          {rows.map(([c, m, a, s]) => (
            <div key={c} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.2fr 1fr", padding: "14px 18px", fontSize: 13, borderBottom: `1px solid ${t.line}`, alignItems: "center" }}>
              <span style={{ fontWeight: 600 }}>{c}</span><span style={{ color: t.soft }}>{m}</span><span style={{ fontWeight: 700 }}>{a}</span>
              <span><span style={{ background: `${col(s)}22`, color: col(s), borderRadius: 999, padding: "4px 10px", fontSize: 11, fontWeight: 700 }}>{s}</span></span>
            </div>
          ))}
        </div>
      </div>
    </Screen>
  );
};
const finReports = () => {
  const t = T.fintech;
  const bars = [42, 58, 51, 70, 64, 88, 76, 95];
  return (
    <Screen t={t} style={{ display: "flex" }}>
      {side(t, 4)}
      <div style={{ flex: 1, padding: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 800 }}>Reports</div>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14, marginTop: 16 }}>
          <div style={{ background: t.panel, border: `1px solid ${t.line}`, borderRadius: 14, padding: 18 }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>Sales by week</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 200, marginTop: 14 }}>
              {bars.map((b, i) => <div key={i} style={{ flex: 1, height: `${b}%`, borderRadius: "8px 8px 2px 2px", background: i === bars.length - 1 ? t.accent : `linear-gradient(180deg, ${t.accent2}, ${t.accent2}55)` }} />)}
            </div>
          </div>
          <div style={{ background: t.panel, border: `1px solid ${t.line}`, borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontWeight: 700, fontSize: 13, alignSelf: "flex-start" }}>Payment methods</div>
            <svg viewBox="0 0 120 120" width="150" height="150" style={{ marginTop: 10 }}>
              <circle cx="60" cy="60" r="44" fill="none" stroke={t.line} strokeWidth="16" />
              <circle cx="60" cy="60" r="44" fill="none" stroke={t.accent} strokeWidth="16" strokeDasharray="150 276" transform="rotate(-90 60 60)" />
              <circle cx="60" cy="60" r="44" fill="none" stroke={t.accent2} strokeWidth="16" strokeDasharray="80 276" strokeDashoffset="-150" transform="rotate(-90 60 60)" />
            </svg>
            <div style={{ display: "flex", gap: 14, fontSize: 12, color: t.soft, marginTop: 8 }}><span style={{ color: t.accent }}>● Transfer</span><span style={{ color: t.accent2 }}>● Card</span><span>● USSD</span></div>
          </div>
        </div>
      </div>
    </Screen>
  );
};
const finMobile = () => {
  const t = T.fintech;
  return (
    <Screen t={t}>
      <div style={{ padding: "34px 16px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 800, fontSize: 16, display: "flex", gap: 6, alignItems: "center" }}><Wallet size={16} color={t.accent} /> Vaultly</div>
        <Bell size={16} color={t.soft} />
      </div>
      <div style={{ margin: "6px 16px", borderRadius: 18, padding: 18, background: "linear-gradient(135deg,#123a33,#0f2547)" }}>
        <div style={{ fontSize: 12, color: t.soft }}>Total balance</div>
        <div style={{ fontSize: 26, fontWeight: 800, marginTop: 4 }}>₦24,860,000</div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>{["Send", "Request", "Invoice"].map((x) => <Pill key={x} bg="rgba(255,255,255,0.1)" fg="#fff" style={{ fontSize: 11, padding: "6px 11px" }}>{x}</Pill>)}</div>
      </div>
      <div style={{ margin: "10px 16px", background: t.panel, borderRadius: 16, padding: 12 }}>{areaChart(t, 110)}</div>
      <div style={{ padding: "4px 16px" }}>
        {[["Adaobi Stores", "+₦450,000"], ["Zainab Foods", "+₦86,500"]].map(([n, a]) => (
          <div key={n} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${t.line}`, fontSize: 13 }}><span>{n}</span><span style={{ color: t.accent, fontWeight: 700 }}>{a}</span></div>
        ))}
      </div>
    </Screen>
  );
};

/* ═══════════════ 5. Lumora Academy — school / training portal ═══════════════ */
const schoolNav = (t: Theme) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px", background: t.accent2, color: "#fff" }}>
    <div style={{ fontWeight: 800, fontSize: 18, display: "flex", gap: 8, alignItems: "center" }}><GraduationCap size={20} color={t.accent} /> Lumora Academy</div>
    <div style={{ display: "flex", gap: 22, fontSize: 13, opacity: 0.85 }}><span>Courses</span><span>Timetable</span><span>Results</span><span>Library</span></div>
    <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13 }}><div style={{ width: 30, height: 30, borderRadius: "50%", background: t.accent }} /> Tolu A.</div>
  </div>
);
const schoolLogin = () => {
  const t = T.school;
  return (
    <Screen t={t} style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
      <div style={{ background: `linear-gradient(160deg, ${t.accent2}, #16245f)`, color: "#fff", padding: 44, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ fontWeight: 800, fontSize: 20, display: "flex", gap: 8, alignItems: "center" }}><GraduationCap size={22} color={t.accent} /> Lumora Academy</div>
        <div>
          <div style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.1 }}>Learn anywhere.<br />Track everything.</div>
          <div style={{ fontSize: 14, opacity: 0.8, marginTop: 12 }}>Classes, assignments, results and fees in one place.</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>{[0, 1, 2].map((i) => <Bar key={i} w={i === 0 ? 26 : 8} h={8} c={i === 0 ? t.accent : "rgba(255,255,255,0.4)"} />)}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 340 }}>
          <div style={{ fontSize: 26, fontWeight: 800 }}>Student login</div>
          <div style={{ fontSize: 13, color: t.soft, marginTop: 6 }}>Welcome back. Sign in to continue.</div>
          {[["Student ID", User], ["Password", Lock]].map(([l, I]) => {
            const Icon = I as typeof User;
            return (
              <div key={l as string} style={{ marginTop: 16 }}>
                <div style={{ fontSize: 12, color: t.soft, marginBottom: 6 }}>{l as string}</div>
                <div style={{ height: 44, border: `1px solid ${t.line}`, background: "#fff", borderRadius: 10, display: "flex", alignItems: "center", gap: 8, padding: "0 12px", color: t.soft }}><Icon size={15} /></div>
              </div>
            );
          })}
          <div style={{ marginTop: 22, background: t.accent2, color: "#fff", borderRadius: 10, padding: "13px 0", textAlign: "center", fontWeight: 700 }}>Sign in</div>
          <div style={{ fontSize: 12, color: t.accent2, textAlign: "center", marginTop: 12 }}>Forgot password?</div>
        </div>
      </div>
    </Screen>
  );
};
const schoolDash = () => {
  const t = T.school;
  return (
    <Screen t={t}>
      {schoolNav(t)}
      <div style={{ padding: "22px 32px" }}>
        <div style={{ fontSize: 22, fontWeight: 800 }}>Good morning, Tolu 👋</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginTop: 16 }}>
          {[["Mathematics", 72, "#2b4acb"], ["Biology", 54, "#0f9f6e"], ["Literature", 88, "#f2a516"]].map(([n, p, c]) => (
            <div key={n as string} style={{ background: t.panel, border: `1px solid ${t.line}`, borderRadius: 14, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}><span>{n as string}</span><BookOpen size={16} color={c as string} /></div>
              <div style={{ fontSize: 12, color: t.soft, marginTop: 6 }}>Course progress</div>
              <div style={{ height: 8, background: t.line, borderRadius: 4, marginTop: 8 }}><div style={{ width: `${p}%`, height: 8, background: c as string, borderRadius: 4 }} /></div>
              <div style={{ fontSize: 12, fontWeight: 700, marginTop: 6 }}>{p as number}%</div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 14, marginTop: 14 }}>
          <div style={{ background: t.panel, border: `1px solid ${t.line}`, borderRadius: 14, padding: 16 }}>
            <div style={{ fontWeight: 700 }}>Today&apos;s classes</div>
            {[["8:00", "Mathematics · Room 3"], ["10:00", "Biology lab"], ["1:00", "Literature · Online"]].map(([h, c]) => (
              <div key={h} style={{ display: "flex", gap: 14, alignItems: "center", marginTop: 12, fontSize: 13 }}>
                <span style={{ background: "#eef1fb", color: t.accent2, fontWeight: 700, borderRadius: 8, padding: "5px 9px" }}>{h}</span>{c}
              </div>
            ))}
          </div>
          <div style={{ background: t.panel, border: `1px solid ${t.line}`, borderRadius: 14, padding: 16 }}>
            <div style={{ fontWeight: 700 }}>Assignments due</div>
            {["Essay: Things Fall Apart", "Algebra worksheet 4"].map((a) => (
              <div key={a} style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 12, fontSize: 13 }}><Clock size={14} color={t.accent} /> {a}</div>
            ))}
          </div>
        </div>
      </div>
    </Screen>
  );
};
const schoolResults = () => {
  const t = T.school;
  const rows = [["Mathematics", "A", "78"], ["English Language", "B", "68"], ["Biology", "A", "81"], ["Chemistry", "B", "66"], ["Literature", "A", "88"]];
  return (
    <Screen t={t}>
      {schoolNav(t)}
      <div style={{ padding: "22px 32px", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
        <div style={{ background: t.panel, border: `1px solid ${t.line}`, borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", fontWeight: 800, borderBottom: `1px solid ${t.line}` }}>First term results</div>
          {rows.map(([s, g, sc]) => (
            <div key={s} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", padding: "12px 18px", borderBottom: `1px solid ${t.line}`, fontSize: 13 }}>
              <span>{s}</span><span style={{ fontWeight: 800, color: g === "A" ? "#0f9f6e" : t.accent2 }}>{g}</span><span style={{ color: t.soft }}>{sc}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ background: t.accent2, color: "#fff", borderRadius: 14, padding: 18 }}>
            <div style={{ fontSize: 12, opacity: 0.8 }}>School fees</div>
            <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>₦185,000</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Second term · due 10 Jan</div>
            <div style={{ marginTop: 12, background: t.accent, color: "#1a2340", borderRadius: 10, padding: "10px 0", textAlign: "center", fontWeight: 800, fontSize: 13 }}>Pay fees</div>
          </div>
          <div style={{ background: t.panel, border: `1px solid ${t.line}`, borderRadius: 14, padding: 16, fontSize: 13 }}>
            <div style={{ fontWeight: 700 }}>Certificate</div>
            <div style={{ color: t.soft, marginTop: 6 }}>Download your report card as PDF.</div>
          </div>
        </div>
      </div>
    </Screen>
  );
};
const schoolMobile = () => {
  const t = T.school;
  return (
    <Screen t={t}>
      <div style={{ background: t.accent2, color: "#fff", padding: "34px 16px 18px" }}>
        <div style={{ fontWeight: 800, fontSize: 15, display: "flex", gap: 6, alignItems: "center" }}><GraduationCap size={17} color={t.accent} /> Lumora Academy</div>
        <div style={{ fontSize: 20, fontWeight: 800, marginTop: 10 }}>Hi, Tolu 👋</div>
      </div>
      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        {[["Mathematics", 72, "#2b4acb"], ["Biology", 54, "#0f9f6e"], ["Literature", 88, "#f2a516"]].map(([n, p, c]) => (
          <div key={n as string} style={{ background: t.panel, border: `1px solid ${t.line}`, borderRadius: 12, padding: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>{n as string}</div>
            <div style={{ height: 6, background: t.line, borderRadius: 3, marginTop: 8 }}><div style={{ width: `${p}%`, height: 6, background: c as string, borderRadius: 3 }} /></div>
          </div>
        ))}
        <div style={{ background: t.panel, border: `1px solid ${t.line}`, borderRadius: 12, padding: 12, fontSize: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 13 }}>Next class</div>
          <div style={{ color: t.soft, marginTop: 4, display: "flex", gap: 6, alignItems: "center" }}><CalendarDays size={13} /> 10:00 · Biology lab</div>
        </div>
      </div>
    </Screen>
  );
};

/* ═══════════════ 6. Swiftlane — delivery tracking ═══════════════ */
const logNav = (t: Theme) => <Nav t={t} brand={<span style={{ display: "flex", gap: 8, alignItems: "center" }}><Truck size={20} color={t.accent} /> Swiftlane</span>} links={["Track", "Send a parcel", "Business", "Help"]} cta="Book a pickup" />;
const routeMap = (t: Theme, h: number | string = "100%") => (
  <svg viewBox="0 0 600 400" width="100%" height={h} preserveAspectRatio="xMidYMid slice">
    <rect width="600" height="400" fill="#121419" />
    {[70, 160, 250, 340].map((y) => <line key={y} x1="0" y1={y} x2="600" y2={y + 20} stroke="#1f2229" strokeWidth="14" />)}
    {[110, 260, 420, 530].map((x) => <line key={x} x1={x} y1="0" x2={x - 30} y2="400" stroke="#1f2229" strokeWidth="14" />)}
    <path d="M70 330 C 160 300 200 240 250 200 S 380 160 420 120 S 500 80 540 70" fill="none" stroke={t.accent} strokeWidth="6" strokeLinecap="round" />
    <path d="M70 330 C 160 300 200 240 250 200 S 380 160 420 120 S 500 80 540 70" fill="none" stroke="#fff" strokeOpacity="0.4" strokeWidth="2" strokeDasharray="2 14" strokeLinecap="round" />
    <circle cx="70" cy="330" r="10" fill="#fff" />
    <circle cx="540" cy="70" r="12" fill={t.accent2} />
    <g transform="translate(305 172)"><circle r="20" fill={t.accent} /><circle r="30" fill={t.accent} fillOpacity="0.2" /></g>
  </svg>
);
const logTrack = () => {
  const t = T.logistics;
  const steps = [["Picked up", "Ikeja · 9:12 am", true], ["At sorting hub", "Yaba · 10:40 am", true], ["Out for delivery", "Rider Emeka · 1:05 pm", true], ["Delivered", "Lekki · by 3:00 pm", false]] as const;
  return (
    <Screen t={t}>
      {logNav(t)}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", height: 520 }}>
        <div style={{ padding: 26 }}>
          <div style={{ fontSize: 13, color: t.soft }}>Tracking number</div>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: 1 }}>SWL-58210-LG</div>
          <Pill bg="rgba(255,122,26,0.15)" fg={t.accent} style={{ marginTop: 10 }}><Truck size={14} /> Out for delivery</Pill>
          <div style={{ marginTop: 22 }}>
            {steps.map(([n, s, done], i) => (
              <div key={n} style={{ display: "flex", gap: 14, minHeight: 64 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: done ? t.accent : t.panel, border: `2px solid ${done ? t.accent : t.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}>{done && <Check size={12} color="#111" />}</div>
                  {i < steps.length - 1 && <div style={{ width: 2, flex: 1, background: done ? t.accent : t.line }} />}
                </div>
                <div><div style={{ fontWeight: 700 }}>{n}</div><div style={{ fontSize: 12, color: t.soft }}>{s}</div></div>
              </div>
            ))}
          </div>
        </div>
        {routeMap(t)}
      </div>
    </Screen>
  );
};
const logFleet = () => {
  const t = T.logistics;
  return (
    <Screen t={t}>
      {logNav(t)}
      <div style={{ padding: "20px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {[["Active riders", "38", Truck], ["Deliveries today", "412", Package], ["Pickups waiting", "12", Clock], ["Cash collected", "₦2,840,000", CircleDollarSign]].map(([l, v, I]) => {
            const Icon = I as typeof Truck;
            return (
              <div key={l as string} style={{ background: t.panel, border: `1px solid ${t.line}`, borderRadius: 14, padding: 16 }}>
                <Icon size={18} color={t.accent} />
                <div style={{ fontSize: 22, fontWeight: 800, marginTop: 8 }}>{v as string}</div>
                <div style={{ fontSize: 12, color: t.soft }}>{l as string}</div>
              </div>
            );
          })}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 14, marginTop: 14 }}>
          <div style={{ borderRadius: 14, overflow: "hidden", border: `1px solid ${t.line}`, height: 300 }}>{routeMap(t)}</div>
          <div style={{ background: t.panel, border: `1px solid ${t.line}`, borderRadius: 14, padding: 16 }}>
            <div style={{ fontWeight: 700 }}>Riders nearby</div>
            {[["Emeka", "3 drops left"], ["Halima", "On break"], ["Segun", "5 drops left"], ["Ngozi", "1 drop left"]].map(([n, s], i) => (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12, fontSize: 13 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg, ${t.accent}, ${t.accent2})`, opacity: i === 1 ? 0.4 : 1 }} />
                <span style={{ flex: 1, fontWeight: 600 }}>{n}</span><span style={{ color: t.soft, fontSize: 12 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Screen>
  );
};
const logBook = () => {
  const t = T.logistics;
  return (
    <Screen t={t}>
      {logNav(t)}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26, padding: "26px 48px" }}>
        <div style={{ background: t.panel, border: `1px solid ${t.line}`, borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 22, fontWeight: 800 }}>Send a parcel</div>
          {[["Pickup address", MapPin], ["Delivery address", MapPin], ["Parcel size", Package]].map(([l, I]) => {
            const Icon = I as typeof Package;
            return (
              <div key={l as string} style={{ marginTop: 14 }}>
                <div style={{ fontSize: 12, color: t.soft, marginBottom: 6 }}>{l as string}</div>
                <div style={{ height: 42, background: t.bg, border: `1px solid ${t.line}`, borderRadius: 10, display: "flex", alignItems: "center", gap: 8, padding: "0 12px", color: t.soft }}><Icon size={15} /></div>
              </div>
            );
          })}
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>{["Same day", "Express", "Scheduled"].map((x, i) => <Pill key={x} bg={i === 0 ? t.accent : t.bg} fg={i === 0 ? "#111" : t.ink} style={{ border: `1px solid ${t.line}` }}>{x}</Pill>)}</div>
        </div>
        <div style={{ background: t.panel, border: `1px solid ${t.line}`, borderRadius: 16, padding: 24, alignSelf: "start" }}>
          <div style={{ fontWeight: 700 }}>Price estimate</div>
          {[["Distance", "18 km"], ["Parcel", "Small box"], ["Speed", "Same day"]].map(([a, b]) => (
            <div key={a} style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 13, color: t.soft }}><span>{a}</span><span style={{ color: t.ink }}>{b}</span></div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, fontWeight: 800, marginTop: 16, borderTop: `1px solid ${t.line}`, paddingTop: 14 }}><span>Total</span><span>₦4,500</span></div>
          <div style={{ marginTop: 16, background: t.accent, color: "#111", borderRadius: 12, padding: "13px 0", textAlign: "center", fontWeight: 800, display: "flex", justifyContent: "center", gap: 8, alignItems: "center" }}>Book pickup <ChevronRight size={16} /></div>
        </div>
      </div>
    </Screen>
  );
};
const logMobile = () => {
  const t = T.logistics;
  return (
    <Screen t={t}>
      <div style={{ height: 250 }}>{routeMap(t, 250)}</div>
      <div style={{ position: "absolute", top: 214, left: 0, right: 0, bottom: 0, background: t.panel, borderRadius: "22px 22px 0 0", padding: 16 }}>
        <div style={{ width: 40, height: 4, background: t.line, borderRadius: 2, margin: "0 auto 12px" }} />
        <div style={{ fontWeight: 800, fontSize: 16 }}>Arriving by 3:00 pm</div>
        <div style={{ fontSize: 12, color: t.soft }}>SWL-58210-LG · Out for delivery</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14, background: t.bg, borderRadius: 12, padding: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${t.accent}, ${t.accent2})` }} />
          <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 13 }}>Emeka, your rider</div><div style={{ fontSize: 11, color: t.soft }}>Swiftlane rider · 2 drops before you</div></div>
        </div>
        {["Picked up · 9:12 am", "At sorting hub · 10:40 am", "Out for delivery · 1:05 pm"].map((s) => (
          <div key={s} style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 12, fontSize: 12 }}><Check size={14} color={t.accent} /> {s}</div>
        ))}
      </div>
    </Screen>
  );
};

/* ═══════════════ The list ═══════════════ */

export interface WebsiteDesign {
  id: string;
  title: string;
  brand: string;
  /** Website type pre-selected in the calculator by "Get your price". */
  typeId: string;
  includes: string;
  screens: { label: string; render: () => ReactNode }[];
  mobile: () => ReactNode;
  glow: string;
}

export const WEBSITE_DESIGNS: WebsiteDesign[] = [
  { id: "fashion", title: "Fashion e-commerce store", brand: "Luxe Atelier", typeId: "ecommerce", includes: "Product catalogue, sizes, cart, Paystack checkout and order tracking.", glow: "#b08d57", screens: [{ label: "luxeatelier.ng", render: fashionHome }, { label: "luxeatelier.ng/aso-oke-wrap-dress", render: fashionProduct }, { label: "luxeatelier.ng/checkout", render: fashionCheckout }], mobile: fashionMobile },
  { id: "food", title: "Restaurant with ordering & booking", brand: "Ember & Spice", typeId: "booking", includes: "Online menu, food ordering, table booking and live order tracking.", glow: "#f2662f", screens: [{ label: "emberandspice.ng/menu", render: foodMenu }, { label: "emberandspice.ng/book", render: foodBooking }, { label: "emberandspice.ng/track", render: foodTracking }], mobile: foodMobile },
  { id: "estate", title: "Real estate listings", brand: "Nestora Homes", typeId: "business", includes: "Property listings, search and filters, map view and viewing bookings.", glow: "#0f8a62", screens: [{ label: "nestorahomes.ng/buy", render: estateSearch }, { label: "nestorahomes.ng/lekki-4-bed-duplex", render: estateDetail }, { label: "nestorahomes.ng/map", render: estateMap }], mobile: estateMobile },
  { id: "fintech", title: "Business & finance dashboard", brand: "Vaultly", typeId: "webapp", includes: "Secure logins, live charts, payments, invoices and reports.", glow: "#22c39a", screens: [{ label: "app.vaultly.ng/overview", render: finOverview }, { label: "app.vaultly.ng/payments", render: finTx }, { label: "app.vaultly.ng/reports", render: finReports }], mobile: finMobile },
  { id: "school", title: "School & training portal", brand: "Lumora Academy", typeId: "webapp", includes: "Student login, courses and progress, timetable, results and fee payments.", glow: "#f2a516", screens: [{ label: "portal.lumora.ng/login", render: schoolLogin }, { label: "portal.lumora.ng/dashboard", render: schoolDash }, { label: "portal.lumora.ng/results", render: schoolResults }], mobile: schoolMobile },
  { id: "logistics", title: "Delivery tracking app", brand: "Swiftlane", typeId: "webapp", includes: "Live parcel tracking, rider dashboard, pickup booking and price estimates.", glow: "#ff7a1a", screens: [{ label: "swiftlane.ng/track", render: logTrack }, { label: "swiftlane.ng/fleet", render: logFleet }, { label: "swiftlane.ng/send", render: logBook }], mobile: logMobile },
];
