/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Re-enabling for production readiness
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fizfmxnfojagfrvhwsqb.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'petcarestudio.vercel.app',
        port: '',
        pathname: '/**',
      }
    ],
  },
  allowedDevOrigins: ['localhost', '192.168.1.35'],
}

export default nextConfig
