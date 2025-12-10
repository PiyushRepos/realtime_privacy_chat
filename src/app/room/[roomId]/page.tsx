"use client";
import { client } from "@/app/lib/client";
import { useRealtime } from "@/app/lib/realtime-client";
import { useUsername } from "@/hooks/use-username";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useRef, useState } from "react";

const formatTimeRemaining = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const Page = () => {
  const { roomId } = useParams<{ roomId: string }>();

  const [copyStatus, setCopyStatus] = useState<"COPY" | "COPIED!">("COPY");
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const { username, isLoaded } = useUsername();
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

  const { data: ttlData } = useQuery({
    queryKey: ["ttl", roomId],
    queryFn: async () => {
      const res = await client.room.ttl.get({ query: { roomId } });
      return res.data;
    },
  });

  useEffect(() => {
    if (timeRemaining == null || timeRemaining < 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev == null || prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, router]);

  const updateProfile = useEffectEvent((ttlData: { ttl: number }) => {
    setTimeRemaining(ttlData?.ttl ?? null);
  });

  useEffect(() => {
    if (ttlData) {
      updateProfile(ttlData);
    }
  }, [ttlData]);

  const { data: messages, refetch } = useQuery({
    queryKey: ["messages", roomId],
    queryFn: async () => {
      const res = await client.messages.get({ query: { roomId } });
      return res.data;
    },
  });

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async ({ text }: { text: string }) => {
      await client.messages.post(
        { sender: username, text },
        { query: { roomId } }
      );
      setInput("");
    },
  });

  useRealtime({
    channels: [roomId],
    events: ["chat.message", "chat.destroy"],
    onData: ({ event }) => {
      if (event === "chat.message") {
        refetch();
      }

      if (event === "chat.destroy") {
        router.push(`/?destroyed=true`);
      }
    },
  });

  const { mutate: destroyRoom } = useMutation({
    mutationFn: async () => {
      await client.room.delete({}, { query: { roomId } });
    },
  });

  const copyLink = () => {
    if (!window) return;
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopyStatus("COPIED!");

    setTimeout(() => setCopyStatus("COPY"), 2000);
  };

  return (
    <main className="flex flex-col h-screen max-h-screen overflow-hidden">
      <header className="border-b border-zinc-800 p-4 flex items-center justify-between bg-zinc-900/30">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-zinc-500 uppercase">Room ID</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-green-500">{roomId}</span>
              <button
                onClick={copyLink}
                className="text-[10px] py-0.5 rounded hover:text-zinc-200 text-zinc-400 transition-colors px-2 bg-zinc-800 hover:bg-zinc-700 cursor-pointer"
              >
                {copyStatus}
              </button>
            </div>
          </div>
          <div className="h-8 w-px bg-zinc-800" />
          <div className="flex flex-col">
            <span className="text-xs text-zinc-500 uppercase">
              Self Destruct
            </span>
            <span
              className={`text-sm font-bold flex items-center gap-2 ${
                timeRemaining != null && timeRemaining < 60
                  ? "text-red-500"
                  : "text-amber-500"
              }`}
            >
              {formatTimeRemaining(timeRemaining ?? 0)}
            </span>
          </div>
        </div>
        <button
          onClick={() => destroyRoom()}
          className="text-xs uppercase bg-zinc-800 hover:bg-red-600 px-3 py-1.5 rounded text-zinc-400 hover:text-white font-bold transition-all group flex items-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          <span className="group-hover:animate-pulse">💣</span>
          Destroy Now
        </button>
      </header>

      {/* NOTE: Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages?.messages.length === 0 && (
          <div className="flex justify-center items-center h-full">
            <p className="text-zinc-600 text-sm font-mono">
              No messages yet. Start the conversation
            </p>
          </div>
        )}

        {messages?.messages.map((message) => (
          <div key={message.id} className="flex flex-col items-start">
            <div className="flex items-baseline gap-3 mb-1">
              <span
                className={`text-xs font-bold ${
                  message.sender === username
                    ? "text-green-500"
                    : "text-blue-500"
                }`}
              >
                {isLoaded
                  ? message.sender === username
                    ? "You"
                    : message.sender
                  : "Loading..."}
              </span>
              <span className="text-[10px] text-zinc-600">
                {format(message.timestamp, "hh:mm a")}
              </span>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed break-all">
              {message.text}
            </p>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-zinc-800 bg-zinc-900/30">
        <div className="flex gap-4">
          <div className="flex-1 relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500 animate-pulse">
              &gt;
            </span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                console.log(e.key);
                if (e.key === "Enter" && input.trim()) {
                  sendMessage({ text: input.trim() });
                  inputRef.current?.focus();
                }
              }}
              ref={inputRef}
              type="text"
              placeholder="Type message..."
              className="w-full bg-black border border-zinc-800 focus:border-zinc-700 focus:outline-none transition-colors text-zinc-100 placeholder:text-zinc-700 py-3 pl-8 pr-4 text-sm"
            />
          </div>
          <button
            onClick={() => {
              if (input.trim()) {
                sendMessage({ text: input.trim() });
                inputRef.current?.focus();
              }
            }}
            disabled={!input.trim() || isPending}
            className="bg-zinc-800 text-zinc-400 px-6 text-sm font-bold hover:text-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
};

export default Page;
