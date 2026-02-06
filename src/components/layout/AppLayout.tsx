// src/components/layout/AppLayout.tsx
import { Layout, theme } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";
import { useThemeMode } from "../../theme/ThemeProvider";

const { Sider, Content } = Layout;

export default function AppLayout() {
  const { token } = theme.useToken();
  const { mode } = useThemeMode();
  return (
    <Layout
      className="h-screen"
      style={{ height: "100vh", background: token.colorBgLayout }}
    >
      <Sider
        width={280}
        theme={mode === "dark" ? "dark" : "light"}
        style={{
          height: "100vh",
          overflow: "auto",
          background: token.colorBgContainer,
          borderRight: "none",
          boxShadow: "none",
        }}
      >
        <Sidebar />
      </Sider>
      <Layout style={{ height: "100vh", background: token.colorBgLayout }}>
        <Content
          className="overflow-hidden"
          style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            background: token.colorBgLayout,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
