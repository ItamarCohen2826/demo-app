/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
      domains: ['lh3.googleusercontent.com', 'firebasestorage.googleapis.com'],
  },
  experimental: { images: { allowFutureImage: true } }

}

module.exports = nextConfig
