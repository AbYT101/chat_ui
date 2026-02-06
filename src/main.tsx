import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConfigProvider, theme } from "antd";
import "antd/dist/reset.css";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#6366f1",
          colorBgBase: "#0f172a",
          colorTextBase: "#e2e8f0",
          colorBorder: "#1f2937",
        },
      }}
    >
      <App />
    </ConfigProvider>
  </StrictMode>,
)
