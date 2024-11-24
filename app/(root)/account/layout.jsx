import Sidebar from "@/components/account/sidebar";

export default async function RootLayout({ children }) {
  return (
    <main className="h-full w-full">
      <div className="h-full w-full flex">
        <Sidebar />
        {children}
      </div>
    </main>
  );
}
