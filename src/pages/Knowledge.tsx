import KnowledgeTabs from "../components/KnowledgeTabs";
import { Typography, Space } from "antd";
import { DatabaseOutlined } from "@ant-design/icons";
import { useThemeMode } from "../theme/ThemeProvider";

export default function Knowledge() {
  const { mode } = useThemeMode();

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
          <DatabaseOutlined style={{ fontSize: 24, color: "#1890ff" }} />
          <div>
            <Typography.Title level={4} style={{ margin: 0, fontWeight: 600 }}>
              Knowledge Base
            </Typography.Title>
            <Typography.Text type="secondary" style={{ fontSize: 13 }}>
              Manage your knowledge sources and documents
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
          <KnowledgeTabs />
        </div>
      </div>
    </div>
  );
}
