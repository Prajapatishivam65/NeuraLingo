import { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
  useCall,
} from "@stream-io/video-react-sdk";
import { useRouter, useSearchParams } from "next/navigation";
import { Users, LayoutList, Mic, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Loader from "./Loader";
import EndCallButton from "./EndCallButton";
import { cn } from "@/lib/utils";

type CallLayoutType = "grid" | "speaker-left" | "speaker-right";

interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

interface WindowWithSpeechRecognition extends Window {
  SpeechRecognition: new () => SpeechRecognition;
  webkitSpeechRecognition: new () => SpeechRecognition;
}

declare const window: WindowWithSpeechRecognition;

const TranslationSidebar = ({
  isExpanded,
  setIsExpanded,
}: {
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
}) => {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("es");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join("");
        setRecognizedText(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        setError("Speech recognition error. Please try again.");
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      setError("Speech recognition is not supported in this browser.");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
      setError(null);
    }
  };

  const translateText = async () => {
    if (!recognizedText) {
      setError("Please speak something before translating.");
      return;
    }

    try {
      const encodedText = encodeURIComponent(recognizedText);
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=en|${targetLanguage}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.responseData && data.responseData.translatedText) {
        setTranslatedText(data.responseData.translatedText);
        setError(null);
      } else if (data.responseStatus && data.responseStatus !== 200) {
        throw new Error(data.responseStatus);
      } else {
        throw new Error("Unknown translation error");
      }
    } catch (error) {
      console.error("Translation error:", error);
      setError(
        `Translation failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-full bg-[#19232d] transition-all duration-300 z-10 text-white",
        isExpanded ? "w-80" : "w-16"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className={cn("font-semibold", !isExpanded && "hidden")}>
            Speech Translation
          </h2>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-[#4c535b] rounded-lg transition-colors"
          >
            {isExpanded ? "←" : "→"}
          </button>
        </div>

        {isExpanded && (
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button
                  onClick={toggleListening}
                  className="flex items-center gap-2"
                >
                  <Mic size={16} />
                  {isListening ? "Stop" : "Start"}
                </Button>

                <Select onValueChange={(value) => setTargetLanguage(value)}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="it">Italian</SelectItem>
                    <SelectItem value="pt">Portuguese</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={translateText}
                className="w-full flex items-center gap-2"
              >
                <Languages size={16} />
                Translate
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <h3 className="font-semibold">Recognized Text:</h3>
              <p className="p-2 bg-[#2a3441] rounded">{recognizedText}</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Translated Text:</h3>
              <p className="p-2 bg-[#2a3441] rounded">{translatedText}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const MeetingRoom = () => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get("personal");
  const router = useRouter();
  const [layout, setLayout] = useState<CallLayoutType>("speaker-left");
  const [showParticipants, setShowParticipants] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const call = useCall();

  useEffect(() => {
    if (call) {
      call.camera.enable().catch(console.error);
      call.microphone.enable().catch(console.error);
    }
  }, [call]);

  if (callingState !== CallingState.JOINED) return <Loader />;

  const CallLayout = () => {
    switch (layout) {
      case "grid":
        return <PaginatedGridLayout />;
      case "speaker-right":
        return <SpeakerLayout participantsBarPosition="left" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <TranslationSidebar
        isExpanded={isSidebarExpanded}
        setIsExpanded={setIsSidebarExpanded}
      />

      <div
        className={cn(
          "relative flex size-full items-center justify-center transition-all duration-300",
          isSidebarExpanded ? "ml-80" : "ml-16"
        )}
      >
        <div className="flex size-full max-w-[1000px] items-center">
          <CallLayout />
        </div>
        {showParticipants && (
          <div className="h-[calc(100vh-86px)] ml-2">
            <CallParticipantsList onClose={() => setShowParticipants(false)} />
          </div>
        )}
      </div>

      <div className="fixed bottom-0 flex w-full items-center justify-center gap-5">
        <CallControls onLeave={() => router.push(`/`)} />

        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
            <LayoutList size={20} className="text-white" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
            {["Grid", "Speaker-Left", "Speaker-Right"].map((item, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => setLayout(item.toLowerCase() as CallLayoutType)}
              >
                {item}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <CallStatsButton />

        <button onClick={() => setShowParticipants((prev) => !prev)}>
          <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
            <Users size={20} className="text-white" />
          </div>
        </button>

        {!isPersonalRoom && <EndCallButton />}
      </div>
    </section>
  );
};

export default MeetingRoom;
