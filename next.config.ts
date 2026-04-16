import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [
      path.join(process.cwd(), "node_modules"),
      path.join(process.cwd(), "node_modules/bootstrap/scss"),
      path.join(process.cwd(), "src/styles"),
    ],
  },
};

export default nextConfig;
