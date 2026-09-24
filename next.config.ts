import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fixa a raiz no projeto: há um package-lock.json solto em ~/Downloads que
  // faria o Turbopack inferir a pasta errada como raiz do workspace.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
