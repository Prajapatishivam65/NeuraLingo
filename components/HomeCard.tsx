"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Video, UserPlus, Calendar, PlaySquare } from "lucide-react";

interface HomeCardProps {
  className?: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  handleClick?: () => void;
}

const HomeCard = ({
  className,
  icon,
  title,
  description,
  handleClick,
}: HomeCardProps) => {
  const { theme } = useTheme();

  return (
    <section
      className={cn(
        "relative px-6 py-8 flex flex-col justify-between w-full xl:max-w-[300px] min-h-[280px] rounded-2xl cursor-pointer",
        "transition-all duration-300 ease-in-out hover:translate-y-[-5px] hover:shadow-lg",
        "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/30",
        "border border-orange-200 dark:border-orange-700/50",
        "shadow-sm dark:shadow-orange-900/10",
        className
      )}
      onClick={handleClick}
    >
      <div
        className="flex-center size-14 rounded-xl overflow-hidden
        bg-white/70 dark:bg-slate-800/60 backdrop-blur-sm
        border border-orange-200/50 dark:border-orange-700/30
        shadow-md dark:shadow-orange-900/10"
      >
        {icon}
      </div>

      <div className="flex flex-col gap-3 mt-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-orange-100">
          {title}
        </h2>
        <p className="text-base text-gray-600 dark:text-gray-300">
          {description}
        </p>
      </div>

      {/* Decorative element */}
      <div
        className="absolute top-4 right-4 size-3 rounded-full 
        bg-orange-400 dark:bg-orange-500 opacity-70"
      ></div>
      <div
        className="absolute bottom-4 right-8 size-5 rounded-full 
        bg-orange-300 dark:bg-orange-700 opacity-40"
      ></div>
    </section>
  );
};

export default HomeCard;
