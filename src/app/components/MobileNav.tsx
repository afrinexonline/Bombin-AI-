"use client";

import { Home, Zap, Brain, BarChart3, CreditCard, User, MessageSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: Home, label: "Home", id: "home", href: "/dashboard" },
  { icon: Zap, label: "Momentum", id: "momentum", href: "/momentum" },
  { icon: Brain, label: "AI", id: "training", href: "/training" },
  { icon: BarChart3, label: "Analytics", id: "analytics", href: "/analytics" },
  { icon: CreditCard, label: "Billing", id: "billing", href: "/billing" },
  { icon: User, label: "Profile", id: "profile", href: "/profile" },
  { icon: MessageSquare, label: "Chat", id: "chat", href: "/chat" },
];

export default function MobileNav() {
  const pathname = usePathname();

  const getIsActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/" || pathname === "/dashboard" || pathname === "/demo-dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="mobile-nav fixed bottom-0 left-0 right-0 z-50 lg:hidden flex items-center justify-around py-2 px-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = getIsActive(item.href);
        const href = pathname === "/demo-dashboard" && item.href === "/dashboard" ? "/demo-dashboard" : item.href;
        return (
          <Link
            key={item.id}
            href={href}
            className="pointer-events-auto relative z-30 touch-action-manipulation cursor-pointer flex flex-col items-center gap-0.5 py-1.5 px-1.5 rounded-xl transition-all"
            style={{ color: isActive ? "#00C9FF" : "var(--icon-muted)" }}
            id={`mobile-nav-${item.id}`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-[8px] font-medium">{item.label}</span>
            {isActive && (
              <span className="absolute -top-0 w-4 h-0.5 rounded-full bg-gradient-to-r from-cyan to-purple-light" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
