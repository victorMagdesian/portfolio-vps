import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Experience } from "@/components/experience"
import { Skills } from "@/components/skills"
import { VercelProjects } from "@/components/vercel-projects"
import { Certifications } from "@/components/certifications"
import { Contact } from "@/components/contact"

export default function Page() {
  return (
    <div className="min-h-screen">
      <Hero />
      <About />
      <Experience />
      <Skills />
      <VercelProjects />
      <Certifications />
      <Contact />
    </div>
  )
}
