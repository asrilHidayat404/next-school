import { v4 as uuid } from "uuid";
import { encode as defaultEncode } from "next-auth/jwt";

import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { schema } from "./schema";
import db from "./db";
import bcrypt from "bcryptjs";

const adapter = PrismaAdapter(db);

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const validatedCredentials = schema.parse(credentials);

        const user = await db.user.findUnique({
          where: { email: validatedCredentials.email },
          include: {
            role: true,
          },
        });

        if (!user) {
          throw new Error("Invalid credentials.");
        }

        if (!user.password) {
          throw new Error("Invalid credentials.");
        }

        const match = await bcrypt.compare(
          validatedCredentials.password,
          user.password
        );
        console.log({match})
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
    async session({ session, user }) {
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

        if (!params.token.sub) {
          throw new Error("No user ID found in token");
        }

        const createdSession = await adapter?.createSession?.({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
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
        await db.activityLog.create({
          data: {
            userId: user.id,
            event: "USER_AUTHENTICATION",
            type: "Login",
            effected: `User: ${user.email || user.id}`,
            details: {
              provider: account?.provider,
              isNewUser: isNewUser,
              accountType: account?.type,
            },
            ipAddress: "system", // Akan diupdate via middleware
            userAgent: "system", // Akan diupdate via middleware
            timestamp: new Date(),
          },
        });
      } catch (error) {
        console.error("Failed to log signIn event:", error);
      }
    },

    async signOut({ session }) {
      const user = await db.user.findUnique({
        where: {
          id: session?.userId
        }
      })
      
      try {
        await db.activityLog.create({
          data: {
            userId: session?.userId ?? undefined,
            event: "USER_AUTHENTICATION",
            type: "Logout",
            effected: `User: ${
              user?.email || "unknown"
            }`,
            details: {
              sessionEnd: new Date().toISOString(),
            },
            ipAddress: "system",
            userAgent: "system",
            timestamp: new Date(),
          },
        });
      } catch (error) {
        console.error("Failed to log signOut event:", error);
      }
    },
  },
});
