import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=(), payment=()" },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; " +
              "img-src 'self' data: https:; " +
              "style-src 'self' 'unsafe-inline' https:; " +
              "script-src 'self' 'unsafe-inline' https:; " +
              "connect-src 'self' https:; " +
              "font-src 'self' data: https:; " +
              "frame-ancestors 'none';"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
