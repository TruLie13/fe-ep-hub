import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/data-centers",
        destination: "/data-center",
        permanent: true,
      },
      {
        source: "/data-centers/:path*",
        destination: "/data-center/:path*",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "external-preview.redd.it", pathname: "/**" },
      { protocol: "https", hostname: "preview.redd.it", pathname: "/**" },
      { protocol: "https", hostname: "i.redd.it", pathname: "/**" },
    ],
  },
};

export default nextConfig;
