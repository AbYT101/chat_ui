import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createConversation, listConversations } from "../api/chat.api";
import { useAuth } from "../auth/AuthContext";

type ConversationSummary = {
  id: number;
  created_at: string;
};

type ChatContextType = {
  conversations: ConversationSummary[];
  activeConversationId: number | null;
  setActiveConversationId: (id: number | null) => void;
  refreshConversations: () => Promise<void>;
  startNewConversation: () => Promise<number | null>;
  logout: () => void;
  isLoading: boolean;
};

const ChatContext = createContext<ChatContextType>(null!);

const getStoredConversationId = () => {
  const raw = localStorage.getItem("activeConversationId");
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
};

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeConversationId, setActiveConversationIdState] =
    useState<number | null>(getStoredConversationId);
  const [isLoading, setIsLoading] = useState(false);
  const { logout: authLogout } = useAuth();

  const refreshConversations = async () => {
    setIsLoading(true);
    try {
      const response = await listConversations();
      setConversations(response.data ?? []);
      if (
        response.data?.length &&
        !response.data.some((item: ConversationSummary) => item.id === activeConversationId)
      ) {
        setActiveConversationIdState(response.data[0].id);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const startNewConversation = async () => {
    setIsLoading(true);
    try {
      const response = await createConversation();
      const created = response.data as ConversationSummary | undefined;
      if (created?.id) {
        setConversations((prev) => [created, ...prev]);
        setActiveConversationIdState(created.id);
        return created.id;
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    try {
      authLogout();
    } finally {
      setConversations([]);
      setActiveConversationIdState(null);
      localStorage.removeItem("activeConversationId");
    }
  };

  useEffect(() => {
    refreshConversations();
  }, []);

  useEffect(() => {
    if (activeConversationId) {
      localStorage.setItem(
        "activeConversationId",
        String(activeConversationId)
      );
    } else {
      localStorage.removeItem("activeConversationId");
    }
  }, [activeConversationId]);

  const value = useMemo(
    () => ({
      conversations,
      activeConversationId,
      setActiveConversationId: setActiveConversationIdState,
      refreshConversations,
      startNewConversation,
      logout,
      isLoading,
    }),
    [conversations, activeConversationId, isLoading]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useChat = () => useContext(ChatContext);
