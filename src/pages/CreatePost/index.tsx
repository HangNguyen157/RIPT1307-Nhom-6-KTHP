import { authUtils } from '@/utils/auth';
import {
  BoldOutlined,
  CodeOutlined,
  ItalicOutlined,
  LinkOutlined,
  PictureOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { history, request } from '@umijs/max';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Tag,
} from 'antd';
import { useEffect, useState } from 'react';
import styles from './index.less';

export default function CreatePost() {
  const [form] = Form.useForm();
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await request('/api/tags', { method: 'GET' });
        if (res?.success && Array.isArray(res.data?.list)) {
          setAvailableTags(res.data.list.map((t: any) => t.name));
        }
      } catch (err) {
        console.error('Error fetching tags:', err);
      }
    };
    fetchTags();
  }, []);

  const subjects = [
    'Lập Trình Cơ Bản',
    'Cấu Trúc Dữ Liệu',
    'Mạng Máy Tính',
    'Cơ Sở Dữ Liệu',
    'Hệ Điều Hành',
    'Web Development',
  ];

  const getAuthHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {};
    const token = authUtils.getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  };

  const handleAddTag = (tag: string) => {
    if (!tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (values: any) => {
    const currentUser = authUtils.getCurrentUser();
    if (!currentUser) {
      message.warning('Vui lòng đăng nhập để đăng bài');
      history.push('/login');
      return;
    }

    if (tags.length === 0) {
      message.error('Vui lòng chọn ít nhất 1 thẻ');
      return;
    }

    if (!content.trim()) {
      message.error('Vui lòng nhập nội dung bài viết');
      return;
    }

    setLoading(true);
    try {
      const res = await request('/api/posts', {
        method: 'POST',
        headers: getAuthHeaders(),
        data: {
          title: values.title,
          excerpt: content.trim().slice(0, 300),
          content: content.trim(),
          subject: values.subject,
          tags,
        },
      });

      if (res?.success) {
        message.success('Đăng bài thành công!');
        history.push(res.data?.id ? `/post/${res.data.id}` : '/forum');
      } else {
        message.error(res?.message || 'Đăng bài thất bại');
      }
    } catch (error: any) {
      message.error(error?.message || 'Đã xảy ra lỗi, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.createPostPage}>
      <div className={styles.header}>
        <h1>Tạo Bài Viết Mới</h1>
        <p>Chia sẻ câu hỏi hoặc kiến thức của bạn với cộng đồng</p>
      </div>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Card className={styles.card}>
          <Form.Item
            name="title"
            rules={[
              { required: true, message: 'Vui lòng nhập tiêu đề' },
              { min: 10, message: 'Tiêu đề phải có ít nhất 10 ký tự' },
            ]}
          >
            <Input
              size="large"
              placeholder="Tiêu đề bài viết (ví dụ: Làm sao để lấy phần tử từ một mảng trong Java?)"
              className={styles.titleInput}
            />
          </Form.Item>
        </Card>

        <Card className={styles.card} title="Nội Dung">
          <div className={styles.editorToolbar}>
            <Space>
              <Button type="text" icon={<BoldOutlined />} title="In đậm (Ctrl+B)" />
              <Button type="text" icon={<ItalicOutlined />} title="In nghiêng (Ctrl+I)" />
              <div className={styles.divider} />
              <Button type="text" icon={<CodeOutlined />} title="Chèn code" />
              <Button type="text" icon={<PictureOutlined />} title="Chèn hình ảnh" />
              <Button type="text" icon={<LinkOutlined />} title="Chèn liên kết" />
            </Space>
          </div>

          <textarea
            className={styles.textarea}
            placeholder="Nhập nội dung bài viết của bạn tại đây..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
          />

          <div className={styles.previewHint}>
            Gợi ý: Hãy mô tả vấn đề của bạn một cách chi tiết để nhận được câu trả lời tốt hơn
          </div>
        </Card>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Card className={styles.card}>
              <Form.Item
                name="subject"
                label="Môn Học"
                rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
              >
                <Select
                  size="large"
                  placeholder="Chọn môn học"
                  options={subjects.map((s) => ({ label: s, value: s }))}
                />
              </Form.Item>
            </Card>
          </Col>
        </Row>

        <Card className={styles.card} title="Thẻ (Tối đa 5)">
          <div className={styles.tagSelector}>
            <div className={styles.availableTags}>
              {availableTags.map((tag) => (
                <Tag
                  key={tag}
                  onClick={() => handleAddTag(tag)}
                  style={{
                    cursor: tags.includes(tag) ? 'default' : 'pointer',
                    opacity: tags.includes(tag) ? 0.5 : 1,
                  }}
                  color={tags.includes(tag) ? 'blue' : 'default'}
                >
                  {tag}
                </Tag>
              ))}
            </div>

            {tags.length > 0 && (
              <div className={styles.selectedTags}>
                <strong>Thẻ đã chọn:</strong>
                <Space wrap>
                  {tags.map((tag) => (
                    <Tag
                      key={tag}
                      closable
                      onClose={() => handleRemoveTag(tag)}
                      color="blue"
                    >
                      {tag}
                    </Tag>
                  ))}
                </Space>
              </div>
            )}
          </div>
        </Card>

        <div className={styles.actions}>
          <Space>
            <Button
              type="primary"
              danger
              size="large"
              icon={<SendOutlined />}
              loading={loading}
              htmlType="submit"
            >
              Đăng Bài
            </Button>
            <Button size="large" onClick={() => history.push('/forum')}>
              Hủy
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
}
