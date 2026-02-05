// src/components/layout/AppLayout.tsx
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <aside className="w-64 border-r border-gray-700">
        Sidebar
      </aside>

      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}
