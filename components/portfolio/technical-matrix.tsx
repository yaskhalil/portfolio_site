type TreeNode = {
  name: string
  children?: TreeNode[]
}

const rootTree: TreeNode = {
  name: "active-stack/",
  children: [
    {
      name: "modeling/",
      children: [
        { name: "python" },
        { name: "pytorch" },
        { name: "numpy" },
        { name: "gnn" },
        { name: "stp-algebra" },
      ],
    },
    {
      name: "backend/",
      children: [
        { name: "go" },
        { name: "fastapi" },
        { name: "postgres" },
        { name: "kdb-q" },
      ],
    },
    {
      name: "frontend/",
      children: [
        { name: "typescript" },
        { name: "react" },
        { name: "tailwind" },
        { name: "nextjs" },
      ],
    },
    {
      name: "research/",
      children: [
        { name: "r" },
        { name: "depmap" },
        { name: "systems-biology" },
      ],
    },
    {
      name: "infra/",
      children: [
        { name: "docker" },
        { name: "vercel" },
        { name: "supabase" },
      ],
    },
  ],
}

function countNodes(node: TreeNode): number {
  let count = 1
  if (node.children) {
    for (const child of node.children) {
      count += countNodes(child)
    }
  }
  return count
}

/** Render a single tree branch line with proper prefix characters */
function TreeBranch({ node, prefix, isLast }: { node: TreeNode; prefix: string; isLast: boolean }) {
  const branchChar = isLast ? "└── " : "├── "
  const linePrefix = prefix + branchChar

  const isRoot = prefix === ""
  const isCategory = !!node.children

  let textClass = "text-foreground"
  if (isRoot) textClass = "text-primary"
  else if (isCategory) textClass = "text-accent"

  const childPrefix = prefix + (isLast ? "    " : "│   ")

  return (
    <>
      <div className="leading-relaxed whitespace-pre">
        {linePrefix}
        <span className={textClass}>{node.name}</span>
      </div>
      {node.children?.map((child, i) => (
        <TreeBranch
          key={child.name}
          node={child}
          prefix={childPrefix}
          isLast={i === node.children!.length - 1}
        />
      ))}
    </>
  )
}

export function TechnicalMatrix() {
  const totalNodes = countNodes(rootTree)

  return (
    <section id="matrix" className="px-6 md:px-12 lg:px-20 py-20 md:py-28">
      {/* Section Header */}
      <div className="mb-10 md:mb-14">
        <div className="font-mono text-xs text-muted-foreground mb-2">
          <span className="text-primary">$</span> cat ./tech_tree
        </div>
        <h2 className="text-2xl md:text-3xl font-sans font-bold text-foreground">
          Tech Tree
        </h2>
      </div>

      {/* Terminal-style container */}
      <div className="border border-border bg-card rounded-sm overflow-hidden max-w-xl mx-auto">
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
          <div className="w-3 h-3 rounded-full bg-destructive/50" />
          <div className="w-3 h-3 rounded-full bg-accent/50" />
          <div className="w-3 h-3 rounded-full bg-primary/50" />
          <span className="ml-4 font-mono text-xs text-muted-foreground">tree</span>
        </div>

        {/* Tree content */}
        <div className="p-6 md:p-8">
          <div className="font-mono text-sm leading-relaxed">
            <TreeBranch node={rootTree} prefix="" isLast={true} />
          </div>
        </div>

        {/* Terminal footer */}
        <div className="px-6 py-3 bg-secondary/30 border-t border-border">
          <div className="font-mono text-xs text-muted-foreground">
            <span className="text-accent">READY</span> | {totalNodes} nodes
          </div>
        </div>
      </div>
    </section>
  )
}
