import { Badge } from "@/components/ui/badge"

const skillCategories = [
  {
    title: "Backend",
    skills: [".NET", "ASP.NET Core", "C#", "Java", "SpringBoot", "Python"],
  },
  {
    title: "Frontend",
    skills: ["React.js", "Next.js", "Angular", "Javascript", "Typescript"],
  },
  {
    title: "Mobile",
    skills: ["MAUI", "iOS Native"],
  },
  {
    title: "Database",
    skills: ["SQL Server", "PostgreSQL"],
  },
  {
    title: "Cloud & DevOps",
    skills: ["Microsoft Azure", "Amazon AWS", "Databricks", "Docker", "Kafka"],
  },
  {
    title: "Soft Skills",
    skills: ["Comunicação", "Criatividade", "Pensamento Crítico", "Atenção aos Detalhes", "Adaptabilidade"],
  },
]

export function Skills() {
  return (
    <section className="px-4 py-20 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-[200px_1fr] gap-8 md:gap-16">
          <h2 className="text-sm uppercase tracking-wider text-muted-foreground">Skills</h2>
          <div className="space-y-8">
            {skillCategories.map((category) => (
              <div key={category.title} className="space-y-3">
                <h3 className="text-lg font-semibold text-primary">{category.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="px-3 py-1 text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
