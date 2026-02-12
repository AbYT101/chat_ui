import React from "react";
import { useChat } from "./ChatContext";

export const ConversationList: React.FC = () => {
  const { conversations, activeConversationId, setActiveConversationId, deleteConversation, isLoading } = useChat();

  const onDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!window.confirm("Delete this conversation? This cannot be undone.")) return;
    try {
      await deleteConversation(id);
    } catch (err) {
      console.error("Failed to delete conversation", err);
      alert("Unable to delete conversation.");
    }
  };

  return (
    <div>
      {conversations.map((c) => (
        <div
          key={c.id}
          onClick={() => setActiveConversationId(c.id)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px",
            cursor: "pointer",
            background: c.id === activeConversationId ? "#eee" : "transparent",
          }}
        >
          <div>
            <div style={{ fontSize: 12, color: "#666" }}>
              #{c.id}
            </div>
            <div style={{ fontSize: 12 }}>
              {new Date(c.created_at).toLocaleString()}
            </div>
          </div>

          <button
            onClick={(e) => onDelete(e, c.id)}
            disabled={isLoading}
            title="Delete conversation"
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: 6,
              marginLeft: 8,
            }}
            aria-label={`Delete conversation ${c.id}`}
          >
            {/* simple trash SVG */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
              <path d="M10 11v6"></path>
              <path d="M14 11v6"></path>
              <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};