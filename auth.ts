
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (
          typeof email !== "string" ||
          typeof password !== "string" ||
          !email.trim() ||
          !password
        ) {
          return null;
        }

        await connectDB();

        const user = await User.findOne({
          email: email.trim().toLowerCase(),
        });

        if (!user) {
          return null;
        }

        const passwordMatches = await bcrypt.compare(
          password,
          user.passwordHash
        );

        if (!passwordMatches) {
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  
callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id;
      token.role = user.role;
    }

    return token;
  },

  async session({ session, token }) {
    if (session.user && token.id && token.role) {
      session.user.id = token.id;
      session.user.role = token.role;
    }

    return session;
  },
},


  pages: {
    signIn: "/login",
  },
});
