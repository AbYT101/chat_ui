import { useState } from "react";
import { Button, Input, Space, Typography, theme } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useThemeMode } from "../theme/ThemeProvider";

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const { token } = theme.useToken();
  const { mode } = useThemeMode();
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <div
      style={{
        borderTop: mode === "dark" ? "1px solid #303030" : "1px solid #f0f0f0",
        background: mode === "dark" ? "#141414" : "#fafafa",
        padding: "16px 24px 24px",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          <div style={{ position: "relative" }}>
            <Input.TextArea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={disabled ? "Select a conversation to start chatting..." : "Type your message..."}
              autoSize={{ minRows: 3, maxRows: 10 }}
              disabled={disabled}
              size="large"
              onPressEnter={(e) => {
                if (e.shiftKey) return;
                e.preventDefault();
                handleSend();
              }}
              style={{
                fontSize: 14,
                paddingRight: 60,
                resize: "none",
              }}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              disabled={disabled || !text.trim()}
              size="large"
              style={{
                position: "absolute",
                right: 8,
                bottom: 8,
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              Press <Typography.Text keyboard style={{ fontSize: 12 }}>Enter</Typography.Text> to send, <Typography.Text keyboard style={{ fontSize: 12 }}>Shift + Enter</Typography.Text> for new line
            </Typography.Text>
            {text.length > 0 && (
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                {text.length} characters
              </Typography.Text>
            )}
          </div>
        </Space>
      </div>
    </div>
  );
}
