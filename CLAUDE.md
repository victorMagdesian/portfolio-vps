# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # development server on localhost:3000
npm run build    # production build
npm run start    # start production server
npm run lint     # ESLint check
```

There are no tests in this project.

For production on the VPS, `start.sh` loads Node via NVM and runs `npm start` on port 3000.

## Required Environment Variable

`VERCEL_API_TOKEN` — Vercel personal access token used by the API route at `app/api/vercel-projects/route.ts`. Without it, the Projects section returns a 500 and shows an error state client-side.

## Architecture

Single-page portfolio built with Next.js 16 App Router. `app/page.tsx` is the sole page, composing seven section components in order: Hero → About → Experience → Skills → VercelProjects → Certifications → Contact.

**Styling** uses Tailwind CSS v4 (PostCSS plugin, no `tailwind.config.js`). Theme tokens are OKLCH CSS custom properties defined in `app/globals.css` under `:root` (dark-first defaults) and `.dark`. The `@theme inline` block maps them to Tailwind color utilities. Do not use hex/hsl values — extend tokens in `globals.css` if new colors are needed.

**Components** follow Shadcn/ui "new-york" style. Primitives live in `components/ui/` and should be regenerated via `npx shadcn@latest add <component>` rather than hand-edited. Section components (`hero.tsx`, `experience.tsx`, etc.) are all Server Components except `vercel-projects.tsx`, which is `"use client"` because it fetches at runtime.

**Vercel Projects integration**: `app/api/vercel-projects/route.ts` is a cached API route (`revalidate = 3600`) that paginates the Vercel v9 API, filters for READY deployments, and picks the best alias (custom domain preferred over `.vercel.app`). The client component `vercel-projects.tsx` fetches this route on mount and renders a card grid. The alias filter in `isValidAlias` excludes the owner's Vercel team slug — update that string if the Vercel account changes.

**Build config**: `next.config.mjs` has `typescript.ignoreBuildErrors: true` and `images.unoptimized: true`. TypeScript errors won't fail the build; fix them but don't rely on the build gate to catch them.

**Path alias**: `@/` maps to the project root (defined in `tsconfig.json`).
