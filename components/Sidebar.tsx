"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <section className="sticky left-0 top-0 flex h-screen w-fit flex-col justify-between bg-white dark:bg-gray-900 p-6 pt-28 shadow-sm dark:shadow-gray-800/20 text-gray-900 dark:text-gray-100 max-sm:hidden lg:w-[264px] transition-all duration-300 ease-in-out border-r border-gray-100 dark:border-gray-800">
      <div className="flex flex-1 flex-col gap-6">
        {sidebarLinks.map((item) => {
          const isActive =
            pathname === item.route || pathname.startsWith(`${item.route}/`);

          return (
            <Link
              href={item.route}
              key={item.label}
              className={cn(
                "flex gap-4 items-center p-4 rounded-xl justify-start transition-all duration-200 ease-in-out",
                "hover:bg-gray-100 dark:hover:bg-gray-800/50 transform hover:scale-[1.02]",
                {
                  "bg-emerald-500 text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 shadow-md hover:shadow-lg":
                    isActive,
                  "text-gray-800 dark:text-gray-200": !isActive,
                }
              )}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={24}
                height={24}
                className={cn("transition-all duration-200", {
                  "opacity-100 brightness-100": isActive,
                  "opacity-75 group-hover:opacity-100": !isActive,
                })}
              />
              <p
                className={cn(
                  "text-lg font-semibold max-lg:hidden transition-colors duration-200",
                  {
                    "text-white": isActive,
                    "text-gray-800 dark:text-gray-200": !isActive,
                  }
                )}
              >
                {item.label}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Sidebar;
