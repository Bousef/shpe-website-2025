/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";
import { env } from "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "items-images-sandbox.s3.us-west-2.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lubkokuzenko.github.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "beecrowd.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.daily.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "yt3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
};

// use process.env to get env variables at build time
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseMobileUrl = env.NEXT_PUBLIC_SUPABASE_MOBILE_URL;

// I don't know why I have to make so many checks for the config object, but my linter complains otherwise.
if (config.images && config.images.remotePatterns) {
  if (supabaseUrl) {
    config.images.remotePatterns.push({
      protocol: "https",
      hostname: new URL(supabaseUrl).hostname,
      pathname: "/storage/v1/object/public/**",
    });
  }

  if (supabaseMobileUrl) {
    config.images.remotePatterns.push({
      protocol: "https",
      hostname: new URL(supabaseMobileUrl).hostname,
      pathname: "/storage/v1/object/public/**",
    });
  }
}

export default config;