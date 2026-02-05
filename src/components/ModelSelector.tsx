/* eslint-disable @typescript-eslint/no-explicit-any */
const MODELS = [
  "gpt-4o-mini",
  "gpt-3.5",
  "llama3.2:3b",
  "mixtral-groq",
];

export default function ModelSelector({
  model,
  setModel,
}: any) {
  return (
    <select
      value={model}
      onChange={(e) => setModel(e.target.value)}
      className="bg-gray-800 text-white p-2 rounded"
    >
      {MODELS.map((m) => (
        <option key={m} value={m}>
          {m}
        </option>
      ))}
    </select>
  );
}
