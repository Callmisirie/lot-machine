import Navbar from "@/components/Navbar";

export default async function RootLayout({children}) {

  return (
    <main className="flex h-screen w-full">
      <Navbar />
        {children}        
    </main>
  );
}