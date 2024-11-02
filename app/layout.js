import "./globals.css";
import NextAuthProvider from "./Providers";
import localfont from "next/font/local";

const poppins = localfont({
  src: "./fonts/Poppins-Regular.ttf",
  variable: "--font-poppins", 
  display: "swap"
})

const montserrat = localfont({
  src: "./fonts/Montserrat-Regular.ttf",
  variable: "--font-montserrat", 
  display: "swap"
})

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
