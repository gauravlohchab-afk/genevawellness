/** @type {import('next').NextConfig} */

// Old .php URLs from the previous site, redirected so links and search results keep working.
const legacyRedirects = [
  ["/index.php", "/"],
  ["/about-us.php", "/about"],
  ["/treatments.php", "/treatments"],
  ["/gallery.php", "/gallery"],
  ["/blog.php", "/blog"],
  ["/blog-category/:category.php", "/blog"],
  ["/blog/:slug.php", "/blog/:slug"],
  ["/testimonials.php", "/testimonials"],
  ["/contact-us.php", "/clinic-locator"],
];

const nextConfig = {
  // Lets a production build live beside the dev server (NEXT_DIST_DIR=.next-prod) without clobbering it.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  reactStrictMode: true,
  poweredByHeader: false,
  // Allows cover-image uploads (up to 5 MB) through the blog admin's server actions.
  experimental: { serverActions: { bodySizeLimit: "6mb" } },
  async redirects() {
    return legacyRedirects.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
  async headers() {
    return [
      {
        source: "/brand/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
