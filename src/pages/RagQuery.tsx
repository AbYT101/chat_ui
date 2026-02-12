import { useState } from "react";
import { Button, Card, Checkbox, Input, Select, Typography, Space, Alert, Divider, Empty } from "antd";
import { BranchesOutlined, SearchOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { ragQuery } from "../api/rag.api";
import { useThemeMode } from "../theme/ThemeProvider";

const modelOptions = [
  { value: "gpt-5-mini", label: "GPT-5 Mini" },
  { value: "gpt-4o-mini", label: "GPT-4o Mini" },
  { value: "llama3.2:3b", label: "Llama 3.2 3B" },
];

export default function RagQuery() {
  const { mode } = useThemeMode();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [model, setModel] = useState("gpt-4o-mini");
  const [ingestionTypes, setIngestionTypes] = useState<string[]>([
    "file",
    "text",
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const runRag = async () => {
    if (!question.trim()) return;
    setIsLoading(true);
    setAnswer("");
    try {
      const res = await ragQuery(
        question.trim(),
        model,
        ingestionTypes.length ? ingestionTypes : null
      );
      setAnswer(JSON.stringify(res.data, null, 2));
    } catch (error) {
      setAnswer(`Error: ${error instanceof Error ? error.message : "Failed to process query"}`);
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
          <BranchesOutlined style={{ fontSize: 24, color: "#52c41a" }} />
          <div>
            <Typography.Title level={4} style={{ margin: 0, fontWeight: 600 }}>
              RAG Query
            </Typography.Title>
            <Typography.Text type="secondary" style={{ fontSize: 13 }}>
              Query your knowledge base with retrieval-augmented generation
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
              message="How to use RAG Query"
              description="Enter your question below to search your knowledge base and get AI-powered answers based on your stored content. The system will retrieve relevant information and use it to generate an informed response."
              type="info"
              showIcon
              icon={<ThunderboltOutlined />}
            />

            {/* Query Input Card */}
            <Card
              title={
                <Space>
                  <SearchOutlined />
                  <span>Query Configuration</span>
                </Space>
              }
              style={{
                background: mode === "dark" ? "#1a1a1a" : "#fafafa",
                border: mode === "dark" ? "1px solid #303030" : "1px solid #f0f0f0",
              }}
            >
              <Space direction="vertical" size={20} style={{ width: "100%" }}>
                {/* Question Input */}
                <div>
                  <Typography.Text strong style={{ display: "block", marginBottom: 8 }}>
                    Your Question <Typography.Text type="danger">*</Typography.Text>
                  </Typography.Text>
                  <Input.TextArea
                    placeholder="What would you like to know? Ask a question about your knowledge base..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    autoSize={{ minRows: 4, maxRows: 10 }}
                    size="large"
                    showCount
                    maxLength={2000}
                    onPressEnter={(e) => {
                      if (e.shiftKey) return;
                      e.preventDefault();
                      runRag();
                    }}
                  />
                </div>

                <Divider style={{ margin: 0 }} />

                {/* Model and Sources */}
                <div className="flex flex-wrap gap-6 items-start">
                  <div style={{ flex: "1 1 250px" }}>
                    <Typography.Text strong style={{ display: "block", marginBottom: 8 }}>
                      AI Model
                    </Typography.Text>
                    <Select
                      value={model}
                      onChange={(value) => setModel(value)}
                      options={modelOptions}
                      size="large"
                      style={{ width: "100%" }}
                    />
                  </div>

                  <div style={{ flex: "1 1 250px" }}>
                    <Typography.Text strong style={{ display: "block", marginBottom: 8 }}>
                      Knowledge Sources
                    </Typography.Text>
                    <Checkbox.Group
                      value={ingestionTypes}
                      options={[
                        { label: "Text Content", value: "text" },
                        { label: "Documents", value: "file" },
                        { label: "Images", value: "image" },
                      ]}
                      onChange={(values) => setIngestionTypes(values as string[])}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    />
                  </div>
                </div>

                <Divider style={{ margin: 0 }} />

                {/* Action Button */}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    type="primary"
                    size="large"
                    icon={<ThunderboltOutlined />}
                    onClick={runRag}
                    loading={isLoading}
                    disabled={!question.trim()}
                  >
                    {isLoading ? "Processing..." : "Run RAG Query"}
                  </Button>
                </div>
              </Space>
            </Card>

            {/* Results Card */}
            <Card
              title={
                <Space>
                  <BranchesOutlined />
                  <span>Results</span>
                </Space>
              }
              style={{
                background: mode === "dark" ? "#1a1a1a" : "#fafafa",
                border: mode === "dark" ? "1px solid #303030" : "1px solid #f0f0f0",
              }}
            >
              {answer ? (
                <div
                  style={{
                    background: mode === "dark" ? "#0a0a0a" : "#ffffff",
                    border: mode === "dark" ? "1px solid #303030" : "1px solid #e8e8e8",
                    borderRadius: 8,
                    padding: 16,
                    maxHeight: 600,
                    overflow: "auto",
                  }}
                >
                  <pre
                    style={{
                      margin: 0,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      fontFamily: "'Courier New', monospace",
                      fontSize: 13,
                      lineHeight: 1.6,
                    }}
                  >
                    {answer}
                  </pre>
                </div>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <Space direction="vertical" size={8}>
                      <Typography.Text type="secondary">
                        No results yet
                      </Typography.Text>
                      <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                        Enter a question and click "Run RAG Query" to see results
                      </Typography.Text>
                    </Space>
                  }
                  style={{ padding: "40px 0" }}
                />
              )}
            </Card>
          </Space>
        </div>
      </div>
    </div>
  );
}
