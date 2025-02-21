"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { avatarImages } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";

interface MeetingCardProps {
  title: string;
  date: string;
  icon: string;
  isPreviousMeeting?: boolean;
  buttonIcon1?: string;
  buttonText?: string;
  handleClick: () => void;
  link: string;
}

const MeetingCard = ({
  icon,
  title,
  date,
  isPreviousMeeting,
  buttonIcon1,
  handleClick,
  link,
  buttonText,
}: MeetingCardProps) => {
  const { toast } = useToast();

  return (
    <section className="flex min-h-[258px] w-full flex-col justify-between rounded-[14px] bg-gray-100 dark:bg-slate-800 px-5 py-8 xl:max-w-[568px] shadow-md">
      <article className="flex flex-col gap-5">
        <Image src={icon} alt="upcoming" width={28} height={28} />
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>
            <p className="text-base font-normal text-gray-600 dark:text-gray-300">
              {date}
            </p>
          </div>
        </div>
      </article>
      <article className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative flex w-full max-w-[180px] max-sm:hidden">
          {avatarImages.map((img, index) => (
            <Image
              key={index}
              src={img}
              alt="attendees"
              width={40}
              height={40}
              className={cn(
                "rounded-full border-2 border-white dark:border-slate-800",
                { absolute: index > 0 }
              )}
              style={{ top: 0, left: index * 28 }}
            />
          ))}
          <div className="flex-center absolute left-[136px] size-10 rounded-full border-[5px] border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-600 text-gray-900 dark:text-white">
            +5
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            onClick={handleClick}
            className="flex-1 sm:flex-none rounded bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 px-6 text-white"
          >
            {buttonIcon1 && (
              <Image src={buttonIcon1} alt="feature" width={20} height={20} />
            )}
            <span className="ml-2">{buttonText}</span>
          </Button>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(link);
              toast({
                title: "Link Copied",
              });
            }}
            className="flex-1 sm:flex-none bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 px-6 text-gray-900 dark:text-white rounded-md"
          >
            <Copy className="size-5" />
            <span className="ml-2">Copy Link</span>
          </Button>
        </div>
      </article>
    </section>
  );
};

export default MeetingCard;
