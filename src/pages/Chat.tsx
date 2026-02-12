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
      style={{ 
        height: "100%", 
        width: "100%",
        background: mode === "dark" ? "#212121" : "#ffffff",
      }}
    >
      {/* Header */}
      <div
        style={{
          flexShrink: 0,
          borderBottom: mode === "dark" ? "1px solid #303030" : "1px solid #f0f0f0",
          background: mode === "dark" ? "#141414" : "#fafafa",
        }}
      >
        <div style={{ padding: "16px 24px" }}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Typography.Title level={4} style={{ margin: 0, fontWeight: 600 }}>
                {activeConversationId ? `Conversation #${activeConversationId}` : "Chat"}
              </Typography.Title>
              <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                Ask questions and get responses in real time
              </Typography.Text>
            </div>
            <Space size={12} wrap>
              <Badge
                status={isStreaming ? "processing" : "success"}
                text={isStreaming ? "Generating..." : "Ready"}
              />
              <ModelSelector onChange={setModel} value={model} />
              <Input.Search
                placeholder="Search messages..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                allowClear
                style={{ width: 240 }}
              />
            </Space>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div
        className="flex-1 overflow-y-auto"
        style={{
          flexGrow: 1,
          background: mode === "dark" ? "#212121" : "#ffffff",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 24px 80px" }}>
          {error ? (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              style={{ marginBottom: 24 }}
              onClose={() => setError(null)}
            />
          ) : null}

          {isLoadingMessages ? (
            <div className="flex justify-center" style={{ paddingTop: 80 }}>
              <Space direction="vertical" align="center" size={16}>
                <Spin size="large" />
                <Typography.Text type="secondary">Loading messages...</Typography.Text>
              </Space>
            </div>
          ) : emptyState ? (
            <div style={{ paddingTop: 80 }}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <Space direction="vertical" size={8}>
                    <Typography.Text type="secondary">
                      {activeConversationId
                        ? "No messages yet"
                        : "Select or create a conversation"}
                    </Typography.Text>
                    <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                      {activeConversationId
                        ? "Start the conversation by typing a message below"
                        : "Choose a conversation from the sidebar or create a new one"}
                    </Typography.Text>
                  </Space>
                }
              />
            </div>
          ) : filteredMessages.length ? (
            <Space direction="vertical" size={24} style={{ width: "100%" }}>
              {filteredMessages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </Space>
          ) : (
            <div style={{ paddingTop: 80 }}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No messages match your search"
              />
            </div>
          )}
          <div ref={endRef} />
        </div>
      </div>

      {/* Input Area */}
      <div style={{ flexShrink: 0 }}>
        <ChatInput
          onSend={handleSend}
          disabled={isStreaming || !activeConversationId}
        />
      </div>
    </div>
  );
}
