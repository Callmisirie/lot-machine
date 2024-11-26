import Sidebar from "@/components/account/Sidebar";

export default async function RootLayout({ children }) {
  return (
    <main className="h-full w-full">
      <div className="h-full flex-grow flex justify-start items-center">
        <Sidebar />
        {children}
      </div>
    </main>
  );
}
