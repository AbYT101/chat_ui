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
      className="p-4"
      style={{
        background:
          mode === "dark"
            ? "linear-gradient(180deg, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 1))"
            : `linear-gradient(180deg, ${token.colorBgLayout}, ${token.colorBgContainer})`,
      }}
    >
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <Space direction="vertical" size={8} style={{ width: "100%" }}>
          <Input.TextArea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Message the model..."
            autoSize={{ minRows: 2, maxRows: 8 }}
            disabled={disabled}
            onPressEnter={(e) => {
              if (e.shiftKey) return;
              e.preventDefault();
              handleSend();
            }}
          />
          <div className="flex items-center justify-between">
            <Typography.Text type="secondary">
              Press Enter to send, Shift + Enter for new line
            </Typography.Text>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              disabled={disabled}
            >
              Send
            </Button>
          </div>
        </Space>
      </div>
    </div>
  );
}
