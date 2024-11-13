import TanStackProvider from "@/components/Providers/TanStackProvider";
import "./globals.css";
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
        <TanStackProvider>
          <div className="font-poppins h-screen w-full overflow-hidden bg-custom-opacity-15">
            {children}
          </div>
        </TanStackProvider>
      </body>
    </html>
  );
}
