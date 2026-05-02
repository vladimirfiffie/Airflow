import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: projectRoot,
  allowedDevOrigins: ["192.168.0.94", "localhost", "127.0.0.1"],
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
