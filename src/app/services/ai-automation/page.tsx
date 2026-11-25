import type { Metadata } from "next";
import ServicePage from "../../components/services/ServicePage";

/* Step 4A: AI Automation service page with price calculator. Prices live in src/app/lib/pricing.ts. */

export const metadata: Metadata = {
  title: "AI Automation | Bombin AI",
  description: "Custom AI automations and agents that save your team hours every day, for any business in any industry.",
};

export default function Page() {
  return (
    <ServicePage
      service="automation"
      headline="Let AI Run the Busywork."
      subheadline="Custom AI automations and agents that save your team hours every day, for any business in any industry."
    />
  );
}
