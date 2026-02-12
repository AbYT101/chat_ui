import { Avatar, Space, Spin, Tag, Typography, theme } from "antd";
import { RobotOutlined, UserOutlined } from "@ant-design/icons";
import type { Message } from "../types/chat";
import { useThemeMode } from "../theme/ThemeProvider";

export default function MessageBubble({ message }: { message: Message }) {
  const { token } = theme.useToken();
  const { mode } = useThemeMode();
  const isUser = message.role === "user";

  return (
    <div
      style={{ 
        width: "100%",
        display: "flex",
        gap: 16,
      }}
    >
      {/* Avatar */}
      <Avatar
        size={36}
        icon={isUser ? <UserOutlined /> : <RobotOutlined />}
        style={{
          flexShrink: 0,
          background: isUser 
            ? "linear-gradient(135deg, #1890ff, #722ed1)"
            : mode === "dark"
              ? "#1f1f1f"
              : "#f5f5f5",
          color: isUser 
            ? "#ffffff"
            : mode === "dark" 
              ? "#ffffff" 
              : "#000000",
        }}
      />
      
      {/* Message Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Header */}
        <div style={{ marginBottom: 8 }}>
          <Space size={8} align="center">
            <Typography.Text strong style={{ fontSize: 14 }}>
              {isUser ? "You" : "Assistant"}
            </Typography.Text>
            {!isUser && message.model ? (
              <Tag 
                color="blue" 
                style={{ 
                  margin: 0,
                  fontSize: 11,
                  padding: "0 6px",
                  lineHeight: "20px",
                }}
              >
                {message.model}
              </Tag>
            ) : null}
          </Space>
        </div>

        {/* Message Body */}
        <div
          style={{
            background: mode === "dark" ? "#1a1a1a" : "#f5f5f5",
            borderRadius: 8,
            padding: "12px 16px",
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          {message.isStreaming && !message.content ? (
            <Space size={8}>
              <Spin size="small" />
              <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                Thinking...
              </Typography.Text>
            </Space>
          ) : (
            <Typography.Paragraph
              style={{ 
                marginBottom: 0, 
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {message.content}
              {message.isStreaming && (
                <span 
                  style={{ 
                    display: "inline-block",
                    width: 8,
                    height: 16,
                    marginLeft: 2,
                    background: token.colorPrimary,
                    animation: "blink 1s infinite",
                  }}
                />
              )}
            </Typography.Paragraph>
          )}
        </div>
      </div>
    </div>
  );
}
