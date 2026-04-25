import { Card } from "@/components/ui/card"

const experiences = [
  {
    period: "12/2024 – Presente",
    role: "Software Engineer Pleno",
    company: "VFM ANALYTICS SOLUTIONS",
    location: "São Paulo, SP",
    type: "Generalist IT",
    description: [
      "Desenvolvimento de sistemas e dashboards corporativos com foco em dados e automação",
      "Criação de APIs e microsserviços integrados a pipelines analíticos",
      "Aplicação de boas práticas de arquitetura limpa e testes automatizados",
    ],
  },
  {
    period: "01/2023 - 02/2025",
    role: "Analytics Engineer Pleno",
    company: "NATURA",
    location: "São Paulo, SP",
    type: "Engenheiro de Dados",
    description: [
      "Construção de pipelines de dados em Python e integração com sistemas .NET e Spring Boot",
      "Implementação de rotinas batch e automação de ETL",
      "Modelagem e otimização de consultas SQL para grandes volumes de dados",
      "Participação em iniciativas de governança e qualidade de dados",
    ],
  },
  {
    period: "07/2021 - 12/2022",
    role: "Desenvolvedor Junior",
    company: "MODAL AS A SERVICE",
    location: "Rio de Janeiro, RJ",
    type: "Desenvolvedor Full-stack",
    description: [
      "Desenvolvimento back-end em .NET e aplicações móveis iOS nativas",
      "Integração entre serviços, APIs e bancos de dados relacionais",
      "Manutenção e refatoração de sistemas com foco em performance e escalabilidade",
    ],
  },
]

export function Experience() {
  return (
    <section className="px-4 py-20 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-[200px_1fr] gap-8 md:gap-16">
          <h2 className="text-sm uppercase tracking-wider text-muted-foreground">Experiência</h2>
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <Card key={index} className="p-6 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-balance">{exp.role}</h3>
                    <p className="text-primary">{exp.company}</p>
                    <p className="text-sm text-muted-foreground">{exp.type}</p>
                  </div>
                  <div className="text-left sm:text-right text-sm shrink-0">
                    <p className="text-muted-foreground">{exp.period}</p>
                    <p className="text-muted-foreground">{exp.location}</p>
                  </div>
                </div>
                <ul className="space-y-2 text-muted-foreground">
                  {exp.description.map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-primary mt-2">•</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
