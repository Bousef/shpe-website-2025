/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";
import { env } from "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [],
  },
};

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;

// I don't know why I have to make so many checks for the config object, but my linter complains otherwise.
if (supabaseUrl && config.images && config.images.remotePatterns) {
  config.images.remotePatterns.push(new URL(supabaseUrl + "/**/*"));
}

export default config;
