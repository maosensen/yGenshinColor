import type { NextConfig } from "next";

// Validate environment variables at build / dev startup (fail fast).
import "./src/lib/env";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
