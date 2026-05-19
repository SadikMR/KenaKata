import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const protectedPaths = [
  "/profile",
  "/checkout",
  "/order-confirmation",
  "/cart",
]

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl

  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )

  if (!isProtected) {
    return NextResponse.next()
  }

  const userSession = req.cookies.get("user-session")?.value

  if (userSession) {
    return NextResponse.next()
  }

  const loginUrl = new URL("/login", req.url)
  loginUrl.searchParams.set("redirect", `${pathname}${search}`)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/checkout/:path*",
    "/order-confirmation/:path*",
    "/cart/:path*",
  ],
}
