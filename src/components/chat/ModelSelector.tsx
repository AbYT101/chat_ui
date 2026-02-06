// src/components/chat/ModelSelector.tsx
import { useEffect, useState } from "react";

interface ModelSelectorProps {
  onChange: (model: string) => void;
  defaultModel?: string;
  value?: string;
}

export default function ModelSelector({
  onChange,
  defaultModel = "gpt-5-mini",
  value,
}: ModelSelectorProps) {
  const [selected, setSelected] = useState(value ?? defaultModel);

  const models = ["gpt-5-mini", "gpt-4o-mini", "llama3.2:3b"];

  useEffect(() => {
    if (value) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelected(value);
    }
  }, [value]);

  return (
    <select
      value={value ?? selected}
      onChange={(e) => {
        setSelected(e.target.value);
        onChange(e.target.value);
      }}
      className="bg-gray-800 px-3 py-2 rounded"
    >
      {models.map((m) => (
        <option key={m} value={m}>
          {m}
        </option>
      ))}
    </select>
  );
}
