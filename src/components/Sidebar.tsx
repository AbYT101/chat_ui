import { useMemo, useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Input,
  List,
  Menu,
  Space,
  Switch,
  Spin,
  Tag,
  Typography,
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BranchesOutlined,
  DatabaseOutlined,
  MoonOutlined,
  SunOutlined,
  MessageOutlined,
  PlusOutlined,
  SearchOutlined,
  ThunderboltOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { LogoutOutlined } from "@ant-design/icons";
import { useAuth } from "../auth/AuthContext";
import { useChat } from "../chat/ChatContext";
import { useThemeMode } from "../theme/ThemeProvider";

const menuItems = [
  {
    key: "workspace",
    label: "Workspace",
    type: "group" as const,
    children: [
      { key: "/", label: "Chat", icon: <MessageOutlined /> },
      { key: "/knowledge", label: "Knowledge", icon: <DatabaseOutlined /> },
      { key: "/rag", label: "RAG Query", icon: <BranchesOutlined /> },
      { key: "/vector-search", label: "Vector Search", icon: <SearchOutlined /> },
    ],
  },
];

export default function Sidebar() {
  const { mode, toggle } = useThemeMode();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    startNewConversation,
    isLoading,
  } = useChat();
  const { logout } = useAuth();
  const [search, setSearch] = useState("");

  const filteredConversations = useMemo(() => {
    const needle = search.trim();
    if (!needle) return conversations;
    return conversations.filter((conversation) =>
      String(conversation.id).includes(needle)
    );
  }, [conversations, search]);

  return (
    <div
      className="h-full flex flex-col"
      style={{
        background:
          mode === "dark"
            ? "#141414"
            : "#fafafa",
        borderRight: mode === "dark" ? "1px solid #303030" : "1px solid #f0f0f0",
      }}
    >
      {/* Header Section */}
      <div style={{ padding: "16px 12px" }}>
        <Space.Compact block>
          <Button
            type="default"
            icon={<PlusOutlined />}
            size="large"
            onClick={async () => {
              const id = await startNewConversation();
              if (id) {
                navigate("/");
              }
            }}
            style={{
              flex: 1,
              fontWeight: 500,
              height: 48,
            }}
          >
            New chat
          </Button>
          <Button
            type="default"
            icon={mode === "dark" ? <MoonOutlined /> : <SunOutlined />}
            size="large"
            onClick={toggle}
            style={{
              height: 48,
            }}
          />
        </Space.Compact>
      </div>

      {/* Search Section */}
      <div style={{ padding: "0 12px 16px" }}>
        <Input.Search
          placeholder="Search conversations..."
          value={search}
          allowClear
          size="large"
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {/* Menu Section */}
      <div style={{ padding: "0 8px 8px" }}>
        <Menu
          theme={mode === "dark" ? "dark" : "light"}
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={(info) => navigate(info.key)}
          style={{
            background: "transparent",
            borderInlineEnd: "none",
          }}
        />
      </div>

      {/* Divider */}
      <div style={{ padding: "0 12px 12px" }}>
        <div
          style={{
            height: 1,
            background: mode === "dark" ? "#303030" : "#f0f0f0",
          }}
        />
      </div>

      {/* Conversations Section */}
      <div className="flex-1 overflow-y-auto" style={{ padding: "0 8px" }}>
        <div style={{ padding: "8px 12px 12px" }}>
          <Space style={{ width: "100%", justifyContent: "space-between" }}>
            <Typography.Text 
              type="secondary" 
              style={{ 
                fontSize: 12, 
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}
            >
              Recent Chats
            </Typography.Text>
            <Badge 
              count={conversations.length} 
              showZero
              overflowCount={99}
            />
          </Space>
        </div>
        {isLoading ? (
          <div className="flex justify-center" style={{ padding: "32px 0" }}>
            <Spin size="large" />
          </div>
        ) : (
          <List
            dataSource={filteredConversations}
            locale={{
              emptyText: (
                <div style={{ textAlign: "center", padding: "32px 16px" }}>
                  <MessageOutlined style={{ fontSize: 32, color: mode === "dark" ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)", marginBottom: 12 }} />
                  <Typography.Paragraph type="secondary" style={{ margin: 0 }}>
                    No conversations yet
                  </Typography.Paragraph>
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    Start a new chat to begin
                  </Typography.Text>
                </div>
              ),
            }}
            renderItem={(item) => {
              const isActive = item.id === activeConversationId;
              return (
                <List.Item
                  style={{
                    padding: "2px 4px",
                    border: "none",
                  }}
                >
                  <Button
                    type={isActive ? "primary" : "text"}
                    block
                    icon={<MessageOutlined />}
                    size="large"
                    style={{
                      textAlign: "left",
                      height: 44,
                      fontWeight: isActive ? 500 : 400,
                      justifyContent: "flex-start",
                    }}
                    onClick={() => {
                      setActiveConversationId(item.id);
                      navigate("/");
                    }}
                  >
                    <span style={{ 
                      overflow: "hidden", 
                      textOverflow: "ellipsis", 
                      whiteSpace: "nowrap" 
                    }}>
                      Conversation #{item.id}
                    </span>
                  </Button>
                </List.Item>
              );
            }}
          />
        )}
      </div>

      {/* Divider */}
      <div style={{ padding: "12px 12px 0" }}>
        <div
          style={{
            height: 1,
            background: mode === "dark" ? "#303030" : "#f0f0f0",
          }}
        />
      </div>

      {/* User Profile Section */}
      <div style={{ padding: "12px" }}>
        <Button
          type="text"
          block
          size="large"
          style={{
            height: "auto",
            padding: "12px",
            textAlign: "left",
          }}
        >
          <div className="flex items-center justify-between" style={{ width: "100%" }}>
            <Space size={12}>
              <Avatar 
                size={40}
                icon={<UserOutlined />}
                style={{
                  background: "linear-gradient(135deg, #1890ff, #722ed1)",
                }}
              />
              <div>
                <Typography.Text style={{ 
                  display: "block", 
                  fontSize: 14,
                  fontWeight: 500,
                  lineHeight: 1.4
                }}>
                  User Account
                </Typography.Text>
                <Typography.Text type="secondary" style={{ 
                  display: "block", 
                  fontSize: 12,
                  lineHeight: 1.4
                }}>
                  Workspace admin
                </Typography.Text>
              </div>
            </Space>
            <Button
              type="text"
              danger
              icon={<LogoutOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                logout();
                localStorage.removeItem("activeConversationId");
                navigate("/login");
              }}
            />
          </div>
        </Button>
      </div>
    </div>
  );
}
