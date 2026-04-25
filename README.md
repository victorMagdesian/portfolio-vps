<div align="center">

# Victor Felippe Magdesian

### Fullstack Developer — São Paulo, SP

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)

> Desenvolvedor full-stack com foco em arquitetura de software, integrações corporativas e alta performance.  
> Experiência em .NET, Java, Python, React e cloud — do backend robusto até a UI que o usuário vê.

[victor.magdesian.com.br](https://victor.magdesian.com.br) · [LinkedIn](https://www.linkedin.com/in/victor-felippe-magdesian-7a45051a7/) · [GitHub](https://github.com/victorMagdesian) · [vicfemagdesian@gmail.com](mailto:vicfemagdesian@gmail.com)

</div>

---

## Sobre o Projeto

Este repositório contém o código-fonte do meu portfólio pessoal — uma single-page application moderna, responsiva e com suporte a dark/light mode. O site integra diretamente com a API da Vercel para exibir automaticamente meus projetos mais recentes sem necessidade de atualização manual.

A stack foi escolhida para refletir o que uso no dia a dia: Next.js App Router com TypeScript estrito, Tailwind CSS v4 com OKLCH colors, componentes acessíveis via Shadcn/ui + Radix UI, e deploy contínuo.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) |
| Linguagem | TypeScript 5 |
| Estilização | Tailwind CSS v4 + OKLCH color system |
| Componentes | Shadcn/ui + Radix UI |
| Tema | next-themes (dark/light) |
| Ícones | Lucide React |
| Forms | React Hook Form + Zod |
| Notificações | Sonner |
| Deploy | VPS própria via Node.js / NVM |

---

## Seções

- **Hero** — apresentação, links sociais e disponibilidade
- **About** — perfil generalista, experiência com grandes empresas
- **Experience** — timeline de carreira (VFM Analytics, Natura, Modal as a Service)
- **Skills** — backend, frontend, mobile, banco de dados, cloud & DevOps
- **Projects** — grid dinâmico buscado em tempo real via Vercel API
- **Certifications** — certificações e formação acadêmica (FIAP)
- **Contact** — canais de contato e CTA

---

## Configuração Local

### Pré-requisitos

- Node.js 18+ (recomendado via [nvm](https://github.com/nvm-sh/nvm))
- npm 9+

### Instalação

```bash
# Clone o repositório
git clone https://github.com/victorMagdesian/portfolio-vps.git
cd portfolio-vps

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com seu VERCEL_API_TOKEN
```

### Variáveis de Ambiente

| Variável | Descrição | Obrigatório |
|---|---|---|
| `VERCEL_API_TOKEN` | Token de acesso à API da Vercel para buscar projetos | Sim |

Gere seu token em: **Vercel Dashboard → Settings → Tokens**

### Scripts

```bash
npm run dev      # Servidor de desenvolvimento em localhost:3000
npm run build    # Build de produção
npm run start    # Inicia o servidor de produção
npm run lint     # Verifica linting
```

---

## Estrutura do Projeto

```
portfolio-vps/
├── app/
│   ├── api/
│   │   └── vercel-projects/    # Endpoint que integra com Vercel API
│   ├── layout.tsx              # Root layout, metadata e fonte Geist
│   ├── page.tsx                # Composição das seções
│   └── globals.css             # Tailwind v4, OKLCH tokens, tema global
├── components/
│   ├── hero.tsx                # Seção de apresentação
│   ├── about.tsx               # Sobre mim
│   ├── experience.tsx          # Histórico profissional
│   ├── skills.tsx              # Competências técnicas
│   ├── vercel-projects.tsx     # Projetos (busca dinâmica)
│   ├── certifications.tsx      # Certificações e formação
│   ├── contact.tsx             # Contato e CTA
│   ├── theme-provider.tsx      # Wrapper next-themes
│   └── ui/                     # Shadcn/ui components
├── hooks/
│   ├── use-mobile.ts           # Breakpoint hook
│   └── use-toast.ts            # Toast hook
├── lib/
│   └── utils.ts                # cn() e utilitários
├── public/                     # Assets estáticos e favicons
└── start.sh                    # Script de inicialização em produção (NVM + port 3000)
```

---

## Deploy em Produção (VPS)

O site roda em VPS própria com Node.js gerenciado via NVM. O script `start.sh` carrega o ambiente e inicia o servidor Next.js na porta 3000.

```bash
# Build e start
npm run build
./start.sh
```

Para deploy automatizado, configure um processo supervisor como **PM2**:

```bash
pm2 start "npm start -- --port 3000" --name portfolio
pm2 save
```

---

## Contato

| Canal | |
|---|---|
| Email | [vicfemagdesian@gmail.com](mailto:vicfemagdesian@gmail.com) |
| LinkedIn | [linkedin.com/in/victor-felippe-magdesian-7a45051a7](https://www.linkedin.com/in/victor-felippe-magdesian-7a45051a7/) |
| GitHub | [github.com/victorMagdesian](https://github.com/victorMagdesian) |
| Localização | São Paulo — SP, Brasil |

---

<div align="center">

Feito com Next.js, Tailwind CSS e TypeScript · © 2025 Victor Felippe Magdesian

</div>
