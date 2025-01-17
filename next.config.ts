/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'dims.apnews.com',  // Example domain 1
      'via.placeholder.com',  // Example domain 2
    ],
  },
};

module.exports = nextConfig;
