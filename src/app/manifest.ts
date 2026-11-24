import type { MetadataRoute } from "next";

/* Home-screen details for Android phones (Step 3E). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bombin AI",
    short_name: "Bombin AI",
    description: "Your AI sales assistant for WhatsApp.",
    start_url: "/",
    display: "standalone",
    background_color: "#233067",
    theme_color: "#233067",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
