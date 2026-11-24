import type { Metadata, Viewport } from "next";
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
  appleWebApp: { title: "Bombin AI" },
};

/* Normal phone width, normal starting size. People can always pinch-zoom by hand. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#233067",
};

/*
 * Step 3E: iPhones and iPads zoom in by themselves when someone taps a text box.
 * All our boxes already use 16px text on phones (which stops it), and this is the
 * backup for iOS ONLY: there "maximum-scale=1" stops the automatic zoom but iOS still
 * lets people pinch-zoom by hand. Android and computers are left alone, because there
 * the same setting would block hand zoom. Runs in <head>, before anything is drawn.
 */
const IOS_NO_AUTO_ZOOM = `(function(){try{
var n=navigator,ios=/iPad|iPhone|iPod/.test(n.userAgent)||(n.platform==="MacIntel"&&n.maxTouchPoints>1);
if(!ios)return;
var c="width=device-width, initial-scale=1, maximum-scale=1";
var m=document.querySelector('meta[name="viewport"]');
if(m){m.setAttribute("content",c);return;}
m=document.createElement("meta");m.name="viewport";m.content=c;document.head.appendChild(m);
new MutationObserver(function(){document.querySelectorAll('meta[name="viewport"]').forEach(function(x){if(x.content!==c)x.content=c;});}).observe(document.head,{childList:true});
}catch(e){}})();`;

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
        <script dangerouslySetInnerHTML={{ __html: IOS_NO_AUTO_ZOOM }} />
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
