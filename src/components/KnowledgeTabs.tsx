import { Tabs } from "antd";
import { FileTextOutlined, FileOutlined, FileImageOutlined } from "@ant-design/icons";
import UploadBox from "./UploadBox";

export default function KnowledgeTabs() {
  return (
    <Tabs
      defaultActiveKey="text"
      size="large"
      items={[
        {
          key: "text",
          label: (
            <span>
              <FileTextOutlined style={{ marginRight: 8 }} />
              Text Content
            </span>
          ),
          children: <UploadBox type="text" />,
        },
        {
          key: "file",
          label: (
            <span>
              <FileOutlined style={{ marginRight: 8 }} />
              Documents
            </span>
          ),
          children: <UploadBox type="file" />,
        },
        {
          key: "image",
          label: (
            <span>
              <FileImageOutlined style={{ marginRight: 8 }} />
              Images
            </span>
          ),
          children: <UploadBox type="image" />,
        },
      ]}
      style={{
        minHeight: 400,
      }}
    />
  );
}
