/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_NEWS_API_KEY: process.env.NEXT_PUBLIC_NEWS_API_KEY,
  },
}
