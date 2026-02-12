import api from "./axios";

export const ragQuery = (
  question: string,
  model: string,
  ingestionTypes: string[] | null
) =>
  api.post("/rag/query", {
    question,
    model,
    ingestion_types: ingestionTypes,
  });

