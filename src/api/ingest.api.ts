import api from "./axios";

export const ingestText = (content: string, title?: string) =>
  api.post("/ingest/text", { content, title });

export const ingestFile = (file: File) => {
  const form = new FormData();
  form.append("file", file);
  return api.post("/ingest/file", form);
};

export const uploadImage = (file: File) => {
  const form = new FormData();
  form.append("file", file);
  return api.post("/vision/upload", form);
};

