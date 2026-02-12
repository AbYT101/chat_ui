// src/components/chat/ModelSelector.tsx
import { useEffect, useMemo, useState } from "react";
import { Select } from "antd";

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

  const models = useMemo(
    () => [
      { value: "gpt-5-mini", label: "GPT-5 Mini" },
      { value: "gpt-4o-mini", label: "GPT-4o Mini" },
      { value: "llama3.2:3b", label: "Llama 3.2 3B" },
    ],
    []
  );

  useEffect(() => {
    if (value) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelected(value);
    }
  }, [value]);

  return (
    <Select
      value={value ?? selected}
      onChange={(next) => {
        setSelected(next);
        onChange(next);
      }}
      options={models}
      size="middle"
      style={{ minWidth: 180 }}
    />
  );
}
