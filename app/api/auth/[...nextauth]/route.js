import userAuth from "@/actions/user";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({user, account}) {
      if (account.provider === "google") {
        const {name, email} = user;        
        const activeUser = await userAuth(name, email);

        if (activeUser) {
          return true;
        } else {
          return false;
        }
      }
    },
    async jwt({token, account}) {
      if (account) {
        token.access_token = account.access_token;
      }
      return token;
    }, 
    async session({session, token}) {
      session.access_token = token.access_token;
      return session;
    }
  }
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};