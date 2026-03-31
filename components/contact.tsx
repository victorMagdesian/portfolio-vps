import { Github, Linkedin, Mail, Phone, MapPin, Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function Contact() {
  return (
    <section className="px-4 py-20 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-[200px_1fr] gap-8 md:gap-16">
          <h2 className="text-sm uppercase tracking-wider text-muted-foreground">Contato</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-2 text-balance">Vamos trabalhar juntos?</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Estou disponível para projetos freelance e oportunidades de emprego. Entre em contato para discutirmos
                como posso ajudar seu projeto.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="p-6 space-y-3">
                <Mail className="size-6 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a
                    href="mailto:vicfemagdesian@gmail.com"
                    className="font-medium hover:text-primary transition-colors"
                  >
                    vicfemagdesian@gmail.com
                  </a>
                </div>
              </Card>

              <Card className="p-6 space-y-3">
                <Phone className="size-6 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <a href="tel:+5511988427694" className="font-medium hover:text-primary transition-colors">
                    +55 (11) 98842-7694
                  </a>
                </div>
              </Card>

              <Card className="p-6 space-y-3">
                <MapPin className="size-6 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Localização</p>
                  <p className="font-medium">São Paulo - SP, Brazil</p>
                </div>
              </Card>

              <Card className="p-6 space-y-3">
                <Languages className="size-6 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Idiomas</p>
                  <p className="font-medium">Português (Nativo) • English (C1)</p>
                </div>
              </Card>
            </div>

            <div className="flex flex-wrap gap-3">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
