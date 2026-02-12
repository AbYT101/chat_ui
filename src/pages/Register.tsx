import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  Divider,
  Form,
  Input,
  Layout,
  Space,
  Switch,
  Typography,
  theme,
} from "antd";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { register as registerRequest } from "../api/auth.api";
import { useAuth } from "../auth/AuthContext";
import { useChat } from "../chat/ChatContext";
import { useThemeMode } from "../theme/ThemeProvider";

const extractToken = (payload: unknown) => {
  if (!payload || typeof payload !== "object") return null;
  const data = payload as Record<string, unknown>;
  const token = data.access_token ?? data.token;
  return typeof token === "string" ? token : null;
};

export default function Register() {
  const { token } = theme.useToken();
  const { mode, toggle } = useThemeMode();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { clearCacheAndRefresh } = useChat();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (values: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    setError(null);
    setLoading(true);
    try {
      const response = await registerRequest(
        values.email.trim(),
        values.password
      );
      const token = extractToken(response.data);
      if (token) {
        login(token);
        await clearCacheAndRefresh();
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to create account.";
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
          mode === "dark"
            ? "radial-gradient(circle at top, rgba(56, 189, 248, 0.16), transparent 45%), #0b1220"
            : "radial-gradient(circle at top, rgba(56, 189, 248, 0.12), transparent 45%), #f8fafc",
      }}
    >
      <Layout.Content
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 16px",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: 24, right: 24 }}>
          <Switch
            checked={mode === "dark"}
            onChange={toggle}
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
          />
        </div>
        <Card
          style={{
            width: "100%",
            maxWidth: 440,
            boxShadow: token.boxShadowSecondary,
          }}
          styles={{ body: { padding: 32 } }}
          bordered
        >
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div>
              <Title level={3} style={{ marginBottom: 4 }}>
                Create your account
              </Title>
              <Text type="secondary">
                Get started with your personal AI workspace.
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
                rules={[{ required: true, message: "Create a password." }]}
                extra="Use a mix of letters, numbers, and symbols."
              >
                <Input.Password
                  size="large"
                  placeholder="Create a password"
                  autoComplete="new-password"
                />
              </Form.Item>
              <Form.Item
                label="Confirm password"
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Confirm your password." },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match.")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
              >
                Create account
              </Button>
            </Form>

            <Divider plain>Already have an account?</Divider>
            <Text type="secondary">
              <Link to="/login">Sign in</Link> instead.
            </Text>
          </Space>
        </Card>
      </Layout.Content>
    </Layout>
  );
}

