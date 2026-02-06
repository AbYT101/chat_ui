/* eslint-disable @typescript-eslint/no-explicit-any */
import { List } from "antd";

export default function SearchResults({ results }: { results: any[] }) {
  return (
    <List
      className="mt-4"
      dataSource={results}
      locale={{ emptyText: "No results yet." }}
      renderItem={(result, index) => (
        <List.Item className="border border-slate-800 rounded-lg bg-slate-900">
          <pre className="text-sm text-slate-200 whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        </List.Item>
      )}
    />
  );
}
