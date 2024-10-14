import "./globals.css";
import NextAuthProvider from "./Providers";
import { Montserrat } from "next/font/google";
import localfont from "next/font/local";

const poppins = localfont({
  src: "./fonts/Poppins-Regular.ttf",
  variable: "--font-poppins", 
  display: "swap"
})

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
            {children}
          </div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
