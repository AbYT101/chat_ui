import { useState } from "react";
import { ragQuery } from "../api/rag.api";

export default function RagQuery() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const runRag = async () => {
    const res = await ragQuery(question, "gpt-4o-mini", ["file", "text"]);
    setAnswer(JSON.stringify(res.data, null, 2));
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-xl mb-4">RAG Query</h1>
      <textarea
        className="w-full bg-gray-800 p-3"
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button onClick={runRag} className="mt-2 bg-blue-600 px-4 py-2">
        Run RAG
      </button>
      <pre className="mt-4 bg-gray-900 p-4">{answer}</pre>
    </div>
  );
}
