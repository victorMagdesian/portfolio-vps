import { NextRequest, NextResponse } from "next/server"
import { checkAdminPassword, signAdminToken, ADMIN_COOKIE } from "@/lib/shop-auth"

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  if (!checkAdminPassword(password)) {
    return NextResponse.json({ error: "Senha incorreta" }, { status: 401 })
  }
  const token = await signAdminToken()
  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  })
  return res
}
