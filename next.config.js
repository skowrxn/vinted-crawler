/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images1.vinted.net',
      },
      {
        protocol: 'https',
        hostname: 'images2.vinted.net',
      },
      {
        protocol: 'https',
        hostname: 'images3.vinted.net',
      },
      {
        protocol: 'https',
        hostname: 'images4.vinted.net',
      },
    ],
  },
}

module.exports = nextConfig
