import { ingestText, ingestFile, uploadImage } from "../api/ingest.api";
import { useState } from "react";

export default function UploadBox({ type }: { type: string }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    if (type === "text") await ingestText(text);
    if (type === "file" && file) await ingestFile(file);
    if (type === "image" && file) await uploadImage(file);
    alert("Ingested!");
  };

  return (
    <div className="bg-gray-800 p-6 rounded">
      {type === "text" && (
        <textarea
          className="w-full p-3 bg-gray-900"
          placeholder="Paste text here"
          onChange={(e) => setText(e.target.value)}
        />
      )}

      {(type === "file" || type === "image") && (
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      )}

      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-600 px-4 py-2 rounded"
      >
        Ingest
      </button>
    </div>
  );
}
