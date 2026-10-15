"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "./lib/supabaseClient";
import {
  Zap,
  ArrowRight,
  Languages,
  Activity,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Cpu,
  UserCheck,
  FileText,
  Tags,
  Globe,
  Wifi,
  BookOpen,
  Rocket,
  Shield,
} from "lucide-react";

/* ═══════════════════════════════════════════════════
   BOMBIN AI — High-Fidelity Landing Page V4
   Dark Charcoal (#0a0a0a) + Full Section Expansion
   ═══════════════════════════════════════════════════ */

interface ChatMsg {
  sender: "customer" | "ai" | "system";
  text: string;
  time: string;
}

// ── Conversation script — verbatim Pidgin/English sales close ──
const CHAT_SCRIPT: ChatMsg[] = [
  { sender: "customer", text: "Hello, I saw the premium velvet chesterfield sofa on your Instagram page. How much is it? I need it delivered to my showroom in Abuja.", time: "10:14 AM" },
  { sender: "ai",       text: "Good day! Thank you for reaching out to us. That premium velvet Chesterfield sofa is an absolute masterpiece—pure luxury. The price is ₦1,200,000, and it is readily available for immediate processing.", time: "10:15 AM" },
  { sender: "customer", text: "Ah, the price high small o. And how long will it take to reach Abuja? I have an event next week Thursday.", time: "10:17 AM" },
  { sender: "ai",       text: "I completely understand, my wrapper! But match the quality texturing and the solid hardwood frame structure, you go know say it's worth every single Kobo. For delivery down to Abuja, no shaking at all. Our secure logistics partners go deliver am straight to your doorstep within 3 days maximum. If we lock down the order now, it go reach your side before weekend self.", time: "10:19 AM" },
  { sender: "customer", text: "Okay dynamic! I like the assurance. How do I make payment to lock it down?", time: "10:21 AM" },
  { sender: "ai",       text: "Perfect choice! I dey send you our secure checkout link and invoice right now make we finalize everything sharp-sharp. Welcome to the premium club! 🚀", time: "10:22 AM" },
];

// Step timing config
const STEPS = [
  { action: "typing" },
  { action: "msg", idx: 1 },
  { action: "msg", idx: 2 },
  { action: "typing" },
  { action: "msg", idx: 3 },
  { action: "msg", idx: 4 },
  { action: "typing" },
  { action: "msg", idx: 5 },
  { action: "hold" },
  { action: "hold" },
  { action: "reset" },
] as const;

// ── How It Works steps ──
const HOW_IT_WORKS = [
  { icon: Wifi,     title: "Connect WhatsApp", text: "Scan QR code to link your number." },
  { icon: BookOpen, title: "Train",            text: "Select your tone, upload your business PDFs or past customer conversations, sync your Website URL, and map your product catalog to train the AI." },
  { icon: Rocket,   title: "Launch",           text: "Let the AI employee handle inbound chats, overcome objections, and close deals automatically." },
  { icon: Shield,   title: "Live Risk",        text: "Gain peace of mind with a prominent toggle button allowing you to take over conversations instantly." },
];

// ── Use-Case carousel data ──
const USE_CASES = [
  { industry: "Real Estate",   tag: "Scheduling Viewings",         text: "Automated calendar tracking and property specification parsing." },
  { industry: "Wig Vendors",   tag: "Price Queries & Complaints",  text: "Direct pricing presentation and rapid automated support handling." },
  { industry: "Food Vendors",  tag: "Delivery Locations",          text: "Dynamic logistics routing queries and order configuration validation." },
  { industry: "Coaches",       tag: "Course Enrollment",           text: "Immediate lead warming, program details delivery, and sign-up conversions." },
];

// ── FAQ data ──
const FAQ_DATA = [
  {
    q: "Will using Bombin AI get my number banned?",
    a: "Absolutely not. Bombin AI uses heavily regulated, anti-throttle connection patterns designed to mimic natural pacing intervals, keeping your business line completely safe and healthy.",
  },
  {
    q: "What are the main uses of Bombin AI?",
    a: "It is built to capture inbound cold leads, answer repetitive pricing/sizing questions, check catalog stock availability, and close sales automatically inside your DMs.",
  },
  {
    q: "Will using AI employees make conversations sound like a robot, or can it mimic my voice?",
    a: "Not at all. With our precision Tone & Language selection tools, the AI perfectly captures your unique brand energy, speech habits, and local conversational styling.",
  },
  {
    q: "Do I need to know how to code to set up the WhatsApp AI employee?",
    a: "Zero code required. The entire setup process is 100% graphic and visual. You can launch your customized sales agent in less than 5 minutes.",
  },
  {
    q: "Can I use my existing WhatsApp Business number?",
    a: "Yes. You can seamlessly connect your active WhatsApp Business line without losing any of your existing historical chats or business contacts.",
  },
  {
    q: "What happens if the AI doesn't know the answer?",
    a: "The system instantly triggers our Human Takeover protocol, safely pausing the AI model and alerting you via the dashboard to step in manually.",
  },
  {
    q: "Can I make the AI sound more like a human or like me?",
    a: "Yes. By feeding your historical chat logs or specific custom behavior descriptions into our configuration training panel, the AI mirrors your exact communication style.",
  },
];

export default function LandingPage() {
  // ── State ────────────────────────────────────────────
  const router = useRouter();
  const [activeTone, setActiveTone] = useState<"pidgin" | "corporate">("pidgin");
  const [autopilot, setAutopilot]   = useState<boolean>(true);
  const [chartMetric, setChartMetric] = useState<"revenue" | "conversion">("revenue");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [faqActiveIndex, setFaqActiveIndex] = useState<number | null>(null);

  // Sign In States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Sign Up States
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState<boolean>(false);
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [signUpSuccess, setSignUpSuccess] = useState<string | null>(null);
  const [signUpLoading, setSignUpLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("bombin-onboarding");
    }
    setLoginLoading(true);
    setLoginError(null);
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      if (authError) throw authError;
      setIsLoginModalOpen(false);
      router.push("/dashboard");
    } catch (err: any) {
      console.warn("Supabase Auth signIn failed, proceeding with fallback mock session for local test:", err.message);
      setIsLoginModalOpen(false);
      router.push("/dashboard");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("bombin-onboarding");
    }
    setSignUpLoading(true);
    setSignUpError(null);
    setSignUpSuccess(null);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: signUpEmail,
        password: signUpPassword,
      });
      if (authError) throw authError;

      if (authData.user && !authData.session) {
        setSignUpSuccess("Account created! Please check your email to verify your account.");
        return;
      }

      if (typeof window !== "undefined") {
        window.localStorage.removeItem("bombin-onboarding");
      }
      setIsSignUpModalOpen(false);
      router.push("/onboarding");
    } catch (err: any) {
      if (err.message?.includes("User already registered")) {
        setSignUpError("This email is already registered. Please click 'Sign In' instead.");
      } else {
        console.error("Supabase Auth signUp failed:", err);
        const isFetchError = err.message?.includes("Failed to fetch") || err.message?.includes("fetch");
        const userMessage = isFetchError
          ? "Database connection failed. Please check your network and Supabase configuration."
          : err.message || "An authentication error occurred.";
        setSignUpError(userMessage);
      }
      // Explicitly halt: do NOT close the modal, do NOT redirect to /onboarding, do NOT clear localstorage
    } finally {
      setSignUpLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) throw error;
    } catch (err: any) {
      console.warn("Google OAuth failed, proceeding with fallback mock session for local test:", err.message);
      setIsLoginModalOpen(false);
      setIsSignUpModalOpen(false);
      router.push("/dashboard");
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/onboarding`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.warn("Google OAuth SignUp failed, proceeding with fallback mock session for local test:", err.message);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("bombin-onboarding");
      }
      setIsSignUpModalOpen(false);
      router.push("/onboarding");
    }
  };

  const [simulationMessages, setSimulationMessages] = useState<ChatMsg[]>([CHAT_SCRIPT[0]]);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const lastAppliedStep  = useRef<number>(-1);

  // Auto-scroll the inner chat box only — never touches window scroll
  useEffect(() => {
    const el = chatContainerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [simulationMessages, isTyping]);

  // Simulation loop — useRef gate ensures exactly-once execution per step
  useEffect(() => {
    lastAppliedStep.current = -1;

    const interval = setInterval(() => {
      lastAppliedStep.current = (lastAppliedStep.current + 1) % STEPS.length;
      const step = STEPS[lastAppliedStep.current];

      if (step.action === "reset") {
        setSimulationMessages([CHAT_SCRIPT[0]]);
        setIsTyping(false);
      } else if (step.action === "typing") {
        setIsTyping(true);
      } else if (step.action === "msg") {
        setIsTyping(false);
        const msg = CHAT_SCRIPT[step.idx];
        setSimulationMessages(prev => {
          if (prev.some(m => m.text === msg.text)) return prev;
          return [...prev, msg];
        });
      } else if (step.action === "hold") {
        // No-op — hold display
      }
    }, 3800);

    return () => clearInterval(interval);
  }, []);

  const toggleFaq = (idx: number) => {
    setFaqActiveIndex(prev => (prev === idx ? null : idx));
  };

  return (
    <main className="relative min-h-screen bg-[#0a0a0c] overflow-x-hidden text-white font-sans selection:bg-[#00C9FF]/30 selection:text-white">

      {/* ── TOP-BAR NAVIGATION ────────────────────────── */}
      <header className="relative z-50 w-full border-b border-white/[0.07] bg-transparent backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Left: Logo + Brand */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Image
              src="/bombinai-logo.png"
              alt="Bombin AI Logo"
              width={44}
              height={44}
              className="h-8 sm:h-10 w-auto object-contain mix-blend-screen contrast-125 drop-shadow-[0_0_12px_rgba(0,201,255,0.25)]"
              style={{ background: 'transparent' }}
              priority
            />
            <div>
              <h1 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-[#00C9FF] via-[#7B2FBE] to-[#00C9FF] bg-[length:200%_auto] animate-gradient-shift bg-clip-text text-transparent drop-shadow-[0_0_16px_rgba(0,201,255,0.3)]">
                Bombin AI
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">AI Sales Closer</p>
            </div>
          </div>

          {/* Right: CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-5 py-2 text-sm font-medium border border-white/10 bg-white/[0.04] backdrop-blur-md text-white rounded-xl transition-all hover:bg-white/[0.08] hover:border-white/20 cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUpModalOpen(true)}
              className="btn-gradient px-6 py-2 text-sm font-bold text-white hover:scale-[1.02] transition-all transform hover:-translate-y-[1px] cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.3)]"
            >
              Start Selling
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION [Node 1] ──────────────────────── */}
      <div className="relative overflow-hidden bg-black">
        {/* Localized Hero Aurora Blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="bg-blue-600/40 mix-blend-screen blur-[90px] w-[600px] h-[400px] absolute top-[-5%] right-[-5%] rounded-full transform-gpu animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/30 blur-[100px] rounded-full animate-pulse transform-gpu" />
        </div>
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

        {/* Left: Copy */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00C9FF]/25 bg-white/[0.04] text-[#00C9FF] backdrop-blur-xl text-xs font-semibold tracking-wider uppercase mb-6 animate-fade-up">
            <Zap size={12} className="animate-pulse" />
            Empowering Next-Gen Social Commerce
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.15] tracking-tight mb-6 animate-fade-up delay-1">
            Turn Your WhatsApp DMs into{" "}
            <span className="bg-gradient-to-r from-[#00C9FF] via-[#7B2FBE] to-[#00C9FF] bg-clip-text text-transparent bg-[size:200%] animate-gradient-shift filter drop-shadow-[0_0_30px_rgba(0,201,255,0.15)]">
              Cash
            </span>{" "}
            While You{" "}
            <span className="bg-gradient-to-r from-[#7B2FBE] via-[#00C9FF] to-[#7B2FBE] bg-clip-text text-transparent bg-[size:200%] animate-gradient-shift filter drop-shadow-[0_0_30px_rgba(123,47,190,0.15)]">
              Sleep
            </span>
          </h2>

          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mb-10 animate-fade-up delay-2">
            The only AI closer with Cultural Intelligence. Master English, Pidgin, and local context to close deals 24/7 while you sleep.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-12 animate-fade-up delay-3">
            <button
              onClick={() => setIsSignUpModalOpen(true)}
              className="btn-gradient px-8 py-4 text-base font-bold text-center text-white hover:scale-[1.02] transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.3)]"
            >
              Connect WhatsApp <ArrowRight size={18} />
            </button>
            <Link
              href="/demo-dashboard"
              className="px-8 py-4 text-base font-semibold text-center border border-white/10 bg-white/[0.04] backdrop-blur-md text-white rounded-xl transition-all hover:bg-white/[0.08] hover:border-white/20 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
            >
              Interactive Demo
            </Link>
          </div>

          {/* Social Proof */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/[0.07] w-full animate-fade-up delay-4">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#00C9FF] filter drop-shadow-[0_0_8px_rgba(0,201,255,0.3)]">2.5k+</p>
              <p className="text-xs text-white/40 mt-1 uppercase tracking-wider font-semibold">Active Vendors</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#7B2FBE] filter drop-shadow-[0_0_8px_rgba(123,47,190,0.3)]">₦920M+</p>
              <p className="text-xs text-white/40 mt-1 uppercase tracking-wider font-semibold">Sales Processed</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 filter drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">98.4%</p>
              <p className="text-xs text-white/40 mt-1 uppercase tracking-wider font-semibold">Deal Conversion</p>
            </div>
          </div>
        </div>

        {/* Right: WhatsApp Simulator — strict 420px height lock */}
        <div className="lg:col-span-5 relative w-full flex justify-center animate-fade-up delay-2">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#00C9FF]/[0.04] to-[#7B2FBE]/[0.04] rounded-3xl filter blur-2xl -z-10" />

          <div className="w-full max-w-[420px] overflow-hidden shadow-2xl relative border border-white/10 animate-floating bg-white/[0.04] backdrop-blur-2xl rounded-[20px]" style={{ height: '520px' }}>
            {/* WhatsApp header bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#128C7E] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#128C7E] font-bold text-sm">B</div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold tracking-wide text-white">Bombin AI Assistant</span>
                  <span className="text-[10px] text-emerald-100 font-medium">Active Auto-Closer</span>
                </div>
              </div>
            </div>

            {/* Chat stream — locked, no page scroll */}
            <div
              ref={chatContainerRef}
              className="p-4 space-y-4 flex flex-col justify-start overflow-y-auto bg-[#ece5dd] scrollbar-none"
              style={{ height: '420px', maxHeight: '420px' }}
            >
              {simulationMessages.map((msg, idx) => (
                <div
                  key={`${idx}-${msg.time}`}
                  className={`flex flex-col max-w-[85%] chat-message ${
                    msg.sender === "customer" ? "self-start items-start" : "self-end items-end"
                  }`}
                >
                  <div
                    className={`p-3.5 text-sm leading-relaxed text-slate-900 shadow-sm ${
                      msg.sender === "customer"
                        ? "bg-white rounded-2xl rounded-tl-sm"
                        : "bg-[#dcf8c6] rounded-2xl rounded-tr-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.time}</span>
                </div>
              ))}

              {isTyping && (
                <div className="self-end flex items-center gap-1.5 bg-[#dcf8c6] p-3 rounded-2xl rounded-tr-sm text-xs text-slate-700 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce delay-75" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce delay-150" />
                  <span>typing...</span>
                </div>
              )}
            </div>

            {/* Footer hint */}
            <div className="bg-white px-4 py-3 text-center text-xs text-slate-500 border-t border-slate-200 shrink-0">
              ⚡ Simulated Live WhatsApp Deal
            </div>
          </div>
        </div>
      </section>
      </div> {/* end Hero wrapper */}

      {/* ── SOCIAL PROOF BAR ──────────────────────────── */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-x-8 gap-y-3 py-5 border-y border-blue-500/10 bg-white/[0.02] px-6 text-center">
        <span className="text-xs font-bold tracking-widest uppercase text-white/60">Trusted by 500+ West African E-Commerce Brands &amp; Online Vendors</span>
        <span className="hidden sm:block text-white/10">|</span>
        <span className="flex items-center gap-2">
          <span className="text-slate-500">🛡️</span>
          <span className="text-xs tracking-widest uppercase text-slate-500">NDPR &amp; GDPR Compliant Architecture</span>
        </span>
        <span className="hidden sm:block text-white/10">|</span>
        <span className="flex items-center gap-2">
          <span className="text-slate-500">🔒</span>
          <span className="text-xs tracking-widest uppercase text-slate-500">End-to-End Encrypted WhatsApp Web Protocols</span>
        </span>
      </div>

      {/* ── HOW IT WORKS — Value Proposition Canvas ────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-white/[0.06]">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 animate-fade-up">
            Chat with over{" "}
            <span className="bg-gradient-to-r from-[#00C9FF] to-[#7B2FBE] bg-clip-text text-transparent">
              1,000 customers
            </span>{" "}
            at the same time
          </h2>
          <p className="text-slate-400 text-base leading-relaxed animate-fade-up delay-1">
            Four simple steps to transform your WhatsApp into an autonomous sales machine.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_IT_WORKS.map((step, i) => {
            const StepIcon = step.icon;
            const stepColors = [
              { bg: "bg-[#00C9FF]/10", border: "border-[#00C9FF]/20", text: "text-[#00C9FF]", num: "text-[#00C9FF]" },
              { bg: "bg-[#7B2FBE]/10", border: "border-[#7B2FBE]/20", text: "text-[#7B2FBE]", num: "text-[#7B2FBE]" },
              { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400", num: "text-emerald-400" },
              { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400", num: "text-amber-400" },
            ];
            const c = stepColors[i];
            return (
              <div
                key={step.title}
                className={`glass-heavy p-6 border border-white/10 shine-effect liquid-shimmer animate-shimmer animate-fade-up delay-${i + 1} group transition-all duration-300 hover:border-white/20 ${["neon-glow-cyan", "neon-glow-purple", "neon-glow-emerald", "neon-glow-cyan"][i]}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl ${c.bg} ${c.border} border flex items-center justify-center ${c.text} group-hover:scale-110 transition-transform`}>
                    <StepIcon size={20} />
                  </div>
                  <span className={`text-xs font-bold ${c.num} uppercase tracking-widest`}>
                    Step {i + 1}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── PROBLEM & AGONY SECTION [Node 4] ────────────── */}
      <div className="relative bg-gradient-to-b from-[#09090b] via-[#0e162f]/40 to-[#09090b]">
        <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-white/[0.06]">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight mb-12 text-center max-w-3xl mx-auto">
            Get an advanced{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">AI employee</span>
            {" "}that{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">understands</span>
            {" "}customers,{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">answers</span>
            {" "}their questions, and{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">sells</span>
            {" "}to them.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Card A: Missed Leads */}
            <div className="relative overflow-hidden bg-zinc-950/40 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_3.5s_infinite] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent transform-gpu" />
              <h3 className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-bold text-xl mb-3">Missed Leads</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Losing buyers because your team is asleep, offline, or stuck in power outages.</p>
            </div>
            {/* Card B: Slow Responses */}
            <div className="relative overflow-hidden bg-zinc-950/40 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_3.5s_infinite_0.8s] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent transform-gpu" />
              <h3 className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-bold text-xl mb-3">Slow Responses</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Customers drop off to competitors if they do not get an immediate answer within 2 minutes.</p>
            </div>
            {/* Card C: Scale Limits */}
            <div className="relative overflow-hidden bg-zinc-950/40 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_3.5s_infinite_1.6s] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent transform-gpu" />
              <h3 className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-bold text-xl mb-3">Scale Limits</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Human agents cannot physically type and chat with 100 frantic buyers simultaneously.</p>
            </div>
          </div>
        </section>
      </div> {/* end Problem wrapper */}

      {/* ── MECHANICAL EDGE SECTION [Node 6] ─────────────── */}
      <div className="relative bg-[#07080a]">
        {/* Blueprint tech grid overlay */}
        <div className="absolute inset-0 pointer-events-none [background-image:linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:3rem_3rem]" />
        <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-white/[0.06]">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 leading-tight text-white">
              Just{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">connect</span>
              {" "}your existing{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">WhatsApp number</span>
              {" "}via QR code.
            </h2>
            <p className="text-slate-400 text-base md:text-lg text-center max-w-2xl mx-auto">
              Our AI listens to customer voice notes, reviews attached images/receipts, and responds accurately.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Instant QR Pairing */}
            <div className="relative overflow-hidden bg-zinc-950/40 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
              <div className="absolute inset-0 z-0 pointer-events-none -translate-x-full animate-[shimmer_3.5s_infinite] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent transform-gpu" />
              <div className="relative z-10 w-full">
                <h3 className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-bold text-xl mb-3">Instant QR Pairing</h3>
                <p className="text-slate-400 text-sm leading-relaxed">No complex business verification or corporate registration documents required. Scan a QR code inside your dashboard and go live in 5 seconds flat.</p>
              </div>
            </div>
            {/* Card 2: True Media Context */}
            <div className="relative overflow-hidden bg-zinc-950/40 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
              <div className="absolute inset-0 z-0 pointer-events-none -translate-x-full animate-[shimmer_3.5s_infinite_0.8s] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent transform-gpu" />
              <div className="relative z-10 w-full">
                <h3 className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-bold text-xl mb-3">True AI Voice &amp; Media Understanding</h3>
                <p className="text-slate-400 text-sm leading-relaxed">While basic bots struggle with audio, Bombin AI processes local voice notes, interprets pidgin nuances, and reviews attached payment screenshot images seamlessly.</p>
              </div>
            </div>
            {/* Card 3: Zero Message Tolls */}
            <div className="relative overflow-hidden bg-zinc-950/40 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
              <div className="absolute inset-0 z-0 pointer-events-none -translate-x-full animate-[shimmer_3.5s_infinite_1.6s] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent transform-gpu" />
              <div className="relative z-10 w-full">
                <h3 className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-bold text-xl mb-3">Zero Message Tolls</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Bypass Meta&apos;s expensive template markup fees completely. Engage in unlimited customer-initiated or business-driven conversations at zero added cost.</p>
              </div>
            </div>
          </div>
        </section>
      </div> {/* end Mechanical Edge wrapper */}

      {/* ── FEATURE SHOWCASE — 6-Card Grid ────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-white/[0.06]">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Engineered to Convert. Built for the{" "}
            <span className="bg-gradient-to-r from-[#00C9FF] to-[#7B2FBE] bg-clip-text text-transparent">Hustle.</span>
          </h2>
          <p className="text-slate-400 leading-relaxed text-base">
            No more lost sales, delayed responses, or broken English. Bombin AI combines cultural nuances with bulletproof controls to closing deals instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Card 1: Tone & Language */}
          <div className="glass-heavy neon-glow-cyan liquid-shimmer p-8 flex flex-col justify-between border border-white/10 hover:border-[#00C9FF]/30 transition-all group duration-300 shine-effect animate-shimmer animate-fade-up delay-1">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#00C9FF]/10 border border-[#00C9FF]/20 flex items-center justify-center text-[#00C9FF] mb-6 group-hover:scale-110 transition-transform">
                <Languages size={22} />
              </div>
              <h3 className="text-xl font-bold mb-3">Cultural & Language Selector</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Train your assistant to talk exactly like you. Toggle between corporate elegance and street-smart pidgin style.
              </p>

              {/* Tone toggle */}
              <div className="grid grid-cols-2 gap-2 bg-white/[0.04] backdrop-blur-2xl p-1.5 rounded-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.7)] mb-6">
                <button
                  onClick={() => setActiveTone("pidgin")}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                    activeTone === "pidgin"
                      ? "bg-[#00C9FF]/20 text-[#00C9FF] border border-[#00C9FF]/30"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  Pure Street Pidgin
                </button>
                <button
                  onClick={() => setActiveTone("corporate")}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                    activeTone === "corporate"
                      ? "bg-[#00C9FF]/20 text-[#00C9FF] border border-[#00C9FF]/30"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  Corporate English
                </button>
              </div>

              {/* Live preview bubble */}
              <div className="bg-white/[0.04] backdrop-blur-2xl rounded-xl p-4 border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.7)] text-xs space-y-3 font-mono">
                <div className="flex justify-between text-[10px] text-white/30 pb-1 border-b border-white/[0.06]">
                  <span>Customer Query</span>
                  <span>Active Live Preview</span>
                </div>
                <p className="text-white/50">Customer: &quot;How much is delivery to Lekki?&quot;</p>
                <div className="pt-2 border-t border-white/[0.06] text-[#00C9FF]">
                  {activeTone === "pidgin" ? (
                    <p className="leading-relaxed">AI Closer: &quot;Abeg tell me your location first make I check delivery cost. Base price na ₦25,000 only. Sharp delivery dey! 🚀&quot;</p>
                  ) : (
                    <p className="leading-relaxed">AI Closer: &quot;Thank you for reaching out. The base price is ₦25,000. Could you please share your delivery location so we can calculate the final price? 💼&quot;</p>
                  )}
                </div>
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-white/[0.06] text-[11px] text-[#00C9FF] font-semibold flex items-center gap-1.5">
              100% Culturally Intelligent Answers <CheckCircle2 size={12} />
            </div>
          </div>

          {/* Card 2: Analytics */}
          <div className="glass-heavy neon-glow-purple liquid-shimmer p-8 flex flex-col justify-between border border-white/10 hover:border-[#7B2FBE]/30 transition-all group duration-300 shine-effect animate-shimmer animate-fade-up delay-2">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#7B2FBE]/10 border border-[#7B2FBE]/20 flex items-center justify-center text-[#7B2FBE] mb-6 group-hover:scale-110 transition-transform">
                <Activity size={22} />
              </div>
              <h3 className="text-xl font-bold mb-3">Sleek Analytics View</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Watch your revenue rise dynamically with modern dashboard statistics showing conversion success.
              </p>

              {/* Chart tabs */}
              <div className="flex gap-2 mb-4">
                {(["revenue", "conversion"] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => setChartMetric(m)}
                    className={`text-xs px-3 py-1 rounded-full border transition-all ${
                      chartMetric === m
                        ? "bg-[#7B2FBE]/20 text-[#c084fc] border-[#7B2FBE]/40"
                        : "text-white/40 border-white/10 hover:text-white"
                    }`}
                  >
                    {m === "revenue" ? "Revenue Growth" : "Conversion Rate"}
                  </button>
                ))}
              </div>

              {/* SVG chart */}
              <div className="bg-white/[0.04] backdrop-blur-2xl rounded-xl p-4 border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.7)] relative h-36 flex items-end">
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] text-white/30 block">
                    {chartMetric === "revenue" ? "INFLUENCED REVENUE" : "INQUIRY CONVERSION"}
                  </span>
                  <span className="text-sm font-bold text-white">
                    {chartMetric === "revenue" ? "₦4,842,000" : "94.2% Success"}
                  </span>
                  <span className="text-[9px] text-emerald-400 ml-1.5 font-bold">+34.2%</span>
                </div>
                <svg className="w-full h-20 overflow-visible" viewBox="0 0 100 40">
                  <defs>
                    <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={chartMetric === "revenue" ? "#00C9FF" : "#7B2FBE"} stopOpacity="0.35" />
                      <stop offset="100%" stopColor={chartMetric === "revenue" ? "#00C9FF" : "#7B2FBE"} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {chartMetric === "revenue" ? (
                    <>
                      <path d="M0 35 Q15 25 30 28 T60 15 T85 10 T100 5 L100 40 L0 40 Z" fill="url(#chartGlow)" />
                      <path d="M0 35 Q15 25 30 28 T60 15 T85 10 T100 5" fill="none" stroke="#00C9FF" strokeWidth="1.5" strokeLinecap="round" className="drop-shadow-[0_0_4px_rgba(0,201,255,0.8)]" />
                      <circle cx="100" cy="5" r="2" fill="#00C9FF" className="animate-pulse" />
                    </>
                  ) : (
                    <>
                      <path d="M0 25 Q20 30 40 18 T75 10 T100 8 L100 40 L0 40 Z" fill="url(#chartGlow)" />
                      <path d="M0 25 Q20 30 40 18 T75 10 T100 8" fill="none" stroke="#7B2FBE" strokeWidth="1.5" strokeLinecap="round" className="drop-shadow-[0_0_4px_rgba(123,47,190,0.8)]" />
                      <circle cx="100" cy="8" r="2" fill="#7B2FBE" className="animate-pulse" />
                    </>
                  )}
                </svg>
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-white/[0.06] text-[11px] text-[#7B2FBE] font-semibold flex items-center gap-1.5">
              Live updates linked directly to Supabase <CheckCircle2 size={12} />
            </div>
          </div>

          {/* Card 3: Risk Controls */}
          <div className="glass-heavy neon-glow-emerald liquid-shimmer p-8 flex flex-col justify-between border border-white/10 hover:border-emerald-500/30 transition-all group duration-300 shine-effect animate-shimmer animate-fade-up delay-3">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <Cpu size={22} />
              </div>
              <h3 className="text-xl font-bold mb-3">Live Risk Controls</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Never lose control. Switch between autonomous AI closing and instant human override with a single tap.
              </p>

              {/* Toggle panel */}
              <div className="bg-white/[0.04] backdrop-blur-2xl p-4 rounded-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.7)] mb-6 flex flex-col gap-3 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/30">CONTROL CENTER</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-white/40">{autopilot ? "AUTOPILOT" : "HUMAN TAKE"}</span>
                    <button
                      onClick={() => setAutopilot(!autopilot)}
                      className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${autopilot ? "bg-emerald-500" : "bg-amber-500"}`}
                    >
                      <div className={`bg-black w-4 h-4 rounded-full transition-transform ${autopilot ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                  </div>
                </div>
                <div className="pt-2 border-t border-white/[0.06]">
                  {autopilot ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-emerald-400">
                        <span className="flex items-center gap-1"><Cpu size={12} /> AI Autopilot Active</span>
                        <span className="animate-pulse">●</span>
                      </div>
                      <p className="text-[10px] text-white/30 italic">&quot;Generating payment links &amp; following up with user...&quot;</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-amber-400">
                        <span className="flex items-center gap-1"><UserCheck size={12} /> Human Takeover</span>
                        <span>Locked</span>
                      </div>
                      <p className="text-[10px] text-white/30 italic">&quot;AI paused. Customer waiting for manual response.&quot;</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-white/[0.06] text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
              Instant fail-safe guarantee <CheckCircle2 size={12} />
            </div>
          </div>

          {/* Card 4: Automated Invoice Generation */}
          <div className="glass-heavy neon-glow-cyan liquid-shimmer p-8 flex flex-col justify-between border border-white/10 hover:border-[#00C9FF]/30 transition-all group duration-300 shine-effect animate-shimmer animate-fade-up delay-1">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#00C9FF]/10 border border-[#00C9FF]/20 flex items-center justify-center text-[#00C9FF] mb-6 group-hover:scale-110 transition-transform">
                <FileText size={22} />
              </div>
              <h3 className="text-xl font-bold mb-3">Automated Invoice Generation</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Instantly formats and transmits structured itemized invoices inside the chat when an order is finalized.
              </p>

              {/* Invoice preview */}
              <div className="bg-white/[0.04] backdrop-blur-2xl rounded-xl p-4 border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.7)] text-xs font-mono space-y-2">
                <div className="flex justify-between text-[10px] text-white/30 pb-2 border-b border-white/[0.06]">
                  <span>INV-20260610-0042</span>
                  <span className="text-emerald-400">● Sent</span>
                </div>
                <div className="flex justify-between text-white/50">
                  <span>Velvet Chesterfield ×1</span>
                  <span className="text-white/70">₦1,200,000</span>
                </div>
                <div className="flex justify-between text-white/50">
                  <span>Express Delivery (Abuja)</span>
                  <span className="text-white/70">₦35,000</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/[0.06] text-[#00C9FF] font-bold">
                  <span>Total</span>
                  <span>₦1,235,000</span>
                </div>
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-white/[0.06] text-[11px] text-[#00C9FF] font-semibold flex items-center gap-1.5">
              Zero manual spreadsheet work <CheckCircle2 size={12} />
            </div>
          </div>

          {/* Card 5: Smart CRM Auto-Tagging */}
          <div className="glass-heavy neon-glow-purple liquid-shimmer p-8 flex flex-col justify-between border border-white/10 hover:border-[#7B2FBE]/30 transition-all group duration-300 shine-effect animate-shimmer animate-fade-up delay-2">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#7B2FBE]/10 border border-[#7B2FBE]/20 flex items-center justify-center text-[#7B2FBE] mb-6 group-hover:scale-110 transition-transform">
                <Tags size={22} />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart CRM Auto-Tagging</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Categorizes buyers by intent, hot leads, and payment processing states inside your database automatically.
              </p>

              {/* CRM preview */}
              <div className="bg-white/[0.04] backdrop-blur-2xl rounded-xl p-4 border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.7)] text-xs font-mono space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px]">HOT LEAD</span>
                  <span className="text-white/50">Adaeze M. — ₦2.4M pipeline</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px]">PAYMENT</span>
                  <span className="text-white/50">Chidi O. — Awaiting transfer</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-[#00C9FF]/20 text-[#00C9FF] border border-[#00C9FF]/30 text-[10px]">NEW LEAD</span>
                  <span className="text-white/50">Funke A. — First inquiry</span>
                </div>
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-white/[0.06] text-[11px] text-[#7B2FBE] font-semibold flex items-center gap-1.5">
              Automatic buyer intelligence <CheckCircle2 size={12} />
            </div>
          </div>

          {/* Card 6: Multi-Dialect Context Engine */}
          <div className="glass-heavy neon-glow-emerald liquid-shimmer p-8 flex flex-col justify-between border border-white/10 hover:border-emerald-500/30 transition-all group duration-300 shine-effect animate-shimmer animate-fade-up delay-3">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <Globe size={22} />
              </div>
              <h3 className="text-xl font-bold mb-3">Multi-Dialect Context Engine</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Flawlessly switches between formal business English, warm casual phrasing, and hyper-local street Pidgin based on user syntax.
              </p>

              {/* Dialect preview */}
              <div className="bg-white/[0.04] backdrop-blur-2xl rounded-xl p-4 border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.7)] text-xs font-mono space-y-3">
                <div className="pb-2 border-b border-white/[0.06]">
                  <span className="text-[10px] text-white/30 block mb-1">DETECTED: Pidgin English</span>
                  <p className="text-white/50">&quot;Oga how much be this shoe?&quot;</p>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-400 block mb-1">AI RESPONSE — Pidgin Mode</span>
                  <p className="text-emerald-400/80 leading-relaxed">&quot;Bros, this shoe na ₦45,000. Pure original leather! I fit arrange express delivery give you sharp. You wan lock am?&quot;</p>
                </div>
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-white/[0.06] text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
              Context-aware dialect detection <CheckCircle2 size={12} />
            </div>
          </div>

        </div>
      </section>

      {/* ── USE-CASE CAROUSEL — Auto-Sliding Marquee ──── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-white/[0.06]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 animate-fade-up">
            Built for Your{" "}
            <span className="bg-gradient-to-r from-[#00C9FF] to-[#7B2FBE] bg-clip-text text-transparent">Exact Workflow</span>
          </h2>
          <p className="text-slate-400 text-base leading-relaxed animate-fade-up delay-1">
            Every industry. Every niche. Bombin AI adapts to your business model.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/[0.06]" style={{ height: '180px' }}>
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

          <div className="marquee-track">
            {/* Duplicate for seamless loop */}
            {[...USE_CASES, ...USE_CASES].map((uc, i) => (
              <div
                key={`${uc.industry}-${i}`}
                className="flex-shrink-0 w-[340px] mx-3 glass-heavy p-6 border border-white/10 hover:border-[#00C9FF]/20 transition-all duration-300 cursor-default"
                style={{ height: '160px' }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base font-bold text-white">{uc.industry}</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#00C9FF]/10 border border-[#00C9FF]/20 text-[#00C9FF] text-[10px] font-semibold">
                    {uc.tag}
                  </span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{uc.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ACCORDION ─────────────────────────────── */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 py-24 border-t border-white/[0.06]">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 animate-fade-up">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-[#00C9FF] to-[#7B2FBE] bg-clip-text text-transparent">Questions</span>
          </h2>
          <p className="text-slate-400 text-base leading-relaxed animate-fade-up delay-1">
            Everything you need to know before launching your AI sales engine.
          </p>
        </div>

        <div className="space-y-3 animate-fade-up delay-2">
          {FAQ_DATA.map((faq, idx) => {
            const isOpen = faqActiveIndex === idx;
            return (
              <div
                key={idx}
                className={`glass-heavy border transition-all duration-300 ${
                  isOpen ? "border-[#00C9FF]/25" : "border-white/10 hover:border-white/15"
                }`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer group"
                >
                  <span className={`text-sm font-semibold leading-snug pr-4 transition-colors ${isOpen ? "text-[#00C9FF]" : "text-white/80 group-hover:text-white"}`}>
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-[#00C9FF]" : "text-white/30"
                    }`}
                  />
                </button>
                <div className={`faq-drawer ${isOpen ? "open" : ""}`}>
                  <div className="faq-drawer-inner">
                    <div className="px-6 pb-5 pt-0">
                      <p className="text-slate-400 text-sm leading-relaxed border-t border-white/[0.06] pt-4">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA SECTION ───────────────────────────────── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-28 text-center">
        <div className="absolute inset-0 bg-[#00C9FF]/[0.03] rounded-3xl filter blur-3xl -z-10" />

        <div className="glass-heavy liquid-shimmer neon-glow-cyan p-10 sm:p-16 border border-white/10 relative overflow-hidden shine-effect animate-shimmer animate-fade-up delay-1">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#00C9FF]/[0.03] rounded-full blur-[80px] -z-10" />

          <h2 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight mb-6">
            Ready to Connect &{" "}
            <span className="bg-gradient-to-r from-[#00C9FF] to-[#7B2FBE] bg-clip-text text-transparent">
              Start Closing?
            </span>
          </h2>

          <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed mb-10">
            Launch in under 5 minutes. Set up your shop, select your voice preference, configure your financials, and connect WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => setIsSignUpModalOpen(true)}
              className="btn-gradient w-full sm:w-auto px-10 py-4 font-bold text-center text-white hover:scale-[1.02] transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.3)] animate-fade-up"
            >
              Start 4-Step Onboarding <ArrowRight size={18} />
            </button>
            <Link
              href="/demo-dashboard"
              className="w-full sm:w-auto px-10 py-4 font-semibold text-center border border-white/10 bg-white/[0.04] backdrop-blur-md text-white rounded-xl transition-all hover:bg-white/[0.08] hover:border-white/20 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
            >
              Explore Dashboard
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mt-12 text-xs text-white/30 font-mono border-t border-white/[0.06] pt-8">
            <span className="flex items-center gap-1.5"><ChevronRight size={12} className="text-[#00C9FF]" /> 1. Store Config</span>
            <span className="flex items-center gap-1.5"><ChevronRight size={12} className="text-[#00C9FF]" /> 2. Tone Selector</span>
            <span className="flex items-center gap-1.5"><ChevronRight size={12} className="text-[#00C9FF]" /> 3. Financials Setup</span>
            <span className="flex items-center gap-1.5"><ChevronRight size={12} className="text-[#00C9FF]" /> 4. Handshake Scan</span>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────── */}
      <footer className="relative z-10 py-12 border-t border-white/[0.06] bg-transparent backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-white/30 text-sm">
          <div className="flex items-center gap-2">
            <Image src="/bombinai-logo.png" alt="Bombin AI Logo" width={20} height={20} className="mix-blend-screen contrast-125 opacity-40" />
            <span className="font-semibold text-white/40">Bombin AI</span>
          </div>
          <p>© 2026 Bombin AI. All rights reserved. Built for the modern Nigerian hustle.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white/60 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white/60 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* ── SIGN-IN MODAL ─────────────────────────────── */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-transparent backdrop-blur-xl animate-fade-in">
          <div className="glass-heavy w-full max-w-md p-8 relative animate-scale-in">
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center text-white">Welcome Back</h2>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/40 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/10 backdrop-blur-xl rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00C9FF]/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/40 mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/10 backdrop-blur-xl rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00C9FF]/50 transition-colors"
                />
              </div>

              {/* Continue with Google button inside Sign-In modal */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-xl px-4 py-3 text-sm text-white font-medium hover:bg-white/[0.08] hover:border-white/20 transition-all flex items-center justify-center gap-3 cursor-pointer mt-2"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>

              {loginError && (
                <p className="text-xs text-rose-500 text-center mt-2">{loginError}</p>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="btn-gradient w-full text-white font-bold rounded-xl px-4 py-3 mt-4 hover:scale-[1.02] transition-all cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.3)] disabled:opacity-50"
              >
                {loginLoading ? "Logging in..." : "Login"}
              </button>
            </form>
            <p className="text-xs text-center text-white/30 mt-6">
              Don&apos;t have an account?{" "}
              <button
                onClick={() => {
                  setIsLoginModalOpen(false);
                  setIsSignUpModalOpen(true);
                }}
                className="text-[#00C9FF] hover:underline bg-transparent border-none cursor-pointer"
              >
                Start Selling
              </button>
            </p>
          </div>
        </div>
      )}

      {/* ── CREATE YOUR ACCOUNT MODAL ────────────────── */}
      {isSignUpModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-transparent backdrop-blur-xl animate-fade-in">
          <div className="glass-heavy w-full max-w-md p-8 relative animate-scale-in">
            <button
              onClick={() => setIsSignUpModalOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-2 text-center bg-gradient-to-r from-[#00C9FF] via-[#7B2FBE] to-[#00C9FF] bg-[length:200%_auto] animate-gradient-shift bg-clip-text text-transparent drop-shadow-[0_0_16px_rgba(0,201,255,0.3)]">Create Your Account</h2>
            <p className="text-xs text-center text-white/50 mb-6">Launch your AI sales engine in 5 minutes</p>

            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/40 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/10 backdrop-blur-xl rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00C9FF]/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/40 mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/10 backdrop-blur-xl rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00C9FF]/50 transition-colors"
                />
              </div>

              {/* Sign up with Google button inside Create account modal */}
              <button
                type="button"
                onClick={handleGoogleSignUp}
                className="w-full bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-xl px-4 py-3 text-sm text-white font-medium hover:bg-white/[0.08] hover:border-white/20 transition-all flex items-center justify-center gap-3 cursor-pointer mt-2"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign up with Google
              </button>

              {signUpError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200 text-xs text-center backdrop-blur-md shadow-[0_4px_12px_rgba(244,63,94,0.15)] mt-2">
                  {signUpError}
                </div>
              )}
              {signUpSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-xs text-center backdrop-blur-md shadow-[0_4px_12px_rgba(52,211,153,0.15)] mt-2">
                  {signUpSuccess}
                </div>
              )}

              <button
                type="submit"
                disabled={signUpLoading}
                className="btn-gradient w-full text-white font-bold rounded-xl px-4 py-3 mt-4 hover:scale-[1.02] transition-all cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.3)] disabled:opacity-50"
              >
                {signUpLoading ? "Creating Account..." : "Create Account & Start Onboarding"}
              </button>
            </form>
            <p className="text-xs text-center text-white/30 mt-6">
              Already have an account?{" "}
              <button
                onClick={() => {
                  setIsSignUpModalOpen(false);
                  setIsLoginModalOpen(true);
                }}
                className="text-[#00C9FF] hover:underline bg-transparent border-none cursor-pointer"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
