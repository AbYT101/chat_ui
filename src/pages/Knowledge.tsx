import KnowledgeTabs from "../components/KnowledgeTabs";
import { Card, Typography } from "antd";

export default function Knowledge() {
  return (
    <div className="p-6 overflow-y-auto" style={{ height: '100%', width: '100%' }}>
      <Typography.Title level={3} className="!text-slate-100">
        Knowledge Bases
      </Typography.Title>
      <Card className="bg-slate-950 border border-slate-800">
        <KnowledgeTabs />
      </Card>
    </div>
  );
}
