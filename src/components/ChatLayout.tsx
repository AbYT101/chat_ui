import type { ReactNode } from "react";

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {children}
    </div>
  );
}
