"use client";

import { useEffect, useState, useRef } from "react";
import socket from "@/lib/socket";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  content: string;
  user_id: string;
  user_name: string;
  sent_at: string;
}

export default function ChatBox({ groupchatId }: { groupchatId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onConnect = () => console.log("Socket connected");
    const onError = (err: any) => console.error("Socket error:", err);

    socket.on("connect", onConnect);
    socket.on("connect_error", onError);
    socket.on("error", onError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("connect_error", onError);
      socket.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (!groupchatId) return;

    console.log(`Joining room: ${groupchatId}`);
    socket.emit("joinRoom", { groupchatId });

    socket.emit("getHistory", { groupchatId });

    socket.on("chatHistory", (msgs: Message[]) => {
      console.log("Received chatHistory:", msgs);
      setMessages(msgs);
    });

    socket.on("receiveMessage", (msg: Message) => {
      console.log("Received new message:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chatHistory");
      socket.off("receiveMessage");
    };
  }, [groupchatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const trimmed = input.trim();

    console.log("Emitting sendMessage", { groupchatId, content: trimmed });

    if (socket.connected) {
      socket.emit("sendMessage", {
        groupchatId,
        content: trimmed,
      });
    } else {
      socket.once("connect", () => {
        socket.emit("sendMessage", {
          groupchatId,
          content: trimmed,
        });
      });
    }

    setInput("");
  };

  return (
    <div className="bg-background border border-border rounded-lg p-4 h-full flex flex-col">
      <div className="flex-1 overflow-y-auto border border-border rounded-lg p-4 mb-4 bg-muted/20">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="mb-3 p-3 bg-background rounded-lg border border-border"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="p-bold-14 text-foreground">{msg.user_name}</span>
              <span className="p-medium-12 text-muted-foreground">
                {new Date(msg.sent_at).toLocaleTimeString()}
              </span>
            </div>
            <p className="p-regular-14 text-foreground">{msg.content}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <Input
          className="flex-1 border border-border bg-background text-foreground p-3 rounded-lg p-medium-14 placeholder:text-muted-foreground outline-none focus:border-primary"
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button
          variant="default"
          onClick={sendMessage}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors p-medium-14"
          disabled={!input.trim()}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
