/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable metadata streaming so OG tags are available immediately for all crawlers.
  htmlLimitedBots: /.*/i,
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
        source: '/home/event/:path*',
        destination: '/event/:path*',
        permanent: true,
      },
      {
        source: '/home/series/:path*',
        destination: '/series/:path*',
        permanent: true,
      },
      {
        source: '/home/awards/:path*',
        destination: '/awards/:path*',
        permanent: true,
      },
      {
        source: '/home/about',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/home/clip/:path*',
        destination: '/clip/:path*',
        permanent: true,
      },
      {
        source: '/home/clip',
        destination: '/clip',
        permanent: true,
      },
      {
        source: '/home/film/:path*',
        destination: '/film/:path*',
        permanent: true,
      },
      {
        source: '/home/film',
        destination: '/film',
        permanent: true,
      },
      {
        source: '/home/privacy',
        destination: '/privacy',
        permanent: true,
      },
      {
        source: '/home/term',
        destination: '/term',
        permanent: true,
      },
      {
        source: '/home/referral',
        destination: '/referral',
        permanent: true,
      },
      {
        source: '/home/profile',
        destination: '/profile',
        permanent: true,
      },
      {
        source: '/home/contact',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/home/myaccount',
        destination: '/myaccount',
        permanent: true,
      },
      {
        source: '/home/changepass',
        destination: '/changepass',
        permanent: true,
      },
      {
        source: '/home/creator/:path*',
        destination: '/creator/:path*',
        permanent: true,
      },
      {
        source: '/home/creator',
        destination: '/creator',
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
