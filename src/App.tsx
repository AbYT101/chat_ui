// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { ChatProvider } from "./chat/ChatContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import Knowledge from "./pages/Knowledge";
import RagQuery from "./pages/RagQuery";
import VectorSearch from "./pages/VectorSearch";
import AppLayout from "./components/layout/AppLayout";

export default function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Chat />} />
            <Route path="knowledge" element={<Knowledge />} />
            <Route path="rag" element={<RagQuery />} />
            <Route path="vector-search" element={<VectorSearch />} />
          </Route>
          </Routes>
        </BrowserRouter>
      </ChatProvider>
    </AuthProvider>
  );
}
