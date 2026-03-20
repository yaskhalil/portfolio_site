import Link from "next/link"

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="px-6 md:px-12 lg:px-20 py-6 border-b border-border">
        <Link
          href="/"
          className="font-mono text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          ← home
        </Link>
      </header>
      {children}
    </main>
  )
}
