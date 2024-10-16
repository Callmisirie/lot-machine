import Navbar from "@/components/Navbar";

export default async function RootLayout({children}) {

  return (
    <main className="">
      <Navbar />
        {children}        
    </main>
  );
}