import Navbar from "@/components/Navbar";

export default async function RootLayout({ children }) {
  return (
    <main className="h-screen w-full flex flex-col">
      <Navbar />
      <div className="flex-grow flex justify-center items-center">
        {children}
      </div>
    </main>
  );
}
