import type { Metadata } from "next";
import ServicePage from "../../components/services/ServicePage";

/* Step 4A: Website Development service page with price calculator. Prices live in src/app/lib/pricing.ts. */

export const metadata: Metadata = {
  title: "Website Development | Bombin AI",
  description: "Beautiful, fast websites and web apps for every kind of business, built by Bombin.",
};

export default function Page() {
  return (
    <ServicePage
      service="website"
      headline="Your Business Deserves a Website That Sells."
      subheadline="Beautiful, fast websites and web apps for every kind of business, built by Bombin."
    />
  );
}
