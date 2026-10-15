import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import MobileNav from "../components/MobileNav";
import FAB from "../components/FAB";
import DashboardGuard from "../components/DashboardGuard";

/**
 * Shared layout for all dashboard sub-routes.
 * Includes Sidebar, TopBar, MobileNav, and FAB so every page
 * gets consistent navigation chrome.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardGuard>
      <div className="min-h-screen relative" style={{ background: "var(--bg-body)" }}>
        {/* Ambient Background */}
        <div className="bg-ambient" />

        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="relative z-10 lg:pl-[72px] pb-20 lg:pb-6">
          {/* Top Bar */}
          <TopBar />

          {/* Page Content */}
          <main className="px-4 sm:px-6 space-y-5">
            {children}
          </main>
        </div>

        {/* Mobile Bottom Nav */}
        <MobileNav />

        {/* Mobile FAB for Hybrid AI Assistant */}
        <FAB />
      </div>
    </DashboardGuard>
  );
}
