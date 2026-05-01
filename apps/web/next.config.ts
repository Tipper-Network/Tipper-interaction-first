import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "../../"),
  transpilePackages: ["mui-color-input", "@tipper/shared"],
  // Image configuration for Next.js Image component

  images: {
    remotePatterns: [
      // ... your existing patterns

      // Generic S3 pattern that should work for most cases
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com", // This covers the default region
        port: "",
        pathname: "/**",
      },
      // Specific Tipper S3 bucket - eu-north-1 region
      {
        protocol: "https",
        hostname: "tipper-s3-bucket.s3.eu-north-1.amazonaws.com", // Exact match for your bucket
        port: "",
        pathname: "/**",
      },
      // Generic eu-north-1 pattern (should also match tipper-s3-bucket.s3.eu-north-1.amazonaws.com)
      {
        protocol: "https",
        hostname: "*.s3.eu-north-1.amazonaws.com", // Matches any bucket in eu-north-1
        port: "",
        pathname: "/**",
      },
      // Google OAuth profile images
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh4.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh5.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh6.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      // Facebook OAuth profile images
      {
        protocol: "https",
        hostname: "graph.facebook.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com",
        port: "",
        pathname: "/**",
      },
      // GitHub OAuth profile images
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "github.com",
        port: "",
        pathname: "/**",
      },
      // Discord OAuth profile images
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.discordapp.net",
        port: "",
        pathname: "/**",
      },
      // Apple OAuth profile images
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.gravatar.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.apple.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.stockvault.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        // API routes CORS configuration
        source: "/(.*)",
        headers: [
          // Allow requests from the frontend domain
          {
            key: "Access-Control-Allow-Origin",
            value:
              process.env.NEXT_PUBLIC_FRONTEND_URL ||
              "http://localhost:3030",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "worker-src 'self' blob:",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https: 'unsafe-inline'",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' wss://api.tippernetwork.com ws://localhost:8001 http://localhost:8001  https://maps.googleapis.com  https://api.tippernetwork.com https://*.s3.amazonaws.com https://tipper-s3-bucket.s3.eu-north-1.amazonaws.com https://tipper-production.up.railway.app",
              "frame-ancestors 'self'",
            ].join("; "),
          },
          // Allows all HTTP methods
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          // Allows all headers
          {
            key: "Access-Control-Allow-Headers",
            value:
              "Content-Type, Authorization, X-Requested-With ,Cookie, Set-Cookie",
          },
          // Allows credentials
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
