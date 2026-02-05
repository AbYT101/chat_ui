import { apiBaseUrl } from "./client";
import { getToken } from "../utils/token";

export const sendMessage = async (
  message: string,
  conversationId: string | null,
  model: string,
  onChunk: (chunk: string) => void
) => {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${apiBaseUrl}/chat`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      message,
      conversation_id: conversationId,
      model,
    }),
  });

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) return;

  let done = false;
  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    const chunk = decoder.decode(value || new Uint8Array());
    onChunk(chunk);
  }
};
