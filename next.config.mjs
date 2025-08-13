// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your other config can go here
  
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://kcs408ksw0og080sskw4okoo.31.97.206.59.sslip.io/api/:path*',
      },
    ];
  },
};

export default nextConfig;