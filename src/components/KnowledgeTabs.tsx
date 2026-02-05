/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import UploadBox from "./UploadBox";

export default function KnowledgeTabs() {
  const [tab, setTab] = useState<"text" | "file" | "image">("text");

  return (
    <>
      <div className="flex gap-4 mb-4">
        {["text", "file", "image"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
            className={`px-4 py-2 rounded ${
              tab === t ? "bg-blue-600" : "bg-gray-700"
            }`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      <UploadBox type={tab} />
    </>
  );
}
