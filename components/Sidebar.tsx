"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <section className="sticky left-0 top-0 flex h-screen w-fit flex-col justify-between bg-gray-50 p-6 pt-28 text-gray-800 dark:bg-slate-800 dark:text-gray-200 max-sm:hidden lg:w-[264px] transition-colors duration-200">
      <div className="flex flex-1 flex-col gap-6">
        {sidebarLinks.map((item) => {
          const isActive =
            pathname === item.route || pathname.startsWith(`${item.route}/`);

          return (
            <Link
              href={item.route}
              key={item.label}
              className={cn(
                "flex gap-4 items-center p-4 rounded-lg justify-start transition-colors duration-200",
                "hover:bg-gray-200 dark:hover:bg-slate-700",
                {
                  "bg-emerald-500 text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700":
                    isActive,
                  "text-gray-700 dark:text-gray-200": !isActive,
                }
              )}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={24}
                height={24}
                className={cn("transition-opacity", {
                  "opacity-100": isActive,
                  "opacity-75": !isActive,
                })}
              />
              <p className="text-lg font-semibold max-lg:hidden">
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
