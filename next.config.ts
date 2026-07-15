import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Allow all local images in /public (default). Add remote domains if you
    // later move images to Supabase Storage or Cloudinary.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    // Large gallery — allow unoptimized local jpegs to avoid build-time limits
    // Remove this flag once images are served from Supabase/Cloudinary
    unoptimized: true,
  },
  // Allow the app to read images from the old site's public folder during migration
  // (Remove once all images are migrated to /public)
};

export default nextConfig;
