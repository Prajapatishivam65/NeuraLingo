"use client";

import { ReactNode } from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import Image from "next/image";
import { useTheme } from "next-themes";

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  className?: string;
  children?: ReactNode;
  handleClick?: () => void;
  buttonText?: string;
  instantMeeting?: boolean;
  image?: string;
  buttonClassName?: string;
  buttonIcon?: string;
}

const MeetingModal = ({
  isOpen,
  onClose,
  title,
  className,
  children,
  handleClick,
  buttonText,
  image,
  buttonIcon,
}: MeetingModalProps) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "flex w-full max-w-[520px] flex-col gap-6 rounded-2xl border p-8 shadow-lg transform transition-all duration-300 ease-in-out hover:scale-[1.02]",
          isDarkMode
            ? "bg-dark-1 border-gray-700 text-white backdrop-blur-sm backdrop-filter"
            : "bg-white/90 border-gray-300 text-black"
        )}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <div className="flex flex-col gap-6">
          {image && (
            <div className="flex justify-center transition-transform duration-300 hover:scale-110">
              <Image
                src={image}
                alt="checked"
                width={72}
                height={72}
                className="drop-shadow-lg"
              />
            </div>
          )}

          <h1
            className={cn(
              "text-3xl font-bold leading-[42px] text-center tracking-tight",
              isDarkMode ? "text-white" : "text-gray-800",
              "animate-in fade-in duration-500",
              className
            )}
          >
            {title}
          </h1>

          <div className="space-y-4 transition-all duration-300">
            {children}
          </div>

          <Button
            className={cn(
              "w-full flex items-center justify-center gap-2 rounded-lg py-3 text-lg font-medium",
              "transform transition-all duration-300 ease-in-out",
              "hover:scale-[1.02] hover:shadow-lg",
              isDarkMode
                ? "bg-blue-600 hover:bg-blue-500 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-dark-1 rounded-md"
                : "bg-blue-500 hover:bg-blue-400 focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-white rounded-md",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            onClick={handleClick}
          >
            {buttonIcon && (
              <Image
                src={buttonIcon}
                alt="button icon"
                width={16}
                height={16}
                className="transition-transform group-hover:scale-110"
              />
            )}
            {buttonText || "Schedule Meeting"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingModal;
