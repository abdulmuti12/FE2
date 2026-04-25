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
        source: '/dashboard/film',
        destination: '/film',
        permanent: true,
      },
      {
        source: '/dashboard/film/detail',
        destination: '/film/detail',
        permanent: true,
      },
      {
        source: '/dashboard/event/:path*',
        destination: '/event/:path*',
        permanent: true,
      },
      {
        source: '/dashboard/series/:path*',
        destination: '/series/:path*',
        permanent: true,
      },
      {
        source: '/dashboard/awards/:path*',
        destination: '/awards/:path*',
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
