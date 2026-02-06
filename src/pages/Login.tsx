import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Divider,
  Form,
  Input,
  Layout,
  Space,
  Typography,
} from "antd";
import { login as loginRequest } from "../api/auth.api";
import { useAuth } from "../auth/AuthContext";

const extractToken = (payload: unknown) => {
  if (!payload || typeof payload !== "object") return null;
  const data = payload as Record<string, unknown>;
  const token = data.access_token ?? data.token;
  return typeof token === "string" ? token : null;
};

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (values: { email: string; password: string }) => {
    setError(null);
    setLoading(true);
    try {
      const response = await loginRequest(values.email.trim(), values.password);
      const token = extractToken(response.data);
      if (!token) {
        throw new Error("Login succeeded but no token was returned.");
      }
      login(token);
      navigate("/");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to sign in.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const { Title, Text } = Typography;

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(99, 102, 241, 0.18), transparent 45%), #0b1220",
      }}
    >
      <Layout.Content
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 16px",
        }}
      >
        <Card
          style={{ width: "100%", maxWidth: 420 }}
          styles={{ body: { padding: 32 } }}
          bordered
        >
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div>
              <Title level={3} style={{ marginBottom: 4 }}>
                Welcome back
              </Title>
              <Text type="secondary">
                Sign in to continue to your AI workspace.
              </Text>
            </div>

            {error ? <Alert message={error} type="error" showIcon /> : null}

            <Form layout="vertical" onFinish={onSubmit} requiredMark={false}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter your email." },
                  { type: "email", message: "Enter a valid email address." },
                ]}
              >
                <Input
                  size="large"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Enter your password." }]}
              >
                <Input.Password
                  size="large"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </Form.Item>
              <Form.Item name="remember" valuePropName="checked">
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
              >
                Sign in
              </Button>
            </Form>

            <Divider plain>New here?</Divider>
            <Text type="secondary">
              Create your account{" "}
              <Link to="/register">and get started</Link>.
            </Text>
          </Space>
        </Card>
      </Layout.Content>
    </Layout>
  );
}

