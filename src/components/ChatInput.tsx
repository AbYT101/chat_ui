import { useState } from "react";
import ModelSelector from "./ModelSelector";

export default function ChatInput({
  onSend,
  model,
  setModel,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="flex items-center gap-2 p-4 border-t border-gray-700">
      <ModelSelector model={model} setModel={setModel} />
      <input
        className="flex-1 bg-gray-800 p-3 rounded text-white"
        placeholder="Message the model..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button
        onClick={handleSend}
        className="bg-blue-600 px-4 py-2 rounded"
      >
        Send
      </button>
    </div>
  );
}
