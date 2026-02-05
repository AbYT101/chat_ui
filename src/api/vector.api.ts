import api from "./axios";

export const similaritySearch = (query: string, ingestionType?: string) =>
  api.post("/vector/similarity-search", {
    query,
    ingestion_type: ingestionType,
  });

export const semanticSearch = (query: string, ingestionType?: string) =>
  api.post("/vector/semantic-search-with-score", {
    query,
    ingestion_type: ingestionType,
  });
