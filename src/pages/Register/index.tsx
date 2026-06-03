import {
  Form,
  Input,
  Button,
  Select,
  Divider,
  Space,
  message,
  Checkbox,
} from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import { useState } from 'react';
import styles from './index.less';

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [role, setRole] = useState('student');

  const handleSubmit = async (values: any) => {
    if (!values.terms) {
      message.error('Bạn phải chấp thuận Điều khoản dịch vụ');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      message.success('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản');
      setTimeout(() => {
        history.push('/login');
      }, 2000);
    } catch (error) {
      message.error('Đã xảy ra lỗi, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.container}>
        {/* Left Side - Info */}
        <div className={styles.leftSide}>
          <div className={styles.logo}>📚 EduForum</div>
          <h1 className={styles.title}>Tham gia EduForum</h1>
          <p className={styles.subtitle}>
            Bắt đầu hành trình học tập của bạn ngay hôm nay
          </p>
          <div className={styles.features}>
            <div className={styles.feature}>
              <span className={styles.icon}>🚀</span>
              <span>Đặt câu hỏi và nhận câu trả lời từ chuyên gia</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.icon}>📈</span>
              <span>Xây dựng kiến thức lập trình bền vững</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.icon}>🏆</span>
              <span>Kiếm điểm uy tín và sách sẽ</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className={styles.rightSide}>
          <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>Đăng ký tài khoản</h2>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              autoComplete="off"
            >
              {/* Full Name */}
              <Form.Item
                name="fullName"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập họ và tên',
                  },
                ]}
              >
                <Input
                  size="large"
                  prefix={<UserOutlined />}
                  placeholder="Họ và tên"
                  className={styles.input}
                />
              </Form.Item>

              {/* Email */}
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập email',
                  },
                  {
                    type: 'email',
                    message: 'Email không hợp lệ',
                  },
                  {
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Email phải là email sinh viên (.edu, .ac.vn)',
                  },
                ]}
              >
                <Input
                  size="large"
                  prefix={<MailOutlined />}
                  placeholder="Email sinh viên (ví dụ: name@student.edu.vn)"
                  className={styles.input}
                />
              </Form.Item>

              {/* Student/Teacher ID */}
              <Form.Item
                name="studentId"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập mã sinh viên/giảng viên',
                  },
                ]}
              >
                <Input
                  size="large"
                  prefix={<IdcardOutlined />}
                  placeholder="Mã sinh viên hoặc mã giảng viên"
                  className={styles.input}
                />
              </Form.Item>

              {/* Role Selection */}
              <Form.Item
                name="role"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn vai trò',
                  },
                ]}
                initialValue="student"
              >
                <Select
                  size="large"
                  onChange={setRole}
                  options={[
                    {
                      label: '👨‍🎓 Sinh viên',
                      value: 'student',
                    },
                    {
                      label: '👨‍🏫 Giảng viên',
                      value: 'teacher',
                    },
                  ]}
                  className={styles.input}
                />
              </Form.Item>

              {/* Department - Only for students */}
              {role === 'student' && (
                <Form.Item
                  name="department"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng chọn chuyên ngành',
                    },
                  ]}
                >
                  <Select
                    size="large"
                    placeholder="Chọn chuyên ngành"
                    options={[
                      { label: 'CNTT', value: 'it' },
                      { label: 'HTTT', value: 'is' },
                      { label: 'Kỹ Thuật Phần Mềm', value: 'se' },
                      { label: 'An Toàn Thông Tin', value: 'security' },
                    ]}
                    className={styles.input}
                  />
                </Form.Item>
              )}

              {/* Password */}
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập mật khẩu',
                  },
                  {
                    min: 8,
                    message: 'Mật khẩu phải có ít nhất 8 ký tự',
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  prefix={<LockOutlined />}
                  placeholder="Mật khẩu (tối thiểu 8 ký tự)"
                  className={styles.input}
                />
              </Form.Item>

              {/* Confirm Password */}
              <Form.Item
                name="confirmPassword"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng xác nhận mật khẩu',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error('Mật khẩu xác nhận không khớp')
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  size="large"
                  prefix={<LockOutlined />}
                  placeholder="Xác nhận mật khẩu"
                  className={styles.input}
                />
              </Form.Item>

              {/* Terms */}
              <Form.Item
                name="terms"
                valuePropName="checked"
                rules={[
                  {
                    required: true,
                    message: 'Bạn phải chấp thuận Điều khoản dịch vụ',
                  },
                ]}
              >
                <Checkbox>
                  Tôi đồng ý với{' '}
                  <Button type="link" danger size="small">
                    Điều khoản dịch vụ
                  </Button>
                  {' '}và{' '}
                  <Button type="link" danger size="small">
                    Chính sách bảo mật
                  </Button>
                </Checkbox>
              </Form.Item>

              {/* Submit */}
              <Form.Item>
                <Button
                  type="primary"
                  danger
                  size="large"
                  block
                  loading={loading}
                  htmlType="submit"
                >
                  Đăng ký
                </Button>
              </Form.Item>
            </Form>

            <Divider>Hoặc</Divider>

            <Space size="middle" className={styles.socialRegister}>
              <Button size="large" block>
                Google
              </Button>
              <Button size="large" block>
                GitHub
              </Button>
            </Space>

            <div className={styles.footer}>
              <span>Đã có tài khoản? </span>
              <Button
                type="link"
                danger
                onClick={() => history.push('/login')}
              >
              Đăng nhập
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}