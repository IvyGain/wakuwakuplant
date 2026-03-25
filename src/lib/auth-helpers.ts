import { auth } from "@/lib/auth"
import type { Role } from "@/generated/prisma/client"

/**
 * Shape of the session user as augmented by the JWT callback in auth.ts.
 * Next-auth's default Session["user"] does not include `role`, so we extend
 * it locally here rather than re-opening the module globally.
 */
export interface SessionUser {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  role: Role
}

/**
 * Returns the currently authenticated user, or `null` when there is no
 * active session.  Safe to call in Server Components and Route Handlers.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await auth()

  if (!session?.user?.id) {
    return null
  }

  const user = session.user as typeof session.user & { role?: Role }

  return {
    id: session.user.id,
    name: session.user.name ?? null,
    email: session.user.email ?? null,
    image: session.user.image ?? null,
    role: user.role ?? "GENERAL",
  }
}

/**
 * Returns the currently authenticated user and throws a 401-equivalent error
 * when there is no active session.
 *
 * Use this inside Server Components or Route Handlers that require login.
 *
 * @throws {Error} with `status: 401` if there is no active session.
 */
export async function requireAuth(): Promise<SessionUser> {
  const user = await getCurrentUser()

  if (!user) {
    const error = new Error("Authentication required") as Error & {
      status: number
    }
    error.status = 401
    throw error
  }

  return user
}

/**
 * Returns the currently authenticated user and throws a 403-equivalent error
 * when the user's role is not included in the allowed `roles` array.
 *
 * @param roles - Array of roles that are permitted to proceed.
 * @throws {Error} with `status: 401` if not authenticated.
 * @throws {Error} with `status: 403` if authenticated but role is insufficient.
 */
export async function requireRole(roles: Role[]): Promise<SessionUser> {
  const user = await requireAuth()

  if (!roles.includes(user.role)) {
    const error = new Error(
      `Forbidden: requires one of [${roles.join(", ")}]`
    ) as Error & { status: number }
    error.status = 403
    throw error
  }

  return user
}
