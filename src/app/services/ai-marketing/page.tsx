import type { Metadata } from "next";
import ServicePage from "../../components/services/ServicePage";

/* Step 4A: AI Marketing service page with price calculator. Prices live in src/app/lib/pricing.ts. */

export const metadata: Metadata = {
  title: "AI Marketing | Bombin AI",
  description: "AI-powered content, SEO, ads and campaigns that bring real buyers to your door.",
};

export default function Page() {
  return (
    <ServicePage
      service="marketing"
      headline="Marketing That Thinks for You."
      subheadline="AI-powered content, SEO, ads and campaigns that bring real buyers to your door."
    />
  );
}
