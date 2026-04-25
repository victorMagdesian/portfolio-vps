import { Github, Linkedin, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-5xl w-full">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-balance">Victor Felippe Magdesian</h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-muted-foreground">Fullstack Developer</p>
            <p className="text-base md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
              Desenvolvedor full-stack com experiência em arquitetura de software, processos batch com Spring Boot,
              integração de dados em .NET e automação com Python. Foco em soluções escaláveis, integrações corporativas
              e alta performance.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="gap-2">
              <a href="https://github.com/victorMagdesian" target="_blank" rel="noopener noreferrer">
                <Github className="size-5" />
                GitHub
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2 bg-transparent">
              <a
                href="https://www.linkedin.com/in/victor-felippe-magdesian-7a45051a7/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="size-5" />
                LinkedIn
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2 bg-transparent">
              <a href="mailto:vicfemagdesian@gmail.com">
                <Mail className="size-5" />
                Email
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2 bg-transparent">
              <a href="tel:+5511988427694">
                <Phone className="size-5" />
                Telefone
              </a>
            </Button>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-primary" />
              São Paulo, SP
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-primary" />
              Disponível para projetos
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
