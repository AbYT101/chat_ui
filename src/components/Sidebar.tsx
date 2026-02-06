import { useState } from "react";
import { Button, Input, List, Menu, Spin, Typography } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useChat } from "../chat/ChatContext";

const menuItems = [
  { key: "/", label: "Chat" },
  { key: "/knowledge", label: "Knowledge" },
  { key: "/rag", label: "RAG Query" },
  { key: "/vector-search", label: "Vector Search" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    startNewConversation,
    isLoading,
  } = useChat();
  const [search, setSearch] = useState("");

  const filteredConversations = conversations.filter((conversation) =>
    String(conversation.id).includes(search.trim())
  );

  return (
    <div className="h-full flex flex-col p-4 gap-4">
      <div className="flex items-center justify-between">
        <Typography.Title level={4} className="!m-0 !text-slate-100">
          AI Workspace
        </Typography.Title>
      </div>

      <Button
        type="primary"
        className="w-full"
        onClick={async () => {
          const id = await startNewConversation();
          if (id) {
            navigate("/");
          }
        }}
      >
        + New Chat
      </Button>

      <Input
        placeholder="Search conversations"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={(info) => navigate(info.key)}
        className="bg-transparent"
      />

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Spin />
          </div>
        ) : (
          <List
            size="small"
            dataSource={filteredConversations}
            locale={{ emptyText: "No conversations yet" }}
            renderItem={(item) => (
              <List.Item
                className={`rounded px-2 py-1 ${
                  item.id === activeConversationId
                    ? "bg-slate-800 text-slate-100"
                    : "hover:bg-slate-900 text-slate-300"
                }`}
              >
                <button
                  type="button"
                  className="w-full text-left"
                  onClick={() => {
                    setActiveConversationId(item.id);
                    navigate("/");
                  }}
                >
                  Conversation #{item.id}
                </button>
              </List.Item>
            )}
          />
        )}
      </div>

      <div className="text-xs text-slate-500">Signed in</div>
    </div>
  );
}
