/** Static export for GitHub Pages. Every page is pre-rendered to /out at build time. */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};
export default nextConfig;
