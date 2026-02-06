/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button, Card, Input, Select, Typography } from "antd";
import { semanticSearch, similaritySearch } from "../api/vector.api";
import SearchResults from "../components/SearchResults";

const ingestionOptions = [
  { value: "file", label: "Files" },
  { value: "image", label: "Images" },
  { value: "text", label: "Text" },
];

export default function VectorSearch() {
  const [query, setQuery] = useState("");
  const [ingestionType, setIngestionType] = useState<string | undefined>();
  const [results, setResults] = useState<any[]>([]);
  const [mode, setMode] = useState<"similarity" | "semantic">("similarity");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    try {
      const res =
        mode === "similarity"
          ? await similaritySearch(query.trim(), ingestionType)
          : await semanticSearch(query.trim(), ingestionType);
      setResults(res.data ?? []);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 overflow-y-auto" style={{ height: '100%', width: '100%' }}>
      <Typography.Title level={3} className="!text-slate-100">
        Vector Search
      </Typography.Title>
      <Card className="bg-slate-950 border border-slate-800">
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Search vectors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex flex-wrap gap-3 items-center">
            <Select
              value={mode}
              onChange={(value) => setMode(value)}
              options={[
                { value: "similarity", label: "Similarity Search" },
                { value: "semantic", label: "Semantic Search (with score)" },
              ]}
              className="min-w-[220px]"
            />
            <Select
              allowClear
              placeholder="All ingestion types"
              value={ingestionType}
              onChange={(value) => setIngestionType(value)}
              options={ingestionOptions}
              className="min-w-[200px]"
            />
            <Button type="primary" onClick={handleSearch} loading={isLoading}>
              Search
            </Button>
          </div>
          <SearchResults results={results} />
        </div>
      </Card>
    </div>
  );
}

