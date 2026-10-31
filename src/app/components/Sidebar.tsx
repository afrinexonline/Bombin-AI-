"use client";

import {
  Home,
  Zap,
  Brain,
  BarChart3,
  CreditCard,
  User,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: Home, label: "Home", id: "home", href: "/dashboard" },
  { icon: Zap, label: "Momentum", id: "momentum", href: "/momentum" },
  { icon: Brain, label: "AI Training", id: "training", href: "/training" },
  { icon: BarChart3, label: "Analytics", id: "analytics", href: "/analytics" },
  { icon: CreditCard, label: "Billing", id: "billing", href: "/billing" },
  { icon: User, label: "Profile", id: "profile", href: "/profile" },
  { icon: MessageSquare, label: "Chat", id: "chat", href: "/chat" },
];

export default function Sidebar() {
  const pathname = usePathname();

  // Determine which nav item is active based on current route
  const getIsActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/" || pathname === "/dashboard" || pathname === "/demo-dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="sidebar fixed left-0 top-0 bottom-0 w-[72px] z-40 hidden lg:flex flex-col items-center py-6 gap-2">
      {/* Logo */}
      <Link
        href={pathname === "/demo-dashboard" ? "/demo-dashboard" : "/dashboard"}
        className="pointer-events-auto relative z-30 touch-action-manipulation cursor-pointer mb-6 flex items-center justify-center w-11 h-11 rounded-xl bg-white/[0.06] border border-white/10 backdrop-blur-md hover:bg-white/[0.1] hover:scale-105 transition-all overflow-hidden"
      >
        <Image
          src="/bombinai-logo.png"
          alt="BOMBIN AI Logo"
          width={40}
          height={40}
          className="h-8 w-auto object-contain"
          quality={100}
          priority
        />
      </Link>

      {/* Nav Items */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = getIsActive(item.href);
          const href = pathname === "/demo-dashboard" && item.href === "/dashboard" ? "/demo-dashboard" : item.href;
          return (
            <Link
              key={item.id}
              href={href}
              className={`sidebar-icon group pointer-events-auto relative z-30 touch-action-manipulation cursor-pointer ${isActive ? "active" : ""}`}
              title={item.label}
              id={`nav-${item.id}`}
            >
              <Icon className="w-5 h-5" />
              {/* Tooltip */}
              <span
                className="absolute left-full ml-3 px-2.5 py-1 rounded-lg backdrop-blur-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-card)",
                  color: "var(--text-primary)",
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom avatar */}
      <div className="mt-auto">
        <div
          className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan/30 to-purple-light/30 flex items-center justify-center text-xs font-semibold"
          style={{ border: "1px solid var(--border-card)", color: "var(--text-secondary)" }}
        >
          B
        </div>
      </div>
    </aside>
  );
}
