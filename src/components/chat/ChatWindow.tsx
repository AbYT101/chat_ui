/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/chat/ChatWindow.tsx
import { useState, useRef } from "react";
import ModelSelector from "./ModelSelector";
import KnowledgeSelector from "./KnowledgeSelector";
import { streamMessage } from "../../api/chat.api";

export default function ChatWindow({ conversationId }: { conversationId: number }) {
  const [model, setModel] = useState("gpt-5-mini");
  const [knowledge, setKnowledge] = useState<string[] | null>(null);
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const send = () => {
    if (!input.trim()) return;

    const userMsg = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMsg]);

    // Start streaming AI response
    let aiMsg = { role: "ai" as const, content: "" };
    setMessages((prev) => [...prev, aiMsg]);

    const aiIndex = messages.length;

    streamMessage(
      conversationId,
      input,
      model,
      {
        onToken: (token: string) => {
          aiMsg.content += token;
          setMessages((prev) => {
            const copy = [...prev];
            copy[aiIndex] = aiMsg;
            return copy;
          });
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        },
        onDone: (final: any) => {
          console.log("AI Done", final);
        },
        onError: (err: Error) => {
          console.error("AI Error", err);
        }
      }
    );

    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex gap-2">
        <ModelSelector onChange={setModel} />
        <KnowledgeSelector onChange={setKnowledge} />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded ${
              m.role === "user" ? "bg-blue-700 self-end" : "bg-gray-800 self-start"
            }`}
          >
            {m.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 flex gap-2 border-t border-gray-700">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button onClick={send} className="bg-blue-600 px-4 rounded">
          Send
        </button>
      </div>
    </div>
  );
}
