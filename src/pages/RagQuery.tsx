import { useState } from "react";
import { Button, Card, Checkbox, Input, Select, Typography } from "antd";
import { ragQuery } from "../api/rag.api";

const modelOptions = [
  { value: "gpt-5-mini", label: "gpt-5-mini" },
  { value: "gpt-4o-mini", label: "gpt-4o-mini" },
  { value: "llama3.2:3b", label: "llama3.2:3b" },
];

export default function RagQuery() {
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
    try {
      const res = await ragQuery(
        question.trim(),
        model,
        ingestionTypes.length ? ingestionTypes : null
      );
      setAnswer(JSON.stringify(res.data, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 overflow-y-auto" style={{ height: '100%', width: '100%' }}>
      <Typography.Title level={3} className="!text-slate-100">
        RAG Query
      </Typography.Title>
      <Card className="bg-slate-950 border border-slate-800">
        <div className="flex flex-col gap-4">
          <Input.TextArea
            placeholder="Ask a question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            autoSize={{ minRows: 3, maxRows: 6 }}
          />
          <div className="flex flex-wrap gap-4 items-center">
            <Select
              value={model}
              onChange={(value) => setModel(value)}
              options={modelOptions}
              className="min-w-[200px]"
            />
            <Checkbox.Group
              value={ingestionTypes}
              options={[
                { label: "Files", value: "file" },
                { label: "Images", value: "image" },
                { label: "Text", value: "text" },
              ]}
              onChange={(values) => setIngestionTypes(values as string[])}
            />
          </div>
          <Button type="primary" onClick={runRag} loading={isLoading}>
            Run RAG
          </Button>
          <pre className="mt-2 bg-slate-900 border border-slate-800 p-4 rounded text-slate-200">
            {answer || "Results will appear here."}
          </pre>
        </div>
      </Card>
    </div>
  );
}
