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
      className="h-full flex flex-col px-5 pt-7 pb-6 gap-6"
      style={{
        background:
          mode === "dark"
            ? "linear-gradient(180deg, rgba(15, 23, 42, 0.98), rgba(15, 23, 42, 0.9))"
            : "linear-gradient(180deg, rgba(248, 250, 252, 1), rgba(241, 245, 249, 1))",
      }}
    >
      <div className="flex items-start justify-between">
        <Space align="center" size={12}>
          <Avatar
            shape="square"
            size={38}
            style={{
              background: "linear-gradient(135deg, #6366f1, #0ea5e9)",
              fontWeight: 600,
            }}
          >
            AI
          </Avatar>
          <div>
            <Typography.Title level={4} style={{ margin: 0 }}>
              AI Workspace
            </Typography.Title>
            <Typography.Text type="secondary">
              Intelligent chat suite
            </Typography.Text>
          </div>
        </Space>
        <Switch
          checked={mode === "dark"}
          onChange={toggle}
          checkedChildren={<MoonOutlined />}
          unCheckedChildren={<SunOutlined />}
        />
      </div>
      <Space size={8} wrap>
        <div className="p-2">

        </div>
      </Space>

      <Button
        type="text"
        icon={<PlusOutlined />}
        block
        size="large"
        onClick={async () => {
          const id = await startNewConversation();
          if (id) {
            navigate("/");
          }
        }}
      >
        New chat
      </Button>

      <Input.Search
        placeholder="Search conversations"
        value={search}
        allowClear
        onChange={(event) => setSearch(event.target.value)}
      />

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

      <Space direction="vertical" size={10} style={{ width: "100%" }}>
        <div className="flex items-center justify-between">
          <Typography.Text type="secondary">Conversations</Typography.Text>
          <Badge count={conversations.length} showZero />
        </div>
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Spin />
            </div>
          ) : (
            <List
              size="small"
              dataSource={filteredConversations}
              locale={{
                emptyText: (
                  <Typography.Text type="secondary">
                    No conversations yet
                  </Typography.Text>
                ),
              }}
              renderItem={(item) => {
                const isActive = item.id === activeConversationId;
                return (
                  <List.Item
                    style={{
                      padding: "6px 8px",
                      borderRadius: 8,
                      background: isActive ? "rgba(99, 102, 241, 0.18)" : "",
                    }}
                  >
                    <Button
                      type="text"
                      block
                      style={{
                        textAlign: "left",
                        color: isActive
                          ? "rgba(226, 232, 240, 1)"
                          : "rgba(148, 163, 184, 1)",
                        padding: 0,
                        height: "auto",
                      }}
                      onClick={() => {
                        setActiveConversationId(item.id);
                        navigate("/");
                      }}
                    >
                      Conversation #{item.id}
                    </Button>
                  </List.Item>
                );
              }}
            />
          )}
        </div>
      </Space>

      <div
        className="flex items-center justify-between rounded-lg px-3 py-2"
        style={{
          background:
            mode === "dark"
              ? "rgba(30, 41, 59, 0.4)"
              : "rgba(226, 232, 240, 0.7)",
        }}
      >
        <Space size={10}>
          <Avatar icon={<UserOutlined />} />
          <div>
            <Typography.Text>Signed in</Typography.Text>
            <Typography.Text type="secondary" style={{ display: "block" }}>
              Workspace admin
            </Typography.Text>
          </div>
        </Space>
        <Space>
          <Badge status="success" />
          <Button
            size="small"
            danger
            icon={<LogoutOutlined />}
            onClick={() => {
              logout();
              localStorage.removeItem("activeConversationId");
              navigate("/login");
            }}
          >
            Logout
          </Button>
        </Space>
      </div>
    </div>
  );
}
