import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      fullName: string;
      avatar: string;
      role: string;
    } & DefaultSession["user"];
    userId: string
  }

  interface User extends DefaultUser {
    id: string;
    full_name: string;
    role: string;
    avatar: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}
