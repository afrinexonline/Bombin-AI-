"use client";

import type { CSSProperties, ReactNode } from "react";
import { ArrowDown, Bookmark, ChevronLeft, ChevronRight, Globe, Heart, MapPin, MessageCircle, MoreHorizontal, Music2, Play, Search, Send, Share2, ThumbsUp } from "lucide-react";
import { Carousel, PhoneFrame, Scaled, ShowcaseHeading } from "./Frames";

/*
 * AI Marketing showcase (Step 4B): "Content that stops the scroll".
 * Six phone previews built in code (no images): Instagram-style post, reel cover,
 * TikTok-style cover, Facebook ad, carousel and a Google search result.
 * Brands are invented. No like/view counts or results are shown.
 */

const W = 300;
const H = 620;
const sans = "Inter, system-ui, sans-serif";

const Avatar = ({ from, to, letter }: { from: string; to: string; letter: string }) => (
  <div style={{ width: 30, height: 30, borderRadius: "50%", padding: 2, background: "linear-gradient(45deg,#f9b233,#fd5949,#e1306c)" }}>
    <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: `linear-gradient(135deg, ${from}, ${to})`, border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 800 }}>{letter}</div>
  </div>
);
const StatusBar = ({ dark }: { dark?: boolean }) => (
  <div style={{ height: 30, display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "0 18px 4px", fontSize: 11, fontWeight: 700, color: dark ? "#fff" : "#111" }}>
    <span>9:41</span><span>●●● ▮</span>
  </div>
);
const Screen = ({ bg, children, style }: { bg: string; children: ReactNode; style?: CSSProperties }) => (
  <div style={{ width: W, height: H, background: bg, fontFamily: sans, position: "relative", overflow: "hidden", ...style }}>{children}</div>
);

/* 1. Instagram-style post — fashion */
const instaPost = () => (
  <Screen bg="#fff">
    <StatusBar />
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px" }}>
      <Avatar from="#c9a27a" to="#5a3a22" letter="LA" />
      <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 700, color: "#111" }}>luxe.atelier</div><div style={{ fontSize: 10, color: "#777" }}>Lagos, Nigeria</div></div>
      <MoreHorizontal size={16} color="#111" />
    </div>
    <div style={{ height: 300, background: "linear-gradient(160deg,#f3e6d3 0%,#c99f72 45%,#4a2d18 100%)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 40, bottom: -10, width: 120, height: 250, borderRadius: "60px 60px 10px 10px", background: "linear-gradient(180deg,#fbeedd,#a8774b)", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }} />
      <div style={{ position: "absolute", right: 16, top: 22, textAlign: "right", color: "#2a1a0e" }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 30, lineHeight: 1 }}>The<br />Owambe<br />Edit</div>
        <div style={{ fontSize: 10, letterSpacing: 2, marginTop: 8, fontWeight: 700 }}>NEW DROP · LIMITED</div>
      </div>
      <div style={{ position: "absolute", right: 14, bottom: 14, background: "#fff", color: "#111", fontSize: 11, fontWeight: 800, borderRadius: 999, padding: "6px 12px" }}>From ₦48,500</div>
    </div>
    <div style={{ display: "flex", gap: 14, padding: "10px 12px", color: "#111" }}><Heart size={20} /><MessageCircle size={20} /><Send size={20} /><Bookmark size={20} style={{ marginLeft: "auto" }} /></div>
    <div style={{ padding: "0 12px", fontSize: 12, color: "#111", lineHeight: 1.45 }}>
      <b>luxe.atelier</b> New drop just landed ✨ Owambe-ready pieces in rich aso-oke. Limited sizes, so no dulling o! Tap the link in bio to shop.
      <div style={{ color: "#00376b", marginTop: 4 }}>#OwambeStyle #LagosFashion</div>
    </div>
  </Screen>
);

/* 2. Reel cover — food */
const reelCover = () => (
  <Screen bg="#140c0a">
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 42%, #ff8a3d 0%, #b2310f 38%, #2a0d06 75%)" }} />
    <div style={{ position: "absolute", left: "50%", top: "40%", width: 190, height: 190, transform: "translate(-50%,-50%)", borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #ffb36b, #e2581d 55%, #8f2a0c)", boxShadow: "0 30px 60px rgba(0,0,0,0.45), inset 0 -10px 30px rgba(0,0,0,0.25)" }}>
      {[[40, 50], [110, 40], [80, 110], [130, 120], [55, 130]].map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x, top: y, width: 22, height: 14, borderRadius: 8, background: "#7a2d0e", opacity: 0.6 }} />)}
    </div>
    <StatusBar dark />
    <div style={{ position: "absolute", top: 44, left: 14, color: "#fff", fontSize: 14, fontWeight: 800 }}>Reels</div>
    <div style={{ position: "absolute", left: "50%", top: "40%", transform: "translate(-50%,-50%)", width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.25)", backdropFilter: "blur(6px)", border: "2px solid rgba(255,255,255,0.7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Play size={28} color="#fff" fill="#fff" style={{ marginLeft: 4 }} />
    </div>
    <div style={{ position: "absolute", left: 16, right: 60, bottom: 90, color: "#fff" }}>
      <div style={{ fontSize: 26, fontWeight: 900, lineHeight: 1.05, textShadow: "0 4px 18px rgba(0,0,0,0.5)" }}>Jollof wey go make you call your mama 😮‍💨</div>
    </div>
    <div style={{ position: "absolute", left: 16, bottom: 34, display: "flex", alignItems: "center", gap: 8, color: "#fff", fontSize: 12, fontWeight: 700 }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#ff8a3d,#7a1d0c)", border: "2px solid #fff" }} />
      emberandspice <span style={{ border: "1px solid #fff", borderRadius: 6, padding: "2px 8px", fontSize: 11 }}>Follow</span>
    </div>
    <div style={{ position: "absolute", right: 12, bottom: 90, display: "flex", flexDirection: "column", gap: 20, color: "#fff" }}><Heart size={24} /><MessageCircle size={24} /><Send size={24} /></div>
  </Screen>
);

/* 3. TikTok-style video cover — beauty */
const tiktokCover = () => (
  <Screen bg="#0b0b0f">
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#3a1f2b 0%,#c4807a 45%,#f2c6a8 75%,#7a3f3a 100%)" }} />
    <div style={{ position: "absolute", left: "50%", top: 150, transform: "translateX(-50%)", width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,236,214,0.55), transparent 65%)" }} />
    <div style={{ position: "absolute", left: "50%", top: 170, transform: "translateX(-50%)", width: 74, display: "flex", flexDirection: "column", alignItems: "center" }}><div style={{ width: 22, height: 30, borderRadius: "6px 6px 2px 2px", background: "linear-gradient(180deg,#2b1a20,#5a3a40)" }} /><div style={{ width: 30, height: 10, background: "#d9b8a0", borderRadius: 2 }} /><div style={{ width: 74, height: 130, borderRadius: "16px 16px 22px 22px", background: "linear-gradient(160deg,rgba(255,244,232,0.95),rgba(242,198,168,0.85) 55%,rgba(196,128,122,0.9))", boxShadow: "0 0 50px rgba(255,214,190,0.7), inset 0 0 18px rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: "#7a3f3a", fontSize: 10, fontWeight: 900, letterSpacing: 2, transform: "rotate(-90deg)" }}>GLOWRA</div></div></div>
    <StatusBar dark />
    <div style={{ position: "absolute", top: 40, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 16, color: "#fff", fontSize: 13, fontWeight: 700 }}><span style={{ opacity: 0.6 }}>Following</span><span style={{ borderBottom: "2px solid #fff", paddingBottom: 2 }}>For You</span></div>
    <div style={{ position: "absolute", top: 86, left: 16, right: 16, textAlign: "center" }}>
      <span style={{ background: "#fff", color: "#111", fontWeight: 900, fontSize: 17, padding: "6px 10px", borderRadius: 8, lineHeight: 1.6, boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>POV: your skin don glow for December 💫</span>
    </div>
    <div style={{ position: "absolute", right: 10, bottom: 110, display: "flex", flexDirection: "column", alignItems: "center", gap: 20, color: "#fff" }}>
      <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#f2c6a8,#7a3f3a)", border: "2px solid #fff" }} />
      <Heart size={26} fill="#fff" /><MessageCircle size={26} /><Bookmark size={26} /><Share2 size={26} />
    </div>
    <div style={{ position: "absolute", left: 14, right: 70, bottom: 36, color: "#fff" }}>
      <div style={{ fontWeight: 800, fontSize: 14 }}>@glowra.skin</div>
      <div style={{ fontSize: 12, marginTop: 4, lineHeight: 1.4 }}>3-step night routine for that soft glow ✨ Shop the set in bio.</div>
      <div style={{ fontSize: 11, marginTop: 6, display: "flex", gap: 6, alignItems: "center" }}><Music2 size={12} /> original sound · Glowra Skin</div>
    </div>
  </Screen>
);

/* 4. Facebook ad — real estate */
const fbAd = () => (
  <Screen bg="#f0f2f5">
    <StatusBar />
    <div style={{ background: "#fff", margin: "8px 0", paddingBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px" }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#5fb796,#0f4d3a)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12 }}>NH</div>
        <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 700, color: "#050505" }}>Nestora Homes</div><div style={{ fontSize: 11, color: "#65676b", display: "flex", gap: 4, alignItems: "center" }}>Sponsored · <Globe size={10} /></div></div>
        <MoreHorizontal size={16} color="#65676b" />
      </div>
      <div style={{ padding: "0 12px 10px", fontSize: 13, color: "#050505", lineHeight: 1.45 }}>Tired of rent? 🏡 Own a 3-bedroom terrace in Lekki with flexible payment plans. Book a free viewing this weekend.</div>
      <div style={{ height: 230, background: "linear-gradient(160deg,#a6d8c3 0%,#3f9a77 50%,#0f4d3a 100%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 40, right: 40, bottom: 0, height: 140, background: "#f7f3ea", clipPath: "polygon(0 40%, 50% 0, 100% 40%, 100% 100%, 0 100%)" }} />
        {[70, 130, 190].map((x) => <div key={x} style={{ position: "absolute", left: x, bottom: 30, width: 34, height: 40, background: "#b9d9ec", border: "3px solid #fff" }} />)}
        <div style={{ position: "absolute", top: 14, left: 14, background: "#fff", color: "#0f4d3a", fontWeight: 800, fontSize: 11, padding: "5px 10px", borderRadius: 999, display: "flex", gap: 4, alignItems: "center" }}><MapPin size={11} /> Lekki, Lagos</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#f0f2f5" }}>
        <div style={{ flex: 1 }}><div style={{ fontSize: 11, color: "#65676b" }}>NESTORAHOMES.NG</div><div style={{ fontSize: 14, fontWeight: 700, color: "#050505" }}>3-bed terrace · Book a viewing</div></div>
        <div style={{ background: "#e4e6eb", color: "#050505", fontWeight: 700, fontSize: 13, padding: "8px 12px", borderRadius: 6 }}>Learn more</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-around", color: "#65676b", fontSize: 12, fontWeight: 600, paddingTop: 10 }}>
        <span style={{ display: "flex", gap: 5, alignItems: "center" }}><ThumbsUp size={14} /> Like</span>
        <span style={{ display: "flex", gap: 5, alignItems: "center" }}><MessageCircle size={14} /> Comment</span>
        <span style={{ display: "flex", gap: 5, alignItems: "center" }}><Share2 size={14} /> Share</span>
      </div>
    </div>
  </Screen>
);

/* 5. Carousel — gadgets */
const carousel = () => (
  <Screen bg="#fff">
    <StatusBar />
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px" }}>
      <Avatar from="#2f80ff" to="#0b1b3a" letter="V" />
      <div style={{ flex: 1, fontSize: 12, fontWeight: 700, color: "#111" }}>voltix.gadgets</div>
      <span style={{ fontSize: 11, color: "#111", fontWeight: 700, background: "#efefef", borderRadius: 999, padding: "3px 9px" }}>1/5</span>
    </div>
    <div style={{ height: 300, background: "linear-gradient(150deg,#0b1b3a,#123a7a 55%,#2f80ff)", position: "relative", overflow: "hidden", padding: 22, color: "#fff" }}>
      <div style={{ fontSize: 11, letterSpacing: 2, fontWeight: 800, color: "#9cc4ff" }}>BUYING GUIDE</div>
      <div style={{ fontSize: 24, fontWeight: 900, lineHeight: 1.08, marginTop: 8, maxWidth: 170 }}>5 things to check before you buy your next phone</div>
      <div style={{ position: "absolute", right: 20, bottom: 18, width: 74, height: 140, borderRadius: 18, background: "linear-gradient(160deg,#dfe8ff,#7a94c9)", border: "4px solid #0b1b3a", boxShadow: "0 18px 40px rgba(0,0,0,0.45)" }}>
        <div style={{ position: "absolute", top: 10, left: 10, width: 30, height: 30, borderRadius: 10, background: "#0b1b3a" }} />
      </div>
      <div style={{ position: "absolute", left: 22, bottom: 22, fontSize: 12, fontWeight: 700, display: "flex", gap: 6, alignItems: "center", background: "rgba(255,255,255,0.15)", padding: "6px 10px", borderRadius: 999 }}>Swipe <ChevronRight size={13} /></div>
      <div style={{ position: "absolute", left: 8, top: "50%", width: 26, height: 26, borderRadius: "50%", background: "rgba(255,255,255,0.85)", display: "flex", alignItems: "center", justifyContent: "center" }}><ChevronLeft size={15} color="#111" /></div>
    </div>
    <div style={{ display: "flex", justifyContent: "center", gap: 4, padding: "8px 0" }}>{[0, 1, 2, 3, 4].map((i) => <span key={i} style={{ width: 6, height: 6, borderRadius: 3, background: i === 0 ? "#2f80ff" : "#c7c7c7" }} />)}</div>
    <div style={{ display: "flex", gap: 14, padding: "2px 12px 8px", color: "#111" }}><Heart size={20} /><MessageCircle size={20} /><Send size={20} /><Bookmark size={20} style={{ marginLeft: "auto" }} /></div>
    <div style={{ padding: "0 12px", fontSize: 12, color: "#111", lineHeight: 1.45 }}>
      <b>voltix.gadgets</b> Before you pay for that phone, check these 5 things first 👀 Save this post for later. Original products, delivery nationwide.
    </div>
  </Screen>
);

/* 6. Google search result — events (SEO) */
const googleResult = () => (
  <Screen bg="#fff">
    <StatusBar />
    <div style={{ padding: "10px 14px" }}>
      <div style={{ fontSize: 22, fontWeight: 600, textAlign: "center", letterSpacing: -0.5, fontFamily: "Arial, sans-serif" }}>
        <span style={{ color: "#4285F4" }}>G</span><span style={{ color: "#EA4335" }}>o</span><span style={{ color: "#FBBC05" }}>o</span><span style={{ color: "#4285F4" }}>g</span><span style={{ color: "#34A853" }}>l</span><span style={{ color: "#EA4335" }}>e</span>
      </div>
      <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8, border: "1px solid #dfe1e5", borderRadius: 24, padding: "9px 14px", fontSize: 13, color: "#202124", boxShadow: "0 1px 6px rgba(32,33,36,0.12)" }}>
        <Search size={15} color="#5f6368" /> event planner in lagos
      </div>
      <div style={{ display: "flex", gap: 14, fontSize: 12, color: "#5f6368", marginTop: 12, borderBottom: "1px solid #ebebeb", paddingBottom: 8 }}>
        <span style={{ color: "#1a73e8", borderBottom: "2px solid #1a73e8", paddingBottom: 6 }}>All</span><span>Images</span><span>Maps</span><span>News</span>
      </div>
      <div style={{ marginTop: 14, padding: 12, borderRadius: 14, border: "2px solid #01C4FA", boxShadow: "0 0 0 4px rgba(1,196,250,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#f5c542,#b8860b)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 800 }}>O</div>
          <div><div style={{ fontSize: 12, color: "#202124" }}>Owambe Nights</div><div style={{ fontSize: 11, color: "#4d5156" }}>https://owambenights.ng</div></div>
        </div>
        <div style={{ fontSize: 17, color: "#1a0dab", marginTop: 6, lineHeight: 1.25 }}>Owambe Nights | Event Planner in Lagos for Weddings &amp; Parties</div>
        <div style={{ fontSize: 12, color: "#4d5156", marginTop: 4, lineHeight: 1.45 }}>Full planning for weddings, birthdays and corporate events in Lagos. Décor, catering, MCs and more. Get a quote on WhatsApp today.</div>
        <div style={{ display: "flex", gap: 10, marginTop: 8, fontSize: 12, color: "#1a0dab" }}><span>Weddings</span><span>Birthdays</span><span>Get a quote</span></div>
      </div>
      {[0, 1].map((i) => (
        <div key={i} style={{ marginTop: 16, opacity: 0.45 }}>
          <div style={{ width: 120, height: 8, background: "#dfe1e5", borderRadius: 4 }} />
          <div style={{ width: "85%", height: 12, background: "#c6d4f5", borderRadius: 4, marginTop: 8 }} />
          <div style={{ width: "95%", height: 8, background: "#ebebeb", borderRadius: 4, marginTop: 8 }} />
          <div style={{ width: "70%", height: 8, background: "#ebebeb", borderRadius: 4, marginTop: 6 }} />
        </div>
      ))}
    </div>
  </Screen>
);

const ITEMS: { label: string; tag: string; render: () => ReactNode }[] = [
  { label: "Instagram post", tag: "Fashion", render: instaPost },
  { label: "Reel cover", tag: "Food", render: reelCover },
  { label: "TikTok video", tag: "Beauty", render: tiktokCover },
  { label: "Facebook ad", tag: "Real estate", render: fbAd },
  { label: "Carousel", tag: "Gadgets", render: carousel },
  { label: "Google search (SEO)", tag: "Events", render: googleResult },
];

function Phone({ item }: { item: (typeof ITEMS)[number] }) {
  return (
    <div className="mx-auto w-full max-w-[230px] lg:max-w-[260px]">
      <PhoneFrame>
        <Scaled width={W} height={H}>{item.render()}</Scaled>
      </PhoneFrame>
      <div className="mt-3 text-center">
        <p className="text-[15px] font-bold text-[var(--text-primary)]">{item.label}</p>
        <p className="text-[13px] text-[var(--text-muted)]">{item.tag}</p>
      </div>
    </div>
  );
}

export default function MarketingShowcase() {
  return (
    <section aria-labelledby="msc-title" className="relative mx-auto mb-16 max-w-6xl px-4 sm:px-6">
      <div className="pointer-events-none absolute left-1/2 top-24 z-0 h-72 w-[80%] -translate-x-1/2 rounded-full bg-[#01C4FA]/[0.08] blur-3xl" aria-hidden="true" />
      <div id="msc-title" className="relative z-10">
        <ShowcaseHeading title="Content that stops the scroll" sub="Posts, reels, ads and search results, made with AI for your brand." />
      </div>
      <div className="relative z-10 lg:hidden">
        <Carousel count={ITEMS.length} label="Marketing content">
          {(i) => <Phone item={ITEMS[i]} />}
        </Carousel>
      </div>
      <div className="relative z-10 hidden grid-cols-3 gap-x-8 gap-y-10 lg:grid xl:grid-cols-6 xl:gap-x-5">
        {ITEMS.map((it) => <Phone key={it.label} item={it} />)}
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
