"use client"

import { useEffect, useState } from "react"
import { ExternalLink, Triangle, Globe, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import type { VercelProject } from "@/app/api/vercel-projects/route"

const FRAMEWORK_LABELS: Record<string, string> = {
  nextjs: "Next.js",
  react: "React",
  vue: "Vue",
  nuxtjs: "Nuxt.js",
  svelte: "Svelte",
  sveltekit: "SvelteKit",
  angular: "Angular",
  gatsby: "Gatsby",
  remix: "Remix",
  astro: "Astro",
  vite: "Vite",
  "create-react-app": "CRA",
  solidstart: "SolidStart",
  blitzjs: "Blitz.js",
  redwoodjs: "Redwood",
  hugo: "Hugo",
  jekyll: "Jekyll",
  eleventy: "Eleventy",
}

const FRAMEWORK_COLORS: Record<string, string> = {
  nextjs: "bg-white/10 text-white border-white/20",
  react: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  vue: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  nuxtjs: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  svelte: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  sveltekit: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  angular: "bg-red-500/10 text-red-400 border-red-500/20",
  gatsby: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  remix: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  astro: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  vite: "bg-violet-500/10 text-violet-400 border-violet-500/20",
}

function formatDate(ts: number): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(ts))
}

function ProjectCard({ project, index }: { project: VercelProject; index: number }) {
  const frameworkKey = project.framework?.toLowerCase() ?? ""
  const frameworkLabel = FRAMEWORK_LABELS[frameworkKey] ?? project.framework ?? "Outro"
  const frameworkColor = FRAMEWORK_COLORS[frameworkKey] ?? "bg-primary/10 text-primary border-primary/20"

  return (
    <a
      href={project.deploymentUrl ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
      aria-label={`Abrir projeto ${project.name}`}
    >
      <Card className="relative overflow-hidden h-full border border-border bg-card transition-all duration-300 group-hover:border-primary group-hover:shadow-[0_0_24px_0_oklch(0.65_0.18_180_/_0.25)] group-hover:-translate-y-1">
        {/* número do projeto */}
        <span className="absolute top-4 right-4 text-5xl font-black text-muted-foreground/10 select-none leading-none">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="p-6 flex flex-col gap-4 h-full">
          {/* ícone + framework */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-9 rounded-lg bg-primary/10 border border-primary/20">
              <Triangle className="size-4 text-primary fill-primary/30" />
            </div>
            {project.framework && (
              <Badge variant="outline" className={`text-xs font-medium border ${frameworkColor}`}>
                {frameworkLabel}
              </Badge>
            )}
          </div>

          {/* nome */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2">
              {project.name}
            </h3>
          </div>

          {/* rodapé */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">{formatDate(project.createdAt)}</span>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground group-hover:text-primary transition-colors">
              {project.deploymentUrl ? (
                <>
                  <Globe className="size-3" />
                  <span>Abrir site</span>
                  <ExternalLink className="size-3" />
                </>
              ) : (
                <span>Sem URL</span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </a>
  )
}

export function VercelProjects() {
  const [projects, setProjects] = useState<VercelProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch("/api/vercel-projects")
      .then((r) => {
        if (!r.ok) throw new Error()
        return r.json()
      })
      .then((data: VercelProject[]) => setProjects(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="px-4 py-20 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-[200px_1fr] gap-8 md:gap-16">
          <div className="space-y-3">
            <h2 className="text-sm uppercase tracking-wider text-muted-foreground">Projetos</h2>
            <div className="flex items-center gap-2">
              <Triangle className="size-3 text-primary fill-primary/50" />
              <span className="text-xs text-muted-foreground">via Vercel</span>
            </div>
          </div>

          <div>
            {loading && (
              <div className="flex items-center justify-center py-20 text-muted-foreground gap-3">
                <Loader2 className="size-5 animate-spin" />
                <span className="text-sm">Carregando projetos…</span>
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center py-20">
                <p className="text-sm text-muted-foreground">Não foi possível carregar os projetos.</p>
              </div>
            )}

            {!loading && !error && projects.length === 0 && (
              <div className="flex items-center justify-center py-20">
                <p className="text-sm text-muted-foreground">Nenhum projeto publicado encontrado.</p>
              </div>
            )}

            {!loading && !error && projects.length > 0 && (
              <>
                <p className="text-sm text-muted-foreground mb-6">
                  <span className="text-primary font-semibold">{projects.length}</span> projetos com deploy bem-sucedido
                  — ordenados por data de criação
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.map((project, i) => (
                    <ProjectCard key={project.id} project={project} index={i} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
