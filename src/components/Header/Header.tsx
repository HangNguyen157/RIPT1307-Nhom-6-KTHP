import {
  EditOutlined,
  FireOutlined,
  HomeOutlined,
  LogoutOutlined,
  MoonOutlined,
  SearchOutlined,
  SettingOutlined,
  SunOutlined,
  TagsOutlined,
  TrophyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { history, useLocation } from '@umijs/max';
import { Avatar, Button, Dropdown, Space, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';

import NotificationDropdown from '@/components/NotificationDropdown';
import { authUtils } from '@/utils/auth';
import { getReputationLevel } from '@/utils/reputation';

import styles from './index.less';

interface HeaderProps {
  onToggleTheme?: () => void;
  theme?: 'light' | 'dark';
}

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

export default function Header({
  onToggleTheme,
  theme = 'light',
}: HeaderProps) {
  const location = useLocation();

  const [currentUser, setCurrentUser] = useState(authUtils.getCurrentUser());

  const [searchValue, setSearchValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentUser(authUtils.getCurrentUser());
  }, [location.pathname]);

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

  const handleLogout = () => {
    authUtils.logout();
    setCurrentUser(null);
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
              background: 'var(--color-primary)',
            }}
          >
            {currentUser.name.charAt(0)}
          </Avatar>

          <div>
            <div className={styles.userName}>{currentUser.name}</div>

            {repLevel && (
              <div className={styles.userRep}>
                <span>{repLevel.emoji}</span>

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

    ...(currentUser?.role === 'admin'
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
      {/* TOP BAR */}
      <div className={styles.topBar}>
        <div className={styles.container}>
          {/* LOGO */}
          <div className={styles.logo} onClick={() => history.push('/')}>
            <span className={styles.logoIcon}>📚</span>

            <span className={styles.logoText}>
              EduForum
              <span className={styles.logoDot}>.</span>
            </span>
          </div>

          {/* SEARCH */}
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

            {/* SEARCH SUGGESTIONS */}
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

          {/* ACTIONS */}
          <div className={styles.actions}>
            {/* THEME */}
            <Tooltip title={theme === 'dark' ? 'Chế độ sáng' : 'Chế độ tối'}>
              <button className={styles.themeToggle} onClick={onToggleTheme}>
                {theme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
              </button>
            </Tooltip>

            {currentUser ? (
              <Space size="small">
                {/* NOTIFICATION */}
                <NotificationDropdown
                  open={notifOpen}
                  onOpenChange={setNotifOpen}
                />

                {/* ASK BUTTON */}
                <Button
                  type="primary"
                  danger
                  size="small"
                  className={styles.askBtn}
                  onClick={() => history.push('/post/new')}
                >
                  + Đặt Câu Hỏi
                </Button>

                {/* USER MENU */}
                <Dropdown
                  menu={{ items: userMenuItems }}
                  trigger={['click']}
                  placement="bottomRight"
                >
                  <div className={styles.avatarWrapper}>
                    <Avatar
                      size={36}
                      style={{
                        background: 'var(--color-primary)',
                        cursor: 'pointer',
                      }}
                    >
                      {currentUser.name.charAt(0)}
                    </Avatar>

                    {repLevel && (
                      <span className={styles.levelBadge}>
                        {repLevel.emoji}
                      </span>
                    )}
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

      {/* NAVBAR */}
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
