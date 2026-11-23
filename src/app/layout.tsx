import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "./components/ThemeProvider";
import OnboardingProvider from "./context/OnboardingContext";
import { NavTransitionProvider } from "./components/auth/NavTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BOMBIN AI — Turn Every DM into Cash",
  description:
    "AI-powered WhatsApp sales automation. Close deals faster with intelligent responses, real-time momentum tracking, and seamless payment routing.",
};

/*
 * Runs before the page draws anything (Step 3C flash fix).
 * If an email link from Supabase lands on the home page "/" (Supabase falls back to
 * the Site URL when the link's own address isn't on its allowed list), forward it at
 * once to the right page, and keep the screen blank meanwhile, so the landing page
 * never flashes. Recovery links go to /reset-password, everything else to /auth/confirm.
 * It also notes (for this tab only) that a real password-reset link was opened, because
 * Supabase wipes the link from the address bar before the reset page can read it.
 * Step 3D: it also saves a link's error (used / expired link) for this tab straight away,
 * so the confirm and reset pages always see it first, even if the address gets tidied.
 * Contains no secrets; it only reads the web address and one saved word.
 */
const EMAIL_LINK_FORWARD = `(function(){try{
var l=window.location;var h=l.hash||"";var q=l.search||"";
var hasToken=/access_token=/.test(h);
var isRecoveryLink=/(^|&|#)type=recovery(&|$)/.test(h)&&hasToken;
if(isRecoveryLink){try{sessionStorage.setItem("bombin-recovery",String(Date.now()));}catch(e){}}
var em=/(?:^|[#&?])error_code=([^&]*)/.exec(h+"&"+q)||/(?:^|[#&?])error=([^&]*)/.exec(h+"&"+q);
var kind="";try{kind=localStorage.getItem("bombin-link-kind")||"";}catch(e){}
var recovery=isRecoveryLink||(!hasToken&&kind==="recovery");
var dest=l.pathname==="/"?(recovery?"/reset-password":"/auth/confirm"):l.pathname;
try{if(em){sessionStorage.setItem("bombin-link-error",JSON.stringify({code:decodeURIComponent(em[1])||"error",at:Date.now(),path:dest}));}
else if(hasToken){sessionStorage.removeItem("bombin-link-error");}}catch(e){}
if(l.pathname!=="/")return;
if(!hasToken&&!em)return;
var d=document.documentElement;d.setAttribute("data-forwarding","1");
var t="";try{t=localStorage.getItem("bombin-theme")||"";}catch(e){}
d.style.background=t==="light"?"#F4F5F7":"#000";
l.replace(dest+h);
}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: EMAIL_LINK_FORWARD }} />
      </head>
      <body className="min-h-full">
        <ThemeProvider>
          <NavTransitionProvider>
            <OnboardingProvider>{children}</OnboardingProvider>
          </NavTransitionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
