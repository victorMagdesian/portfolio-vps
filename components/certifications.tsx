import { Card } from "@/components/ui/card"
import Image from "next/image"
import { Award } from "lucide-react"

const certifications = [
  {
    title: "Formação ASP.NET Core Expert",
    institution: "desenvolvedor.io",
    hours: "69 horas",
    date: "01/09/2021",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/certifiado_ASPNET_expert.png-Yr4E30lwf9ue2o1r29TzidDHBd8Tbp.jpeg",
  },
  {
    title: "Formação Arquiteto de Software",
    institution: "desenvolvedor.io",
    hours: "54 horas",
    date: "20/08/2021",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/arquiteto_software_cert.png-WnYEH7Kqd12B0EvbvjyrnIRcoNnKM5.jpeg",
  },
]

export function Certifications() {
  return (
    <section className="px-4 py-20 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-[200px_1fr] gap-8 md:gap-16">
          <h2 className="text-sm uppercase tracking-wider text-muted-foreground">Certificações</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {certifications.map((cert, index) => (
              <Card key={index} className="overflow-hidden group hover:border-primary transition-colors">
                <div className="aspect-[4/3] relative bg-muted overflow-hidden">
                  <Image
                    src={cert.image || "/placeholder.svg"}
                    alt={cert.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <Award className="size-5 text-primary shrink-0 mt-1" />
                    <div className="space-y-1">
                      <h3 className="font-semibold leading-tight text-balance">{cert.title}</h3>
                      <p className="text-sm text-primary">{cert.institution}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>{cert.hours}</span>
                    <span>•</span>
                    <span>{cert.date}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-12 p-6 bg-card border border-border rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <Award className="size-6 text-primary" />
            <h3 className="text-lg font-semibold">Educação</h3>
          </div>
          <div>
            <p className="text-lg font-medium">Engenharia da Computação</p>
            <p className="text-muted-foreground">FIAP</p>
          </div>
        </div>
      </div>
    </section>
  )
}
