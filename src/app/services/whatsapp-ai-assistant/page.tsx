import type { Metadata } from "next";
import WhatsAppAssistantPage from "../../components/services/WhatsAppAssistantPage";

/* Step 4B: WhatsApp AI Assistant page (no prices; early access). */

export const metadata: Metadata = {
  title: "WhatsApp AI Assistant | Bombin AI",
  description: "Replies to every customer in seconds, in English or Pidgin, handles 'last price' and follows up until they pay.",
};

export default function Page() {
  return <WhatsAppAssistantPage />;
}
