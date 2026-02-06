// src/pages/Chat.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ChatInput from "../components/ChatInput";
import MessageBubble from "../components/MessageBubble";
import ModelSelector from "../components/chat/ModelSelector";
import KnowledgeSelector from "../components/chat/KnowledgeSelector";
import { getMessages, streamMessage } from "../api/chat.api";
import type { Message } from "../types/chat";
import { useChat } from "../chat/ChatContext";
import { Input } from "antd";

const normalizeRole = (role: string): "user" | "assistant" =>
  role === "assistant" || role === "ai" ? "assistant" : "user";

const mapServerMessage = (serverMessage: {
  id: number;
  role: string;
  content: string;
}): Message => ({
  id: String(serverMessage.id),
  role: normalizeRole(serverMessage.role),
  content: serverMessage.content,
});

export default function Chat() {
  const { activeConversationId } = useChat();
  const [messages, setMessages] = useState<Message[]>([]);
  const [model, setModel] = useState("gpt-5-mini");
  const [knowledgeTypes, setKnowledgeTypes] = useState<string[] | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const emptyState = useMemo(
    () => !messages.length && !isStreaming && !isLoadingMessages,
    [messages.length, isStreaming, isLoadingMessages]
  );

  const filteredMessages = useMemo(() => {
    if (!search.trim()) return messages;
    const needle = search.trim().toLowerCase();
    return messages.filter((message) =>
      message.content.toLowerCase().includes(needle)
    );
  }, [messages, search]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  useEffect(() => {
    if (!activeConversationId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMessages([]);
      return;
    }
    setIsLoadingMessages(true);
    setError(null);
    getMessages(activeConversationId)
      .then((response) => {
        const serverMessages = response.data ?? [];
        setMessages(serverMessages.map(mapServerMessage));
      })
      .catch((err) => {
        const message =
          err instanceof Error ? err.message : "Unable to load messages.";
        setError(message);
      })
      .finally(() => setIsLoadingMessages(false));
  }, [activeConversationId]);

  const handleSend = async (text: string) => {
    setError(null);
    if (!activeConversationId) {
      setError("Create a conversation to start chatting.");
      return;
    }

    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content: text,
      model,
    };

    const assistantId = uuidv4();
    const assistantMessage: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      model,
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setIsStreaming(true);

    await streamMessage(activeConversationId, text, model, {
      onToken: (token) => {
        setMessages((prev) =>
          prev.map((message) =>
            message.id === assistantId
              ? { ...message, content: message.content + token }
              : message
          )
        );
      },
      onDone: () => {
        setIsStreaming(false);
      },
      onError: (err) => {
        setIsStreaming(false);
        setError(err.message);
      },
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ height: '100%', width: '100%' }}>
      <div className="border-b border-slate-800 p-4 flex flex-wrap gap-3 items-center" style={{ flexShrink: 0 }}>
        <ModelSelector onChange={setModel} value={model} />
        <KnowledgeSelector onChange={setKnowledgeTypes} />
        <Input
          placeholder="Search this chat"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="max-w-xs"
        />
        {knowledgeTypes?.length ? (
          <span className="text-xs text-slate-400">
            Routing to: {knowledgeTypes.join(", ")}
          </span>
        ) : null}
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-slate-900" style={{ flexGrow: 1 }}>
        {error ? (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        {emptyState ? (
          <div className="text-center text-slate-400 mt-16">
            {activeConversationId
              ? "No messages yet. Start the conversation below."
              : "Select or create a conversation to start chatting."}
          </div>
        ) : filteredMessages.length ? (
          filteredMessages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        ) : (
          <div className="text-center text-slate-400 mt-16">
            No messages match your search.
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div style={{ flexShrink: 0 }}>
        <ChatInput onSend={handleSend} disabled={isStreaming || !activeConversationId} />
      </div>
    </div>
  );
}
