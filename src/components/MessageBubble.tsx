import { Avatar, Space, Spin, Tag, Typography, theme } from "antd";
import { RobotOutlined } from "@ant-design/icons";
import type { Message } from "../types/chat";
import { useThemeMode } from "../theme/ThemeProvider";

export default function MessageBubble({ message }: { message: Message }) {
  const { token } = theme.useToken();
  const { mode } = useThemeMode();
  const isUser = message.role === "user";
  const userBg =
    mode === "dark" ? "rgba(99, 102, 241, 0.22)" : token.colorPrimaryBg;
  const assistantBg = token.colorBgContainer;

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
      style={{ width: "100%" }}
    >
      <Space
        align="start"
        size={12}
        style={{
          maxWidth: "100%",
          width: "100%",
          justifyContent: isUser ? "flex-end" : "flex-start",
        }}
      >
        {!isUser ? (
          <Avatar
            icon={<RobotOutlined />}
            style={{
              background: "#1f2937",
              color: "#e2e8f0",
            }}
          />
        ) : null}
        <div
          style={{
            maxWidth: 640,
            background: isUser ? userBg : assistantBg,
            borderRadius: 12,
            padding: "12px 14px",
            color: token.colorText,
          }}
        >
          {!isUser && message.model ? (
            <Tag color="geekblue" style={{ marginBottom: 6 }}>
              {message.model}
            </Tag>
          ) : null}
          {message.isStreaming && !message.content ? (
            <Space size={8}>
              <Spin size="small" />
              <Typography.Text type="secondary">
                Generating response…
              </Typography.Text>
            </Space>
          ) : (
            <Typography.Paragraph
              style={{ marginBottom: 0, whiteSpace: "pre-wrap" }}
            >
              {message.content}
            </Typography.Paragraph>
          )}
        </div>
      </Space>
    </div>
  );
}
