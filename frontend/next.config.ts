import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const config: NextConfig = {
  images: {
    // Disabling optimization for localhost in development
    unoptimized: process.env.NODE_ENV === 'development',
    
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.builder.io',
        pathname: '/api/v1/image/**',
      },
      {
        protocol: process.env.NODE_ENV === 'development' ? 'http' : 'https',
        hostname: process.env.NEXT_PUBLIC_API_DOMAIN || 'localhost',
        port: process.env.NODE_ENV === 'development' ? '4000' : '',
      },
    ],
  },
};

export default withNextIntl(config);