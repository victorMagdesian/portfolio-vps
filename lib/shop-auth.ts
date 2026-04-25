import { SignJWT, jwtVerify } from "jose"

const SHOP_SECRET = new TextEncoder().encode(
  process.env.SHOP_JWT_SECRET || "shop-710-secret-change-in-production"
)
const ADMIN_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "admin-720-secret-change-in-production"
)

const BUYER_PASSWORD = "oil4202025"
const ADMIN_PASSWORD = "magnesio1224"

export const SHOP_COOKIE = "shop_auth_710"
export const ADMIN_COOKIE = "admin_auth_720"

// ─── Phone helpers ──────────────────────────────────────────────────────────

/** Strip all non-digits */
export function normalizePhone(raw: string): string {
  return raw.replace(/\D/g, "")
}

/**
 * Validates a Brazilian phone number with DDD.
 * Accepts 10 digits (landline) or 11 digits (mobile with leading 9).
 * Returns an error string or null if valid.
 */
export function validatePhone(raw: string): string | null {
  if (!raw) return "Telefone obrigatório"
  const digits = normalizePhone(raw)
  if (digits.length < 10) return "Número incompleto — informe DDD + número"
  if (digits.length > 11) return "Número inválido — dígitos em excesso"
  const ddd = parseInt(digits.substring(0, 2), 10)
  const validDDDs = [
    11, 12, 13, 14, 15, 16, 17, 18, 19, // SP
    21, 22, 24,                          // RJ
    27, 28,                              // ES
    31, 32, 33, 34, 35, 37, 38,          // MG
    41, 42, 43, 44, 45, 46,              // PR
    47, 48, 49,                          // SC
    51, 53, 54, 55,                      // RS
    61,                                  // DF
    62, 64,                              // GO
    63,                                  // TO
    65, 66,                              // MT
    67,                                  // MS
    68,                                  // AC
    69,                                  // RO
    71, 73, 74, 75, 77,                  // BA
    79,                                  // SE
    81, 87,                              // PE
    82,                                  // AL
    83,                                  // PB
    84,                                  // RN
    85, 88,                              // CE
    86, 89,                              // PI
    91, 93, 94,                          // PA
    92, 97,                              // AM
    95,                                  // RR
    96,                                  // AP
    98, 99,                              // MA
  ]
  if (!validDDDs.includes(ddd)) return "DDD inválido"
  if (digits.length === 11 && digits[2] !== "9") return "Celular deve começar com 9 após o DDD"
  return null
}

/** Format for display: (11) 99999-9999 or (11) 9999-9999 */
export function formatPhone(digits: string): string {
  const d = normalizePhone(digits)
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return d
}

// ─── JWT helpers ─────────────────────────────────────────────────────────────

export async function signBuyerToken(phone: string): Promise<string> {
  return new SignJWT({ phone })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("365d")
    .sign(SHOP_SECRET)
}

export async function verifyBuyerToken(token: string): Promise<{ phone: string } | null> {
  try {
    const { payload } = await jwtVerify(token, SHOP_SECRET)
    return { phone: payload.phone as string }
  } catch {
    return null
  }
}

export async function signAdminToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(ADMIN_SECRET)
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, ADMIN_SECRET)
    return true
  } catch {
    return false
  }
}

export function checkBuyerPassword(password: string): boolean {
  return password === BUYER_PASSWORD
}

export function checkAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD
}
