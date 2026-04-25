import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "710",
  robots: "noindex, nofollow",
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children
}
