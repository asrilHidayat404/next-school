import { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      fullName: string
      email: string
      role: string
      avatar?: string | null
    } & DefaultSession["user"]
    userId?: string // opsional, karena tidak selalu diisi
  }

  interface User extends DefaultUser {
    id: string
    full_name: string
    role_id: number
    avatar?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    credentials?: boolean
  }
}
