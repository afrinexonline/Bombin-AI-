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
      return pathname === "/" || pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="sidebar fixed left-0 top-0 bottom-0 w-[72px] z-40 hidden lg:flex flex-col items-center py-6 gap-2">
      {/* Logo */}
      <Link
        href="/dashboard"
        prefetch={true}
        aria-label="Bombin AI home"
        className="pointer-events-auto relative z-30 touch-action-manipulation cursor-pointer mb-6 flex items-center justify-center w-12 h-12 hover:scale-105 transition-transform"
      >
        <Image
          src="/logo-mark.png"
          alt="Bombin AI"
          width={56}
          height={56}
          className="h-14 w-14 max-w-none object-contain drop-shadow-[0_0_12px_rgba(1,196,250,0.35)]"
          priority
        />
      </Link>

      {/* Nav Items */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = getIsActive(item.href);
          const href = item.href;
          return (
            <Link
              key={item.id}
              href={href}
              prefetch={true}
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

      {/* Avatar (log out lives on the Profile page) */}
      <div className="mt-auto flex flex-col items-center gap-3">
        <div
          className="w-9 h-9 rounded-full bg-gradient-to-br from-[#01C4FA]/30 to-[#233067]/60 flex items-center justify-center text-xs font-semibold"
          style={{ border: "1px solid var(--border-card)", color: "var(--text-secondary)" }}
        >
          B
        </div>
      </div>
    </aside>
  );
}
