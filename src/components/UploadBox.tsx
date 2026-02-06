import { ingestText, ingestFile, uploadImage } from "../api/ingest.api";
import { useState } from "react";
import { Button, Input, Upload, message } from "antd";

export default function UploadBox({ type }: { type: string }) {
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
      message.success("Ingested successfully.");
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

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
      {type === "text" ? (
        <div className="flex flex-col gap-3">
          <Input
            placeholder="Optional title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input.TextArea
            placeholder="Paste text here"
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoSize={{ minRows: 4, maxRows: 10 }}
          />
        </div>
      ) : (
        <Upload
          beforeUpload={(uploaded) => {
            setFile(uploaded);
            return false;
          }}
          onRemove={() => setFile(null)}
          maxCount={1}
          accept={type === "image" ? "image/*" : undefined}
        >
          <Button>Select {type === "image" ? "image" : "file"}</Button>
        </Upload>
      )}

      <Button
        type="primary"
        className="mt-4"
        loading={isLoading}
        onClick={handleSubmit}
      >
        Ingest
      </Button>
    </div>
  );
}
