import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyAdminToken, ADMIN_COOKIE } from "@/lib/shop-auth"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

async function guard() {
  const jar = await cookies()
  const t = jar.get(ADMIN_COOKIE)?.value
  return t ? verifyAdminToken(t) : false
}

export async function POST(req: NextRequest) {
  if (!(await guard())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get("file") as File | null

  if (!file) return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 })

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"]
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: "Apenas imagens JPEG, PNG, WebP ou GIF" }, { status: 400 })
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Tamanho máximo: 5MB" }, { status: 400 })
  }

  const ext = file.name.split(".").pop() || "jpg"
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const uploadsDir = path.join(process.cwd(), "public", "uploads", "shop")

  await mkdir(uploadsDir, { recursive: true })
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(uploadsDir, filename), buffer)

  return NextResponse.json({ url: `/uploads/shop/${filename}` })
}
