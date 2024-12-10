import Sidebar from "@/components/account/Sidebar";

export default async function RootLayout({ children }) {
  return (
    <main className="h-full w-full">
      <div className="h-full flex-grow flex max-md:flex-col justify-start items-center transition-all duration-300">
        <Sidebar />
        {children}
      </div>
    </main>
  );
}
