import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Divider, Space, message } from 'antd';
import { UserOutlined, LockOutlined, EyeOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import { authUtils } from '@/utils/auth';
import styles from './index.less';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const demoUsers = authUtils.getDemoCredentials();

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await authUtils.login(values.email, values.password);
      message.success('🎉 Đăng nhập thành công!');
      setTimeout(() => history.push('/home'), 500);
    } catch (error: any) {
      message.error(error.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (email: string) => {
    form.setFieldsValue({ email, password: 'password123' });
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.container}>
        {/* Left Side */}
        <div className={styles.leftSide}>
          <div className={styles.logo}>📚 EduForum</div>
          <h1 className={styles.title}>Kết Nối<br />Tri Thức Sinh Viên</h1>
          <p className={styles.subtitle}>Hỏi, trả lời và cùng nhau học tập với cộng đồng PTIT</p>

          <div className={styles.features}>
            <div className={styles.feature}><span>💡</span><span>Chia sẻ kiến thức của bạn</span></div>
            <div className={styles.feature}><span>🎓</span><span>Học từ giảng viên và chuyên gia</span></div>
            <div className={styles.feature}><span>🏆</span><span>Tích điểm uy tín và huy hiệu</span></div>
            <div className={styles.feature}><span>🤝</span><span>Kết nối với cộng đồng học thuật</span></div>
          </div>

          <div className={styles.stats}>
            <div className={styles.statItem}><div className={styles.statNum}>10.000+</div><div>Câu hỏi</div></div>
            <div className={styles.statItem}><div className={styles.statNum}>2.000+</div><div>Sinh viên</div></div>
            <div className={styles.statItem}><div className={styles.statNum}>500+</div><div>Giảng viên</div></div>
          </div>
        </div>

        {/* Right Side */}
        <div className={styles.rightSide}>
          <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>Đăng Nhập</h2>
            <p className={styles.formSubtitle}>Chào mừng bạn quay lại! 👋</p>

            {/* Demo accounts */}
            <div className={styles.demoSection}>
              <div className={styles.demoLabel}>Tài khoản demo (click để điền):</div>
              <div className={styles.demoButtons}>
                {demoUsers.map((u) => (
                  <button key={u.email} className={styles.demoBtn} onClick={() => fillDemo(u.email)}>
                    {u.role === 'admin' ? '⚙️' : u.role === 'teacher' ? '👨‍🏫' : '👨‍🎓'} {u.name.split(' ').pop()}
                  </button>
                ))}
              </div>
            </div>

            <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
              <Form.Item name="email" rules={[{ required: true, message: 'Vui lòng nhập email' }, { type: 'email' }]}>
                <Input
                  size="large"
                  prefix={<UserOutlined />}
                  placeholder="Email của bạn"
                  className={styles.input}
                />
              </Form.Item>

              <Form.Item name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}>
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
                  <Button type="link" danger size="small">Quên mật khẩu?</Button>
                </Space>
              </Form.Item>

              <Form.Item>
                <Button type="primary" danger size="large" block loading={loading} htmlType="submit"
                  className={styles.submitBtn}>
                  🚀 Đăng Nhập
                </Button>
              </Form.Item>
            </Form>

            <div className={styles.footer}>
              <span>Chưa có tài khoản? </span>
              <Button type="link" danger onClick={() => history.push('/register')}>
                Đăng ký ngay →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}