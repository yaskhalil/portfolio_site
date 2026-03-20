import Link from "next/link"

const posts = [
  {
    slug: "engineering-cell-part-1",
    title: "The 17,000-Dimensional Elephant",
    description: "From DepMap transcriptomics to a 30-gene Mesenchymal signature.",
    date: "2026-03-20",
    part: 1,
  },
  {
    slug: "engineering-cell-part-2",
    title: "Breaking the 0.5 Deadlock",
    description: "pyMaBoSS, threshold logic, and collapsing 1,140 attractors to three.",
    date: "2026-03-20",
    part: 2,
  },
  {
    slug: "engineering-cell-part-3",
    title: "Turning Cells into Matrices",
    description: "Semi-Tensor Product, Boolean control networks, and prescriptive perturbation.",
    date: "2026-03-20",
    part: 3,
  },
] as const

export default function BlogPage() {
  return (
    <section className="px-6 md:px-12 lg:px-20 py-20 md:py-28">
      <div className="mb-10 md:mb-14">
        <div className="font-mono text-xs text-muted-foreground mb-2">
          <span className="text-primary">$</span> ls blog/
        </div>
        <h1 className="text-2xl md:text-3xl font-sans font-bold text-foreground">
          Blog
        </h1>
        <p className="mt-3 font-mono text-sm text-muted-foreground">
          Engineering a Cell: From 17,000 Dimensions to a Single Matrix
        </p>
      </div>

      <div className="space-y-6 max-w-4xl">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block p-6 border border-border bg-card rounded-sm hover:border-primary/50 hover:bg-secondary/20 transition-colors group"
          >
            <div className="font-mono text-xs text-muted-foreground mb-2">
              Part {post.part} · {post.date}
            </div>
            <h2 className="text-lg font-sans font-semibold text-foreground group-hover:text-primary transition-colors">
              {post.title}
            </h2>
            <p className="mt-2 font-mono text-sm text-muted-foreground">
              {post.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
