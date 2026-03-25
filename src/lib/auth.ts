import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { db } from "@/lib/db"
import type { Role } from "@/generated/prisma/client"

/**
 * Minimal password comparison for MVP demo.
 * TODO: Replace with bcrypt once `npm install bcryptjs` is added:
 *   import bcrypt from "bcryptjs"
 *   return bcrypt.compare(plainText, hashed)
 */
async function comparePasswords(
  plainText: string,
  stored: string
): Promise<boolean> {
  // TODO: swap for proper bcrypt comparison in production
  return plainText === stored
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),

  session: { strategy: "jwt" },

  pages: {
    signIn: "/login",
    newUser: "/signup",
  },

  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email
        const password = credentials?.password

        if (typeof email !== "string" || typeof password !== "string") {
          return null
        }

        const user = await db.user.findUnique({
          where: { email },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            password: true,
          },
        })

        if (!user || !user.password) {
          return null
        }

        const isValid = await comparePasswords(password, user.password)
        if (!isValid) {
          return null
        }

        // Return without exposing the stored password
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        }
      },
    }),

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],

  callbacks: {
    authorized({ auth: session, request }) {
      const isLoggedIn = !!session?.user
      const isProtected = request.nextUrl.pathname.startsWith("/ideas/new") ||
        request.nextUrl.pathname.startsWith("/mypage") ||
        request.nextUrl.pathname.startsWith("/profile") ||
        request.nextUrl.pathname.startsWith("/admin")

      if (isProtected && !isLoggedIn) {
        return false // redirect to login
      }
      return true // allow access
    },

    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
        // user.role is set by Credentials.authorize or fetched from the DB
        // adapter profile for OAuth users after first sign-in.
        token.role = (user as { role?: Role }).role ?? "GENERAL"
      }
      return token
    },

    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      if (session.user) {
        // @ts-expect-error - augmented session type
        session.user.role = (token.role as Role) ?? "GENERAL"
      }
      return session
    },
  },
})
