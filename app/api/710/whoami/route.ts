import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyBuyerToken, SHOP_COOKIE, formatPhone } from "@/lib/shop-auth"

export async function GET() {
  const jar = await cookies()
  const token = jar.get(SHOP_COOKIE)?.value
  const session = token ? await verifyBuyerToken(token) : null
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  return NextResponse.json({ phone: formatPhone(session.phone), rawPhone: session.phone })
}
