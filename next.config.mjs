/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },

  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/home',
        permanent: true,
      },
      {
        source: '/dashboard/:path*',
        destination: '/home/:path*',
        permanent: true,
      },
      {
        source: '/film/:path*',
        destination: '/home/film/:path*',
        permanent: true,
      },
      {
        source: '/event/:path*',
        destination: '/home/event/:path*',
        permanent: true,
      },
      {
        source: '/series/:path*',
        destination: '/home/series/:path*',
        permanent: true,
      },
      {
        source: '/awards/:path*',
        destination: '/home/awards/:path*',
        permanent: true,
      },
    ]
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://api.usky.ai/:path*",
      },
    ]
  },
}

export default nextConfig
