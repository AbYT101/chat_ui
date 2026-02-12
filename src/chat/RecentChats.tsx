import React from "react";
import { ConversationList } from "./ConversationList";

export const RecentChats: React.FC = () => {
  return (
    <section style={{ paddingTop: 8 }}>
      <h4 style={{ margin: "8px 0", color: "#9aa0a6", fontSize: 12, letterSpacing: 0.6 }}>
        RECENT CHATS
      </h4>
      <ConversationList />
    </section>
  );
};