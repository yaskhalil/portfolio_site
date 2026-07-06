export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  part?: number
  hash?: string
  status?: "published" | "in-progress" | "draft"
}

export const blogPosts: BlogPost[] = [
  {
    slug: "the-idea-of-insecurity",
    title: "The Idea Of Insecurity",
    description: "On the trap of modern comparison, and what a hot shower reminded me about my younger self.",
    date: "2026-07-05",
    status: "published",
  },
  {
    slug: "engineering-cell-part-1",
    title: "The 17,000-Dimensional Elephant",
    description: "From DepMap transcriptomics to a 30-gene Mesenchymal signature.",
    date: "2026-03-20",
    part: 1,
    status: "published",
  },
  {
    slug: "engineering-cell-part-2",
    title: "Breaking the 0.5 Deadlock",
    description: "pyMaBoSS, threshold logic, and collapsing 1,140 attractors to three.",
    date: "2026-03-20",
    part: 2,
    status: "published",
  },
  {
    slug: "engineering-cell-part-3",
    title: "Turning Cells into Matrices",
    description: "Semi-Tensor Product, Boolean control networks, and prescriptive perturbation.",
    date: "2026-03-20",
    part: 3,
    status: "published",
  },
]

// Stable hashes for git-log display
export const postHashes: Record<string, string> = {
  "the-idea-of-insecurity": "a1b2c3x",
  "engineering-cell-part-1": "a1b2c3d",
  "engineering-cell-part-2": "e4f5g6h",
  "engineering-cell-part-3": "i7j8k9l",
}
