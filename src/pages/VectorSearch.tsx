/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button, Card, Input, Select, Typography, Space, Alert, Divider, Badge } from "antd";
import { SearchOutlined, AimOutlined, FilterOutlined } from "@ant-design/icons";
import { semanticSearch, similaritySearch } from "../api/vector.api";
import SearchResults from "../components/SearchResults";
import { useThemeMode } from "../theme/ThemeProvider";

const ingestionOptions = [
  { value: "file", label: "Documents" },
  { value: "image", label: "Images" },
  { value: "text", label: "Text Content" },
];

export default function VectorSearch() {
  const { mode } = useThemeMode();
  const [query, setQuery] = useState("");
  const [ingestionType, setIngestionType] = useState<string | undefined>();
  const [results, setResults] = useState<any[]>([]);
  const [searchMode, setSearchMode] = useState<"similarity" | "semantic">("similarity");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setResults([]);
    try {
      const res =
        searchMode === "similarity"
          ? await similaritySearch(query.trim(), ingestionType)
          : await semanticSearch(query.trim(), ingestionType);
      setResults(res.data ?? []);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        background: mode === "dark" ? "#212121" : "#ffffff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: mode === "dark" ? "1px solid #303030" : "1px solid #f0f0f0",
          background: mode === "dark" ? "#141414" : "#fafafa",
          padding: "16px 24px",
        }}
      >
        <Space align="center" size={12}>
          <SearchOutlined style={{ fontSize: 24, color: "#722ed1" }} />
          <div>
            <Typography.Title level={4} style={{ margin: 0, fontWeight: 600 }}>
              Vector Search
            </Typography.Title>
            <Typography.Text type="secondary" style={{ fontSize: 13 }}>
              Search your knowledge base using vector similarity
            </Typography.Text>
          </div>
        </Space>
      </div>

      {/* Content Area */}
      <div
        className="overflow-y-auto"
        style={{
          flex: 1,
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Space direction="vertical" size={24} style={{ width: "100%" }}>
            {/* Instructions */}
            <Alert
              message="About Vector Search"
              description="Vector search finds semantically similar content in your knowledge base. Choose between similarity search (exact matching) or semantic search (contextual understanding with relevance scores)."
              type="info"
              showIcon
              icon={<AimOutlined />}
            />

            {/* Search Configuration Card */}
            <Card
              title={
                <Space>
                  <SearchOutlined />
                  <span>Search Configuration</span>
                </Space>
              }
              style={{
                background: mode === "dark" ? "#1a1a1a" : "#fafafa",
                border: mode === "dark" ? "1px solid #303030" : "1px solid #f0f0f0",
              }}
            >
              <Space direction="vertical" size={20} style={{ width: "100%" }}>
                {/* Query Input */}
                <div>
                  <Typography.Text strong style={{ display: "block", marginBottom: 8 }}>
                    Search Query <Typography.Text type="danger">*</Typography.Text>
                  </Typography.Text>
                  <Input
                    placeholder="Enter your search query..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    size="large"
                    onPressEnter={handleSearch}
                    prefix={<SearchOutlined />}
                  />
                </div>

                <Divider style={{ margin: 0 }} />

                {/* Search Options */}
                <div className="flex flex-wrap gap-6 items-start">
                  <div style={{ flex: "1 1 250px" }}>
                    <Typography.Text strong style={{ display: "block", marginBottom: 8 }}>
                      Search Mode
                    </Typography.Text>
                    <Select
                      value={searchMode}
                      onChange={(value) => setSearchMode(value)}
                      options={[
                        { value: "similarity", label: "Similarity Search" },
                        { value: "semantic", label: "Semantic Search (with scores)" },
                      ]}
                      size="large"
                      style={{ width: "100%" }}
                    />
                  </div>

                  <div style={{ flex: "1 1 250px" }}>
                    <Space style={{ width: "100%", justifyContent: "space-between" }}>
                      <Typography.Text strong style={{ display: "block", marginBottom: 8 }}>
                        Content Type Filter
                      </Typography.Text>
                      {ingestionType && (
                        <Badge status="processing" text="Filtered" />
                      )}
                    </Space>
                    <Select
                      allowClear
                      placeholder="All types"
                      value={ingestionType}
                      onChange={(value) => setIngestionType(value)}
                      options={ingestionOptions}
                      size="large"
                      style={{ width: "100%" }}
                      prefix={<FilterOutlined />}
                    />
                  </div>
                </div>

                <Divider style={{ margin: 0 }} />

                {/* Action Button */}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    type="primary"
                    size="large"
                    icon={<SearchOutlined />}
                    onClick={handleSearch}
                    loading={isLoading}
                    disabled={!query.trim()}
                  >
                    {isLoading ? "Searching..." : "Search"}
                  </Button>
                </div>
              </Space>
            </Card>

            {/* Results Card */}
            <Card
              title={
                <Space>
                  <AimOutlined />
                  <span>Search Results</span>
                  {results.length > 0 && (
                    <Badge count={results.length} showZero style={{ marginLeft: 8 }} />
                  )}
                </Space>
              }
              style={{
                background: mode === "dark" ? "#1a1a1a" : "#fafafa",
                border: mode === "dark" ? "1px solid #303030" : "1px solid #f0f0f0",
              }}
            >
              <SearchResults results={results} isLoading={isLoading} />
            </Card>
          </Space>
        </div>
      </div>
    </div>
  );
}

