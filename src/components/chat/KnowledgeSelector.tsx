// src/components/chat/KnowledgeSelector.tsx
import { useState } from "react";

interface KnowledgeSelectorProps {
  onChange: (types: string[] | null) => void;
}

export default function KnowledgeSelector({ onChange }: KnowledgeSelectorProps) {
  const options = ["text", "file", "image"];
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (type: string) => {
    let newSelected: string[];
    if (selected.includes(type)) newSelected = selected.filter((s) => s !== type);
    else newSelected = [...selected, type];
    setSelected(newSelected);
    onChange(newSelected.length ? newSelected : null);
  };

  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => toggle(opt)}
          className={`px-3 py-1 rounded ${
            selected.includes(opt) ? "bg-blue-600" : "bg-gray-700"
          }`}
        >
          {opt.toUpperCase()}
        </button>
      ))}
      <button
        onClick={() => {
          setSelected([]);
          onChange(null);
        }}
        className="px-3 py-1 rounded bg-red-600"
      >
        NONE
      </button>
    </div>
  );
}
