import { authUtils } from '@/utils/auth';
import {
  BookOutlined,
  BulbOutlined,
  LockOutlined,
  ReadOutlined,
  TeamOutlined,
  TrophyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { history, useModel } from '@umijs/max';
import { Button, Checkbox, Form, Input, Space, message } from 'antd';
import { useState } from 'react';
import styles from './index.less';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const demoUsers = authUtils.getDemoCredentials();
  const { setInitialState } = useModel('@@initialState');

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const user = await authUtils.login(values.email, values.password);

      // Cập nhật initialState ngay để access plugin (useAccess)
      // nhận quyền mới mà không cần reload trang
      await setInitialState((s: any) => ({
        ...s,
        name: user.name,
        currentUser: user,
      }));

      message.success('Đăng nhập thành công!');

      // Điều hướng theo vai trò: admin vào thẳng khu quản trị
      const target = user.role === 'admin' ? '/admin/dashboard' : '/home';
      setTimeout(() => history.push(target), 500);
    } catch (error: any) {
      // Display error message from backend or generic fallback
      const errorMsg =
        error?.message || error?.toString?.() || 'Đăng nhập thất bại';
      message.error(errorMsg);
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (email: string) => {
    form.setFieldsValue({ email, password: '12345678' });
  };

  const roleLabel = (role: string) => {
    if (role === 'admin') return 'Admin';
    if (role === 'giangvien') return 'GV';
    return 'SV';
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.container}>
        <div className={styles.leftSide}>
          <div className={styles.logo}>
            <BookOutlined /> EduForum
          </div>
          <h1 className={styles.title}>
            Kết Nối
            <br />
            Tri Thức Sinh Viên
          </h1>
          <p className={styles.subtitle}>
            Hỏi, trả lời và cùng nhau học tập với cộng đồng PTIT
          </p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <BulbOutlined />
              <span>Chia sẻ kiến thức của bạn</span>
            </div>
            <div className={styles.feature}>
              <ReadOutlined />
              <span>Học từ giảng viên và chuyên gia</span>
            </div>
            <div className={styles.feature}>
              <TrophyOutlined />
              <span>Tích điểm uy tín và huy hiệu</span>
            </div>
            <div className={styles.feature}>
              <TeamOutlined />
              <span>Kết nối với cộng đồng học thuật</span>
            </div>
          </div>

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <div className={styles.statNum}>10.000+</div>
              <div>Câu hỏi</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNum}>2.000+</div>
              <div>Sinh viên</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNum}>500+</div>
              <div>Giảng viên</div>
            </div>
          </div>
        </div>

        <div className={styles.rightSide}>
          <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>Đăng Nhập</h2>
            <p className={styles.formSubtitle}>Chào mừng bạn quay lại!</p>

            <div className={styles.demoSection}>
              <div className={styles.demoLabel}>
                Tài khoản demo (click để tự động điền):
              </div>
              <div className={styles.demoButtons}>
                {demoUsers.map((u) => (
                  <button
                    type="button"
                    key={u.email}
                    className={styles.demoBtn}
                    onClick={() => fillDemo(u.email)}
                  >
                    [{roleLabel(u.role)}] {u.name.split(' ').pop()}
                  </button>
                ))}
              </div>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              autoComplete="off"
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email' },
                  { type: 'email' },
                ]}
              >
                <Input
                  size="large"
                  prefix={<UserOutlined />}
                  placeholder="Email của bạn"
                  className={styles.input}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
              >
                <Input.Password
                  size="large"
                  prefix={<LockOutlined />}
                  placeholder="Mật khẩu"
                  className={styles.input}
                />
              </Form.Item>

              <Form.Item>
                <Space className={styles.options}>
                  <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                  <Button type="link" danger size="small">
                    Quên mật khẩu?
                  </Button>
                </Space>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  danger
                  size="large"
                  block
                  loading={loading}
                  htmlType="submit"
                  className={styles.submitBtn}
                >
                  Đăng Nhập
                </Button>
              </Form.Item>
            </Form>

            <div className={styles.footer}>
              <span>Chưa có tài khoản? </span>
              <Button
                type="link"
                danger
                onClick={() => history.push('/register')}
              >
                Đăng ký ngay
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
