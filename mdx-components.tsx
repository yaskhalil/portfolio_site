import type { MDXComponents } from "mdx/types"

// `@next/mdx` uses this file as the MDX provider source.
// Keeping it context-free avoids React `createContext` issues under Turbopack.
const components: MDXComponents = {}

export function useMDXComponents(): MDXComponents {
  return components
}

