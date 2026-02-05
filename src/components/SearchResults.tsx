/* eslint-disable @typescript-eslint/no-explicit-any */
export default function SearchResults({ results }: { results: any[] }) {
  return (
    <div className="mt-4 space-y-2">
      {results.map((r, i) => (
        <div key={i} className="bg-gray-800 p-3 rounded">
          <pre className="text-sm">{JSON.stringify(r, null, 2)}</pre>
        </div>
      ))}
    </div>
  );
}
