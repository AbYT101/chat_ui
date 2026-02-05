import type { Message } from "../types/chat";

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-xl p-4 rounded-lg ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-gray-700 text-gray-100"
        }`}
      >
        {!isUser && message.model && (
          <div className="text-xs text-gray-400 mb-1">
            {message.model}
          </div>
        )}
        {message.content}
      </div>
    </div>
  );
}
