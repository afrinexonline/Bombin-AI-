import RevenueCard from "../../components/RevenueCard";
import MomentumTracker from "../../components/MomentumTracker";
import AITrainingBox from "../../components/AITrainingBox";
import HybridAssistant from "../../components/HybridAssistant";
import AnalyticsSection from "../../components/AnalyticsSection";
import ProductCatalog from "../../components/ProductCatalog";

export const metadata = {
  title: "Dashboard — BOMBIN AI",
};

export default function DashboardPage() {
  return (
    <>
      {/* Row 1: Stat Cards */}
      <section>
        <RevenueCard />
      </section>

      {/* Row 2: Main Grid — Momentum + AI Training + Product Catalog + Hybrid Assistant */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-4 xl:col-span-3 order-1">
          <MomentumTracker />
        </div>
        <div className="lg:col-span-4 xl:col-span-3 order-3 lg:order-2">
          <AITrainingBox />
        </div>
        <div className="lg:col-span-4 xl:col-span-3 order-2 lg:order-3">
          <ProductCatalog />
        </div>
        <div className="lg:col-span-4 xl:col-span-3 order-4 hidden lg:block">
          <HybridAssistant />
        </div>
      </section>

      {/* Row 3: Analytics Charts */}
      <AnalyticsSection />
    </>
  );
}
