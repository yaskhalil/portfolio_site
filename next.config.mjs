import createMDX from "@next/mdx"

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  experimental: {
    // Keep the MDX compiler path compatible with remark/rehype plugins.
    mdxRs: false,
  },
}

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    // Turbopack-compatible: pass plugin names (strings), not imported plugin functions.
    remarkPlugins: ["remark-math"],
    rehypePlugins: [
      "rehype-katex",
      [
        "rehype-pretty-code",
        {
          theme: {
            dark: "github-dark-dimmed",
            light: "github-light",
          },
          keepBackground: true,
          grid: true,
        },
      ],
    ],
  },
})

export default withMDX(nextConfig)
