export type Role = "user" | "assistant";

export interface Message {
  id: string;
  role: Role;
  content: string;
  model?: string;
  isStreaming?: boolean;
}

export interface Conversation {
  id: string;
  messages: Message[];
}
