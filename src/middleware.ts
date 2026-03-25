export { auth as middleware } from "@/lib/auth"

export const config = {
  matcher: [
    // Only protect specific routes that require auth
    "/ideas/new",
    "/mypage",
    "/profile",
    "/admin/:path*",
  ],
}
