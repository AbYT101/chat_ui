/* eslint-disable @typescript-eslint/no-explicit-any */
// src/api/chat.api.ts
import { api, apiBaseUrl } from "./client";
import { getToken } from "../utils/token";

export const sendMessage = (
  conversationId: number,
  message: string,
  model: string,
) => api.post(`/chat/conversations/${conversationId}/chat`, { message, model });

export const listConversations = () => api.get("/chat/conversations");

export const createConversation = () => api.post("/chat/conversations");

// new: delete a conversation
export const deleteConversation = (id: number) =>
  api.delete(`/chat/conversations/${id}`);

export const deleteConversationApi = (id: number) =>
  api.delete(`/chat/conversations/${id}`);

export const getMessages = (conversationId: number, limit = 50, offset = 0) =>
  api.get(`/chat/conversations/${conversationId}/messages`, {
    params: { limit, offset },
  });

type StreamHandlers = {
  onToken: (token: string) => void;
  onDone: (final: any) => void;
  onError?: (error: Error) => void;
};

const parseSseChunk = (chunk: string, handlers: StreamHandlers) => {
  const events = chunk.split("\n\n").filter(Boolean);
  for (const eventBlock of events) {
    let eventName = "message";
    let dataPayload = "";
    const lines = eventBlock.split("\n");
    for (const line of lines) {
      if (line.startsWith("event:")) {
        eventName = line.replace("event:", "").trim();
      } else if (line.startsWith("data:")) {
        dataPayload += line.replace("data:", "").trim();
      }
    }

    if (!dataPayload) continue;
    try {
      const data = JSON.parse(dataPayload);
      if (eventName === "token") {
        handlers.onToken(data.content ?? "");
      } else if (eventName === "done") {
        handlers.onDone(data);
      }
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Unable to parse stream.");
      handlers.onError?.(error);
    }
  }
};

export const streamMessage = async (
  conversationId: number,
  message: string,
  model: string,
  handlers: StreamHandlers
) => {
  const token = getToken();
  const controller = new AbortController();
  try {
    const response = await fetch(
      `${apiBaseUrl}/chat/conversations/${conversationId}/chat/stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message, model }),
        signal: controller.signal,
      },
    );

    if (!response.ok || !response.body) {
      throw new Error("Unable to start stream.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const boundaryIndex = buffer.lastIndexOf("\n\n");
      if (boundaryIndex === -1) continue;

      const chunk = buffer.slice(0, boundaryIndex);
      buffer = buffer.slice(boundaryIndex + 2);
      parseSseChunk(chunk, handlers);
    }

    if (buffer.trim()) {
      parseSseChunk(buffer, handlers);
    }
  } catch (err) {
    const error =
      err instanceof Error ? err : new Error("Stream failed to start.");
    handlers.onError?.(error);
  }

  return controller;
};
