import {
  BookOutlined,
  EditOutlined,
  FireOutlined,
  HomeOutlined,
  LogoutOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
  SettingOutlined,
  TagsOutlined,
  TrophyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { history, useAccess, useLocation, useModel } from '@umijs/max';
import { Avatar, Button, Dropdown, Space, Tag } from 'antd';
import { useEffect, useRef, useState } from 'react';

import NotificationDropdown from '@/components/NotificationDropdown';
import { authUtils } from '@/utils/auth';
import { getReputationLevel } from '@/utils/reputation';

import styles from './index.less';

const SEARCH_SUGGESTIONS = [
  'OOP trong Java',
  'React Hooks useState',
  'SQL JOIN',
  'Cấu trúc dữ liệu Stack',
  'Python List Comprehension',
  'Node.js Express',
  'Git GitHub',
  'Thuật toán sắp xếp',
];

// Nhãn + màu hiển thị cho từng vai trò — giúp phân biệt role ngay trên Header
const ROLE_TAGS: Record<string, { label: string; color: string }> = {
  admin: { label: 'Quản trị viên', color: 'red' },
  giangvien: { label: 'Giảng viên', color: 'purple' },
  sinhvien: { label: 'Sinh viên', color: 'blue' },
};

export default function Header() {
  const location = useLocation();

  // Lấy user từ initialState (đồng bộ với access plugin) thay vì đọc
  // localStorage trực tiếp — login/logout cập nhật là Header đổi theo ngay
  const { initialState, setInitialState } = useModel('@@initialState');
  const access = useAccess();
  const currentUser = initialState?.currentUser ?? null;

  const [searchValue, setSearchValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    authUtils.logout();
    // Reset initialState để mọi quyền (useAccess) trở về trạng thái khách
    await setInitialState((s: any) => ({
      ...s,
      name: 'EduForum',
      currentUser: null,
    }));
    history.push('/');
  };

  const handleSearch = (value: string) => {
    const keyword = value.trim();

    if (!keyword) return;

    history.push(`/search?q=${encodeURIComponent(keyword)}`);
    setShowSuggestions(false);
  };

  const filteredSuggestions = SEARCH_SUGGESTIONS.filter((item) =>
    item.toLowerCase().includes(searchValue.toLowerCase()),
  ).slice(0, 5);

  const repLevel = currentUser
    ? getReputationLevel(currentUser.reputation)
    : null;

  const navLinks = [
    {
      label: 'Trang Chủ',
      path: '/',
      icon: <HomeOutlined />,
    },
    {
      label: 'Diễn Đàn',
      path: '/forum',
      icon: <FireOutlined />,
    },
    {
      label: 'Thẻ',
      path: '/tags',
      icon: <TagsOutlined />,
    },
    {
      label: 'Bảng Xếp Hạng',
      path: '/leaderboard',
      icon: <TrophyOutlined />,
    },
    // Mục riêng của GIẢNG VIÊN (+ admin) — sinh viên không thấy
    ...(access.canModerate
      ? [
          {
            label: 'Kiểm Duyệt',
            path: '/moderation',
            icon: <SafetyCertificateOutlined />,
          },
        ]
      : []),
  ];

  const userMenuItems = [
    {
      key: 'profile-header',
      disabled: true,
      label: currentUser ? (
        <div className={styles.userMenuHeader}>
          <Avatar
            size={42}
            style={{
              background: 'grey',
            }}
          >
            {currentUser.name.charAt(0)}
          </Avatar>

          <div>
            <div className={styles.userName}>
              {currentUser.name}{' '}
              <Tag
                color={ROLE_TAGS[currentUser.role]?.color}
                style={{ marginLeft: 4 }}
              >
                {ROLE_TAGS[currentUser.role]?.label ?? currentUser.role}
              </Tag>
            </div>

            {repLevel && (
              <div className={styles.userRep}>
                <span style={{ color: repLevel.color }}>{repLevel.name}</span>

                <span className={styles.repPoints}>
                  {currentUser.reputation} pts
                </span>
              </div>
            )}
          </div>
        </div>
      ) : null,
    },

    { type: 'divider' as const },

    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Hồ Sơ Cá Nhân',
      onClick: () => history.push(`/profile/${currentUser?.id || '1'}`),
    },

    {
      key: 'create',
      icon: <EditOutlined />,
      label: 'Đặt Câu Hỏi',
      onClick: () => history.push('/post/new'),
    },

    {
      key: 'leaderboard',
      icon: <TrophyOutlined />,
      label: 'Bảng Xếp Hạng',
      onClick: () => history.push('/leaderboard'),
    },

    // Chỉ admin thấy mục Quản Trị — quyền lấy từ src/access.ts qua useAccess()
    ...(access.canSeeAdmin
      ? [
          { type: 'divider' as const },

          {
            key: 'admin',
            icon: <SettingOutlined />,
            label: 'Quản Trị',
            onClick: () => history.push('/admin/dashboard'),
          },
        ]
      : []),

    { type: 'divider' as const },

    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng Xuất',
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <div className={styles.container}>
          <div className={styles.logo} onClick={() => history.push('/')}>
            <BookOutlined className={styles.logoIcon} />

            <span className={styles.logoText}>
              EduForum
              <span className={styles.logoDot}>.</span>
            </span>
          </div>

          <div className={styles.searchWrapper} ref={searchRef}>
            <div className={styles.searchBar}>
              <SearchOutlined className={styles.searchIcon} />

              <input
                className={styles.searchInput}
                placeholder="Tìm câu hỏi, bài viết, tags..."
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  setShowSuggestions(e.target.value.length > 0);
                }}
                onFocus={() => {
                  if (searchValue.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(searchValue);
                  }
                }}
              />

              {searchValue && (
                <button
                  type="button"
                  className={styles.searchClear}
                  onClick={() => {
                    setSearchValue('');
                    setShowSuggestions(false);
                  }}
                >
                  ×
                </button>
              )}
            </div>

            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className={styles.searchSuggestions}>
                {filteredSuggestions.map((item) => (
                  <div
                    key={item}
                    className={styles.suggestion}
                    onClick={() => {
                      setSearchValue(item);
                      handleSearch(item);
                    }}
                  >
                    <SearchOutlined className={styles.suggestionIcon} />

                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.actions}>
            {currentUser ? (
              <Space size="small">
                <NotificationDropdown
                  open={notifOpen}
                  onOpenChange={setNotifOpen}
                />

                <Button
                  type="primary"
                  danger
                  size="small"
                  className={styles.askBtn}
                  onClick={() => history.push('/post/new')}
                >
                  + Đặt Câu Hỏi
                </Button>

                {/* Tag vai trò luôn hiển thị — phân biệt GV/Admin với SV */}
                {ROLE_TAGS[currentUser.role] &&
                  currentUser.role !== 'sinhvien' && (
                    <Tag
                      color={ROLE_TAGS[currentUser.role].color}
                      style={{ marginRight: 0 }}
                    >
                      {ROLE_TAGS[currentUser.role].label}
                    </Tag>
                  )}

                <Dropdown
                  menu={{ items: userMenuItems }}
                  trigger={['click']}
                  placement="bottomRight"
                >
                  <div className={styles.avatarWrapper}>
                    <Avatar
                      size={36}
                      style={{
                        background: 'grey',
                        cursor: 'pointer',
                      }}
                    >
                      {currentUser.name.charAt(0)}
                    </Avatar>
                  </div>
                </Dropdown>
              </Space>
            ) : (
              <Space size="small">
                <Button
                  type="primary"
                  danger
                  size="small"
                  onClick={() => history.push('/login')}
                >
                  Đăng Nhập
                </Button>

                <Button
                  size="small"
                  className={styles.registerBtn}
                  onClick={() => history.push('/register')}
                >
                  Đăng Ký
                </Button>
              </Space>
            )}
          </div>
        </div>
      </div>

      <nav className={styles.navBar}>
        <div className={styles.navContainer}>
          {navLinks.map((link) => {
            const isActive =
              link.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(link.path);

            return (
              <div
                key={link.path}
                className={`${styles.navLink} ${
                  isActive ? styles.navLinkActive : ''
                }`}
                onClick={() => history.push(link.path)}
              >
                {link.icon}

                <span>{link.label}</span>
              </div>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
