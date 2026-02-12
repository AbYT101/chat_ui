import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createConversation, listConversations, deleteConversation as apiDeleteConversation, deleteConversationApi } from "../api/chat.api";
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
  deleteConversation: (id: number) => Promise<void>;
  logout: () => void;
  /** Clears cached chat data and reloads conversations (call after login). */
  clearCacheAndRefresh: () => Promise<void>;
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

  const deleteConversation = async (id: number) => {
    try {
      await deleteConversationApi(id);
      // remove from local state
      setConversations((prev) => prev.filter((c) => c.id !== id));
      // if we deleted the active conversation, clear it
      if (activeConversationId === id) {
        setActiveConversationIdState(null);
        localStorage.removeItem("activeConversationId");
      }
    } catch (err) {
      throw err;
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

  const clearCacheAndRefresh = async () => {
    setConversations([]);
    setActiveConversationIdState(null);
    localStorage.removeItem("activeConversationId");
    await refreshConversations();
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
      deleteConversation,
      logout,
      clearCacheAndRefresh,
      isLoading,
    }),
    [conversations, activeConversationId, isLoading]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useChat = () => useContext(ChatContext);
