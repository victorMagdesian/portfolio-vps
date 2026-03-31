import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Experience } from "@/components/experience"
import { Skills } from "@/components/skills"
import { Certifications } from "@/components/certifications"
import { Contact } from "@/components/contact"

export default function Page() {
  return (
    <div className="min-h-screen">
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Certifications />
      <Contact />
    </div>
  )
}
