// src/components/layout/AppLayout.tsx
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";

const { Sider, Content } = Layout;

export default function AppLayout() {
  return (
    <Layout className="h-screen bg-slate-950 text-white" style={{ height: '100vh' }}>
      <Sider
        width={280}
        theme="dark"
        className="border-r border-slate-800 bg-slate-950"
        style={{ height: '100vh', overflow: 'auto' }}
      >
        <Sidebar />
      </Sider>
      <Layout className="bg-slate-950" style={{ height: '100vh' }}>
        <Content className="overflow-hidden" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
