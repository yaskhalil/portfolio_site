import Link from "next/link"
import { blogPosts } from "@/lib/blog-posts"

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
          All published writing
        </p>
      </div>

      <div className="space-y-6 max-w-4xl">
        {blogPosts.filter(p => p.status === "published").map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block p-6 border border-border bg-card rounded-sm hover:border-primary/50 hover:bg-secondary/20 transition-colors group"
          >
            <div className="font-mono text-xs text-muted-foreground mb-2">
              {'part' in post ? `Part ${(post as typeof blogPosts[number] & {part: number}).part} · ` : ''}{post.date}
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
