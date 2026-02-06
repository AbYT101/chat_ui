import { Tabs } from "antd";
import UploadBox from "./UploadBox";

export default function KnowledgeTabs() {
  return (
    <Tabs
      defaultActiveKey="text"
      items={[
        {
          key: "text",
          label: "Text",
          children: <UploadBox type="text" />,
        },
        {
          key: "file",
          label: "File",
          children: <UploadBox type="file" />,
        },
        {
          key: "image",
          label: "Image",
          children: <UploadBox type="image" />,
        },
      ]}
    />
  );
}
