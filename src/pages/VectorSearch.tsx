/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { similaritySearch } from "../api/vector.api";
import SearchResults from "../components/SearchResults";

export default function VectorSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async () => {
    const res = await similaritySearch(query);
    setResults(res.data);
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-xl mb-4">Vector Search</h1>
      <input
        className="bg-gray-800 p-3 w-full"
        placeholder="Search vectors..."
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch} className="mt-2 bg-blue-600 px-4 py-2">
        Search
      </button>
      <SearchResults results={results} />
    </div>
  );
}

