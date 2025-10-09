import { NextRequest, NextResponse } from "next/server"
import { accessRules } from "./src/lib/access-rules"
import { auth } from "./src/lib/auth"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = await auth()

  // 🔒 jika belum login
  if (pathname.startsWith("/dashboard") && !session) {
    const loginUrl = new URL("/sign-in", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 🎯 otorisasi role
  if (pathname.startsWith("/dashboard") && session) {
    const allowed = accessRules.some(
      (rule) => rule.pattern.test(pathname) && rule.roles.includes(session.user.role)
    )

    if (!allowed) {
      return NextResponse.redirect(new URL("/403", request.url)) // bikin page 403
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
  runtime: "nodejs",
}
