/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: process.env.KRK_BUILD_DIR || ".next",
  serverExternalPackages: ["sharp"],
};

export default nextConfig;
