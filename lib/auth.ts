import NextAuth, { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";

const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase());

export const authOptions: NextAuthOptions = {
  // Use a simple JWT strategy — no database needed for admin auth
  session: { strategy: "jwt" },
  providers: [
    // Simple credential login (username = email, password = NEXTAUTH_SECRET)
    // Suitable for small clubs without email SMTP setup
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@rcsb.in" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const email = credentials.email.toLowerCase();
        const password = credentials.password;
        // Validate: email on allowlist AND password matches NEXTAUTH_SECRET
        if (adminEmails.includes(email) && password === process.env.NEXTAUTH_SECRET) {
          return { id: "1", email, name: "RCSB Admin" };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.email = user.email;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.email = token.email as string;
      return session;
    },
  },
};

export default NextAuth(authOptions);
