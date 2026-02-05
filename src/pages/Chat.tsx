// src/pages/Chat.tsx
import AppLayout from "../components/layout/AppLayout";

export default function Chat() {
  return (
    <AppLayout>
      <div className="flex-1 p-4 overflow-y-auto">
        Chat messages go here
      </div>
      <div className="p-4 border-t border-gray-700">
        Input box here
      </div>
    </AppLayout>
  );
}
