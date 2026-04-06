import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "external-preview.redd.it", pathname: "/**" },
      { protocol: "https", hostname: "preview.redd.it", pathname: "/**" },
      { protocol: "https", hostname: "i.redd.it", pathname: "/**" },
    ],
  },
};

export default nextConfig;
