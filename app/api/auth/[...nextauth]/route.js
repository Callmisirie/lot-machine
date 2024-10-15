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
      console.log("User: ", user);

      if (account.provider === "google") {
        const {name, email} = user;        
        userAuth(name, email);
      }
      return user;
    }
  }
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};