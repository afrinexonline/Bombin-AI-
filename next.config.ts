import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Old demo addresses forward permanently to the real (login-protected) pages,
  // so any saved or shared demo links keep working.
  async redirects() {
    return [
      { source: "/demo-dashboard", destination: "/dashboard", permanent: true },
      { source: "/demo-dashboard/:path*", destination: "/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
