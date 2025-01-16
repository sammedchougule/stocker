/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'dims.apnews.com',  // Example domain 1
      'via.placeholder.com',  // Example domain 2
      'assets.example.com',  // Example domain 3
      'another-example.com', // Add as many as needed
    ],
  },
};

module.exports = nextConfig;
