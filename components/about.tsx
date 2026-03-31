export function About() {
  return (
    <section className="px-4 py-20 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-[200px_1fr] gap-8 md:gap-16">
          <h2 className="text-sm uppercase tracking-wider text-muted-foreground">Sobre</h2>
          <div className="space-y-6 text-lg leading-relaxed">
            <p>
              Sou um desenvolvedor full-stack com experiência em arquitetura de software, processos batch com Spring
              Boot, integração de dados em .NET e automação com Python.
            </p>
            <p>
              Perfil <span className="text-primary">generalista</span> com foco em soluções escaláveis, integrações
              corporativas e alta performance. Atuação tanto em projetos autônomos quanto em times de grande porte,
              entregando código limpo, modular e voltado a resultado.
            </p>
            <p>
              Com experiência em grandes empresas como <span className="text-primary">Natura</span>, e desenvolvimento
              de sistemas e dashboards corporativos com foco em dados e automação.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
