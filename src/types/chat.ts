export type Role = "user" | "assistant";

export interface Message {
  id: string;
  role: Role;
  content: string;
  model?: string;
}

export interface Conversation {
  id: string;
  messages: Message[];
}
