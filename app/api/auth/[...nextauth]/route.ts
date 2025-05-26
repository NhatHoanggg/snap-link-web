import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    idToken?: string;
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const response = await fetch("https://snaplink-itqaz.ondigitalocean.app/check-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: user.email }),
          });

          const data = await response.json();
          
          if (!data.exists) {
            return "/auth/google/register?email=" + encodeURIComponent(user.email || "") + 
               "&name=" + encodeURIComponent(user.name || "");
          }
        console.log("user", user);
        return true;
        } catch (error) {
          console.error("Error checking email:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      return {
        ...session,
        accessToken: token.accessToken,
        idToken: token.idToken,
      };
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          idToken: account.id_token,
        };
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST }; 