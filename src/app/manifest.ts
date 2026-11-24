import type { MetadataRoute } from "next";

/*
 * Home-screen details for Android phones (Step 3E, refreshed in Step 3F).
 * Black + silver icon, so the splash screen and bars are black too.
 * - "any": the black rounded tile with its silver edge (192 and 512).
 * - "maskable": black to every edge, with the silver ring and logo kept inside the
 *   centre safe area, so a circle, squircle or rounded-square cut never clips them.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bombin AI",
    short_name: "Bombin AI",
    description: "Your AI sales assistant for WhatsApp.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
