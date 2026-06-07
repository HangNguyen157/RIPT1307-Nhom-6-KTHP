import { authUtils } from '@/utils/auth';
import {
  BookOutlined,
  IdcardOutlined,
  LockOutlined,
  MailOutlined,
  RiseOutlined,
  RocketOutlined,
  TrophyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { history, useModel } from '@umijs/max';
import { Button, Checkbox, Form, Input, Select, message } from 'antd';
import { useState } from 'react';
import styles from './index.less';

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [role, setRole] = useState('sinhvien');
  const { setInitialState } = useModel('@@initialState');

  const handleSubmit = async (values: any) => {
    if (!values.terms) {
      message.error('Bạn phải chấp thuận Điều khoản dịch vụ');
      return;
    }

    setLoading(true);
    try {
      const user = await authUtils.register({
        name: values.fullName,
        email: values.email,
        password: values.password,
        role: values.role,
        department: values.department,
        studentId: values.studentId,
      });

      // Đồng bộ initialState để useAccess nhận quyền ngay sau đăng ký
      await setInitialState((s: any) => ({
        ...s,
        name: user.name,
        currentUser: user,
      }));

      message.success('Đăng ký thành công!');
      setTimeout(() => {
        history.push('/home');
      }, 800);
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
          <div className={styles.logo}>
            <BookOutlined /> EduForum
          </div>
          <h1 className={styles.title}>Gia Nhập Cộng Đồng</h1>
          <p className={styles.subtitle}>
            Bắt đầu hành trình học tập của bạn ngay hôm nay
          </p>
          <div className={styles.features}>
            <div className={styles.feature}>
              <RocketOutlined className={styles.icon} />
              <span>Đặt câu hỏi và nhận câu trả lời từ chuyên gia</span>
            </div>
            <div className={styles.feature}>
              <RiseOutlined className={styles.icon} />
              <span>Xây dựng kiến thức lập trình bền vững</span>
            </div>
            <div className={styles.feature}>
              <TrophyOutlined className={styles.icon} />
              <span>Kiếm điểm uy tín và sách sẽ</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className={styles.rightSide}>
          <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>Đăng Ký Tài Khoản</h2>

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
                initialValue="sinhvien"
              >
                <Select
                  size="large"
                  onChange={setRole}
                  options={[
                    { label: 'Sinh viên', value: 'sinhvien' },
                    { label: 'Giảng viên', value: 'giangvien' },
                  ]}
                  className={styles.input}
                />
              </Form.Item>

              {/* Department - Only for students */}
              {role === 'sinhvien' && (
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
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                    message:
                      'Mật khẩu phải có ít nhất 8 ký tự, bao gồm: chữ hoa, chữ thường, số',
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  prefix={<LockOutlined />}
                  placeholder="Mật khẩu (8+ ký tự: hoa, thường, số)"
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
                        new Error('Mật khẩu xác nhận không khớp'),
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
                  </Button>{' '}
                  và{' '}
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
                  Đăng Ký
                </Button>
              </Form.Item>
            </Form>

            <div className={styles.footer}>
              <span>Đã có tài khoản? </span>
              <Button type="link" danger onClick={() => history.push('/login')}>
                Đăng nhập ngay
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
