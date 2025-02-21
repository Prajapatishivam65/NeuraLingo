import { Metadata } from "next";
import { ReactNode } from "react";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "YOOM",
  description: "A workspace for your team, powered by Stream Chat and Clerk.",
};

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main className="relative min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <section className="flex min-h-screen flex-1 flex-col bg-white dark:bg-gray-900 px-6 pb-6 pt-28 max-md:pb-14 sm:px-14 transition-colors duration-300">
          <div className="w-full max-w-7xl mx-auto">{children}</div>
        </section>
      </div>
    </main>
  );
};

export default RootLayout;
