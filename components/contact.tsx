"use client"

import { useState } from "react"
import { Github, Linkedin, Mail, Phone, MapPin, Languages, Coffee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CoffeeModal } from "@/components/coffee/CoffeeModal"

export function Contact() {
  const [coffeeOpen, setCoffeeOpen] = useState(false)

  return (
    <>
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
                    <a href="mailto:vicfemagdesian@gmail.com" className="font-medium hover:text-primary transition-colors">
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

              {/* Social + Coffee */}
              <div className="flex flex-wrap gap-3 items-center">
                <Button asChild size="lg" className="gap-2">
                  <a href="https://github.com/victorMagdesian" target="_blank" rel="noopener noreferrer">
                    <Github className="size-5" />
                    GitHub
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2 bg-transparent">
                  <a href="https://www.linkedin.com/in/victor-felippe-magdesian-7a45051a7/" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="size-5" />
                    LinkedIn
                  </a>
                </Button>

                {/* Coffee button */}
                <button
                  onClick={() => setCoffeeOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 relative overflow-hidden group"
                  style={{
                    background: "linear-gradient(135deg,rgba(251,191,36,0.12),rgba(245,158,11,0.08))",
                    border: "1px solid rgba(251,191,36,0.3)",
                    color: "#fbbf24",
                  }}
                >
                  <span
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
                    style={{ background: "linear-gradient(135deg,rgba(251,191,36,0.18),rgba(245,158,11,0.12))" }}
                  />
                  <Coffee size={17} className="relative z-10 group-hover:animate-bounce" />
                  <span className="relative z-10">Me pague um café</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {coffeeOpen && <CoffeeModal onClose={() => setCoffeeOpen(false)} />}
    </>
  )
}
