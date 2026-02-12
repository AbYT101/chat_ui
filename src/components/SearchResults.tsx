/* eslint-disable @typescript-eslint/no-explicit-any */
import { List, Empty, Typography, Space, Spin, Card, Tag } from "antd";
import { FileTextOutlined, FileOutlined, FileImageOutlined } from "@ant-design/icons";
import { useThemeMode } from "../theme/ThemeProvider";

interface SearchResultsProps {
  results: any[];
  isLoading?: boolean;
}

export default function SearchResults({ results, isLoading }: SearchResultsProps) {
  const { mode } = useThemeMode();

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0" }}>
        <Space direction="vertical" align="center" size={16}>
          <Spin size="large" />
          <Typography.Text type="secondary">Searching...</Typography.Text>
        </Space>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <Space direction="vertical" size={8}>
            <Typography.Text type="secondary">
              No results found
            </Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 13 }}>
              Try a different search query or adjust your filters
            </Typography.Text>
          </Space>
        }
        style={{ padding: "40px 0" }}
      />
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "text":
        return <FileTextOutlined />;
      case "file":
        return <FileOutlined />;
      case "image":
        return <FileImageOutlined />;
      default:
        return <FileOutlined />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "text":
        return "blue";
      case "file":
        return "green";
      case "image":
        return "purple";
      default:
        return "default";
    }
  };

  return (
    <List
      dataSource={results}
      renderItem={(result, index) => (
        <List.Item style={{ border: "none", padding: 0, marginBottom: 16 }}>
          <Card
            size="small"
            style={{
              width: "100%",
              background: mode === "dark" ? "#0a0a0a" : "#ffffff",
              border: mode === "dark" ? "1px solid #303030" : "1px solid #e8e8e8",
            }}
          >
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
              {/* Header with metadata */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <Typography.Text strong style={{ fontSize: 13 }}>
                  Result #{index + 1}
                </Typography.Text>
                {result.ingestion_type && (
                  <Tag
                    icon={getTypeIcon(result.ingestion_type)}
                    color={getTypeColor(result.ingestion_type)}
                  >
                    {result.ingestion_type}
                  </Tag>
                )}
                {result.score !== undefined && (
                  <Tag color="gold">
                    Score: {typeof result.score === 'number' ? result.score.toFixed(4) : result.score}
                  </Tag>
                )}
              </div>

              {/* Content */}
              <div
                style={{
                  background: mode === "dark" ? "#141414" : "#fafafa",
                  border: mode === "dark" ? "1px solid #262626" : "1px solid #f0f0f0",
                  borderRadius: 6,
                  padding: 12,
                  maxHeight: 400,
                  overflow: "auto",
                }}
              >
                <pre
                  style={{
                    margin: 0,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    fontFamily: "'Courier New', monospace",
                    fontSize: 12,
                    lineHeight: 1.6,
                  }}
                >
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </Space>
          </Card>
        </List.Item>
      )}
    />
  );
}
