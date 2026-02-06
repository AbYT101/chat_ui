import { useState } from "react";
import { Button, Input } from "antd";

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <div className="flex items-end gap-3 p-4 border-t border-slate-800">
      <Input.TextArea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Message the model..."
        autoSize={{ minRows: 1, maxRows: 5 }}
        disabled={disabled}
        onPressEnter={(e) => {
          if (e.shiftKey) return;
          e.preventDefault();
          handleSend();
        }}
        className="bg-slate-900 text-slate-100"
      />
      <Button type="primary" onClick={handleSend} disabled={disabled}>
        Send
      </Button>
    </div>
  );
}
