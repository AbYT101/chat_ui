import { ingestText, ingestFile, uploadImage } from "../api/ingest.api";
import { useState } from "react";
import { Button, Input, Upload, message, Space, Card, Typography, Alert } from "antd";
import { InboxOutlined, SaveOutlined } from "@ant-design/icons";
import { useThemeMode } from "../theme/ThemeProvider";

const { Dragger } = Upload;

export default function UploadBox({ type }: { type: string }) {
  const { mode } = useThemeMode();
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (type === "text") {
        if (!text.trim()) {
          message.warning("Please provide text to ingest.");
          setIsLoading(false);
          return;
        }
        await ingestText(text.trim(), title.trim() || undefined);
      }
      if (type === "file") {
        if (!file) {
          message.warning("Please attach a file.");
          setIsLoading(false);
          return;
        }
        await ingestFile(file);
      }
      if (type === "image") {
        if (!file) {
          message.warning("Please attach an image.");
          setIsLoading(false);
          return;
        }
        await uploadImage(file);
      }
      message.success("Content ingested successfully!");
      setText("");
      setTitle("");
      setFile(null);
    } catch (err) {
      const error =
        err instanceof Error ? err.message : "Unable to ingest content.";
      message.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInstructions = () => {
    switch (type) {
      case "text":
        return "Enter or paste text content to add to your knowledge base. You can optionally provide a title for better organization.";
      case "file":
        return "Upload documents (PDF, TXT, DOCX, etc.) to extract and index their content in your knowledge base.";
      case "image":
        return "Upload images to be processed and added to your knowledge base for visual content retrieval.";
      default:
        return "";
    }
  };

  return (
    <div style={{ padding: "24px 0" }}>
      <Space direction="vertical" size={24} style={{ width: "100%" }}>
        <Alert
          message={getInstructions()}
          type="info"
          showIcon
          style={{ fontSize: 13 }}
        />

        <Card
          style={{
            background: mode === "dark" ? "#1a1a1a" : "#fafafa",
            border: mode === "dark" ? "1px solid #303030" : "1px solid #f0f0f0",
          }}
        >
          {type === "text" ? (
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
              <div>
                <Typography.Text strong style={{ display: "block", marginBottom: 8 }}>
                  Title (Optional)
                </Typography.Text>
                <Input
                  placeholder="Enter a title for this content..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  size="large"
                />
              </div>

              <div>
                <Typography.Text strong style={{ display: "block", marginBottom: 8 }}>
                  Content <Typography.Text type="danger">*</Typography.Text>
                </Typography.Text>
                <Input.TextArea
                  placeholder="Paste or type your text content here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  autoSize={{ minRows: 8, maxRows: 16 }}
                  size="large"
                  showCount
                  maxLength={50000}
                />
              </div>
            </Space>
          ) : (
            <Dragger
              beforeUpload={(uploaded) => {
                setFile(uploaded);
                return false;
              }}
              onRemove={() => setFile(null)}
              maxCount={1}
              accept={type === "image" ? "image/*" : undefined}
              fileList={file ? [file as any] : []}
              style={{
                background: mode === "dark" ? "#0a0a0a" : "#ffffff",
                borderColor: mode === "dark" ? "#404040" : "#d9d9d9",
              }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ color: "#1890ff" }} />
              </p>
              <p className="ant-upload-text">
                Click or drag {type === "image" ? "image" : "file"} to this area to upload
              </p>
              <p className="ant-upload-hint" style={{ fontSize: 13 }}>
                {type === "image"
                  ? "Support for single image upload. Accepted formats: JPG, PNG, GIF, etc."
                  : "Support for single file upload. Accepted formats: PDF, TXT, DOCX, etc."}
              </p>
            </Dragger>
          )}
        </Card>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <Button
            size="large"
            onClick={() => {
              setText("");
              setTitle("");
              setFile(null);
            }}
            disabled={isLoading}
          >
            Clear
          </Button>
          <Button
            type="primary"
            size="large"
            icon={<SaveOutlined />}
            loading={isLoading}
            onClick={handleSubmit}
            disabled={
              (type === "text" && !text.trim()) ||
              (type !== "text" && !file)
            }
          >
            Ingest Content
          </Button>
        </div>
      </Space>
    </div>
  );
}
