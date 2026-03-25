import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Simple middleware that only protects specific routes
// Without importing auth (which pulls in Prisma/Node modules)
export function middleware(request: NextRequest) {
  const protectedPaths = ["/ideas/new", "/mypage", "/profile", "/admin"]
  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  )

  if (isProtected) {
    // Check for session token cookie (NextAuth v5 uses this)
    const sessionToken =
      request.cookies.get("authjs.session-token")?.value ||
      request.cookies.get("__Secure-authjs.session-token")?.value

    if (!sessionToken) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/ideas/new",
    "/mypage",
    "/profile",
    "/admin/:path*",
  ],
}
