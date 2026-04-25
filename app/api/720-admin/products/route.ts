import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyAdminToken, ADMIN_COOKIE } from "@/lib/shop-auth"
import { getShopDb, type Product } from "@/lib/shop-db"

async function guard() {
  const jar = await cookies()
  const t = jar.get(ADMIN_COOKIE)?.value
  return t ? verifyAdminToken(t) : false
}

export async function GET() {
  if (!(await guard())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  const db = getShopDb()
  const products = db
    .prepare(
      `SELECT p.*, g.name as group_name
       FROM products p LEFT JOIN groups g ON g.id = p.group_id
       ORDER BY p.sort_order ASC, p.id ASC`
    )
    .all()
  return NextResponse.json(products)
}

export async function POST(req: NextRequest) {
  if (!(await guard())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  const body = await req.json()
  const { name, description, price, cover_url, group_id, active, sort_order } = body

  if (!name || price == null) {
    return NextResponse.json({ error: "name e price são obrigatórios" }, { status: 400 })
  }

  const db = getShopDb()
  const result = db
    .prepare(
      `INSERT INTO products (name, description, price, cover_url, group_id, active, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      name,
      description || "",
      price,
      cover_url || "",
      group_id || null,
      active !== false ? 1 : 0,
      sort_order || 0
    )
  const product = db.prepare("SELECT * FROM products WHERE id = ?").get(result.lastInsertRowid) as Product
  return NextResponse.json(product, { status: 201 })
}
