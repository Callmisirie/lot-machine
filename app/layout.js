import "./globals.css";
import Navbar from "@/components/Navbar";
import NextAuthProvider from "./Providers";
import { Poppins, Montserrat} from "next/font/google"
import { lmLogo } from "@/public";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-poppins",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-montserrat",
});

export const metadata = {
  title: "Lot machine",
  description: "Enjoy the full benefits of your trading positions.",
  icons: {
    icon: "/lmLogo.png"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${montserrat.variable} antialiased`}
      >
        <NextAuthProvider>
          <div className="font-poppins h-screen w-full bg-custom-opacity-15">
            <Navbar />
            {children}
          </div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
