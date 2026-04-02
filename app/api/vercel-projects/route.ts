import { NextResponse } from "next/server"

export const revalidate = 3600 // revalida a cada 1 hora

export interface VercelProject {
  id: string
  name: string
  framework: string | null
  createdAt: number
  updatedAt: number
  deploymentUrl: string | null
}

interface VercelDeployment {
  readyState: string
  url: string
  alias?: string[]
}

interface VercelAPIProject {
  id: string
  name: string
  framework: string | null
  createdAt: number
  updatedAt: number
  latestDeployments?: VercelDeployment[]
  targets?: {
    production?: {
      url?: string
      readyState?: string
      alias?: string[]
    }
  }
}

async function fetchAllProjects(token: string): Promise<VercelAPIProject[]> {
  const projects: VercelAPIProject[] = []
  let until: number | undefined = undefined

  while (true) {
    const params = new URLSearchParams({ limit: "100" })
    if (until) params.set("until", String(until))

    const res = await fetch(`https://api.vercel.com/v9/projects?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 3600 },
    })

    if (!res.ok) break

    const data = await res.json()
    const page: VercelAPIProject[] = data.projects ?? []
    projects.push(...page)

    if (!data.pagination?.next) break
    until = data.pagination.next
  }

  return projects
}

export async function GET() {
  const token = process.env.VERCEL_API_TOKEN

  if (!token) {
    return NextResponse.json({ error: "Token não configurado" }, { status: 500 })
  }

  try {
    const allProjects = await fetchAllProjects(token)

    const readyProjects: VercelProject[] = allProjects
      .filter((p) => {
        const productionReady = p.targets?.production?.readyState === "READY"
        const latestReady = p.latestDeployments?.some((d) => d.readyState === "READY")
        return productionReady || latestReady
      })
      .map((p) => {
        const productionAlias = p.targets?.production?.alias?.[0]
        const productionUrl = p.targets?.production?.url
        const latestDeployment = p.latestDeployments?.find((d) => d.readyState === "READY")
        const latestAlias = latestDeployment?.alias?.[0]
        const latestUrl = latestDeployment?.url
        const domain = productionAlias ?? productionUrl ?? latestAlias ?? latestUrl ?? null

        return {
          id: p.id,
          name: p.name,
          framework: p.framework ?? null,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
          deploymentUrl: domain ? `https://${domain}` : null,
        }
      })
      .sort((a, b) => a.createdAt - b.createdAt) // ordem crescente de criação

    return NextResponse.json(readyProjects)
  } catch {
    return NextResponse.json({ error: "Falha ao buscar projetos" }, { status: 500 })
  }
}
