import Sidebar from "@/components/account/sidebar";

export default async function RootLayout({ children }) {
  return (
    <main className="h-full w-full">
      <div className="h-full flex-grow flex justify-center items-center">
        <Sidebar />
        {children}
      </div>
    </main>
  );
}
