// src/pages/Chat.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ChatInput from "../components/ChatInput";
import MessageBubble from "../components/MessageBubble";
import ModelSelector from "../components/chat/ModelSelector";
import { getMessages, streamMessage } from "../api/chat.api";
import type { Message } from "../types/chat";
import { useChat } from "../chat/ChatContext";
import { Alert, Badge, Empty, Input, Space, Spin, Typography, theme } from "antd";
import { useThemeMode } from "../theme/ThemeProvider";

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
  const { token } = theme.useToken();
  const { mode } = useThemeMode();
  const { activeConversationId } = useChat();
  const [messages, setMessages] = useState<Message[]>([]);
  const [model, setModel] = useState("gpt-5-mini");
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
      isStreaming: true,
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
        setMessages((prev) =>
          prev.map((message) =>
            message.id === assistantId
              ? { ...message, isStreaming: false }
              : message
          )
        );
      },
      onError: (err) => {
        setIsStreaming(false);
        setError(err.message);
        setMessages((prev) =>
          prev.map((message) =>
            message.id === assistantId
              ? { ...message, isStreaming: false }
              : message
          )
        );
      },
    });
  };

  return (
    <div
      className="flex-1 flex flex-col overflow-hidden"
      style={{ height: "100%", width: "100%" }}
    >
      <div
        style={{
          flexShrink: 0,
          background:
            mode === "dark"
              ? "linear-gradient(180deg, rgba(15, 23, 42, 0.92), rgba(15, 23, 42, 0.72))"
              : "linear-gradient(180deg, rgba(241, 245, 249, 0.95), rgba(248, 250, 252, 0.9))",
        }}
      >
        <div className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Typography.Title level={4} style={{ margin: 0 }}>
                Conversation
              </Typography.Title>
              <Typography.Text type="secondary">
                Ask questions and get responses in real time.
              </Typography.Text>
            </div>
            <Space size={12} wrap>
              <Badge
                status={isStreaming ? "processing" : "default"}
                text={isStreaming ? "Streaming" : "Ready"}
              />
              <ModelSelector onChange={setModel} value={model} />
              <Input.Search
                placeholder="Search this chat"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                allowClear
                style={{ width: 220 }}
              />
            </Space>
          </div>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto p-6"
        style={{
          flexGrow: 1,
          background:
            mode === "dark"
              ? "linear-gradient(180deg, rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.95))"
              : token.colorBgLayout,
        }}
      >
        {error ? (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        ) : null}

        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          {isLoadingMessages ? (
            <div className="flex justify-center py-12">
              <Spin />
            </div>
          ) : emptyState ? (
            <Empty
              description={
                activeConversationId
                  ? "No messages yet. Start the conversation below."
                  : "Select or create a conversation to start chatting."
              }
            />
          ) : filteredMessages.length ? (
            filteredMessages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))
          ) : (
            <Empty description="No messages match your search." />
          )}
          <div ref={endRef} />
        </div>
      </div>

      <div style={{ flexShrink: 0 }}>
        <ChatInput
          onSend={handleSend}
          disabled={isStreaming || !activeConversationId}
        />
      </div>
    </div>
  );
}
