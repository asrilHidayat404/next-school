import { v4 as uuid } from "uuid";
import { encode as defaultEncode } from "next-auth/jwt";

import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { schema } from "./schema";
import db from "./db";
import bcrypt from "bcryptjs";
import { logActivity } from "../helpers/logActivity";

const adapter = PrismaAdapter(db);

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials: any): Promise<any> => {
        const validatedCredentials = schema.parse(credentials);

        const user = await db.user.findUnique({
          where: { email: validatedCredentials.email },
          include: {
            role: true,
          },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials.");
        }
        const match = await bcrypt.compare(
          validatedCredentials.password,
          user.password
        );
        if (!match) {
          throw new Error("Invalid credentials.");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === "credentials") {
        token.credentials = true;
      }
      return token;
    },
    async session({ session, user }): Promise<any> {
      const role = await db.role.findUnique({
        where: {
          id: user.role_id,
        },
      });

      const newSession = {
        ...session,
        user: {
          fullName: user.full_name,
          email: user.email,
          role: role?.role_name,
          avatar: user.avatar,
        },
      };
      return newSession;
    },
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuid();

        if (!params.token.sub || !params.token.email) {
          throw new Error("No user ID found in token");
        }

        const createdSession = await adapter?.createSession?.({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
        });
        

        if (!createdSession) {
          throw new Error("Failed to create session");
        }

        return sessionToken;
      }
      return defaultEncode(params);
    },
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      try {
        // Untuk signIn, kita belum punya request object di events
        // Jadi kita akan simpan dengan nilai default dulu
        await logActivity({
          userId: user.id,
          event: "USER_AUTHENTICATION",
          type: "Login",
          effected: `User: ${user.email || user.id}`,
          details: {
            provider: account?.provider,
            isNewUser: isNewUser,
            accountType: account?.type,
          },
        });
      } catch (error) {
        console.error("Failed to log signIn event:", error);
      }
    },

    async signOut({ session }: any) {
      const user = await db.user.findUnique({
        where: {
          id: session?.userId,
        },
      });

      try {
        await logActivity({
          userId: session?.userId ?? undefined,
          event: "USER_AUTHENTICATION",
          type: "Logout",
          effected: `User: ${user?.email || "unknown"}`,
          details: {
            sessionEnd: new Date().toISOString(),
          },
        });
      } catch (error) {
        console.error("Failed to log signOut event:", error);
      }
    },
  },
});
