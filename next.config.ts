import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["localhost", "127.0.0.1", "res.cloudinary.com", "images.unsplash.com", "picsum.photos"],
  },
};

export default nextConfig;
