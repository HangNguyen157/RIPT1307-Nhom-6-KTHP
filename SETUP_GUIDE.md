# Hướng Dẫn Thiết Lập và Chạy RIPT1307 Forum

## 📋 Yêu Cầu Hệ Thống

- **Node.js**: v20.15.0 (bắt buộc cho @umijs/max)
- **npm**: v10+ (đi kèm với Node.js v20)
- **OS**: Windows/Mac/Linux

## 🚀 Cài Đặt Nhanh

### Bước 1: Tải Node.js v20

Nếu bạn chưa có Node.js v20, hãy tải từ đây: https://nodejs.org/dist/v20.15.0/

Chọn phiên bản phù hợp:

- **Windows**: `node-v20.15.0-win-x64.zip` (portable) hoặc `.msi` (installer)
- **Mac**: `node-v20.15.0-darwin-x64.tar.gz`
- **Linux**: `node-v20.15.0-linux-x64.tar.xz`

### Bước 2: Cài Đặt Dependencies

**Phương pháp 1: Sử dụng script (Windows)**

```bash
# Chạy run-dev.bat để cài đặt và chạy dev server
.\run-dev.bat
```

**Phương pháp 2: Sử dụng PowerShell**

```powershell
# Cài đặt dependencies
.\run-dev.ps1 -Install

# Chạy dev server
.\run-dev.ps1
```

**Phương pháp 3: Thủ công**

```bash
# Đảm bảo Node v20 đã được thêm vào PATH
node --version  # Kiểm tra phiên bản

# Cài đặt dependencies
npm install

# Chạy dev server
npm run dev
```

## 📦 Các Lệnh Có Sẵn

```bash
# Cài đặt dependencies
npm install

# Chạy development server (localhost:8000)
npm run dev

# Build cho production
npm build

# Format code
npm format

# Setup husky git hooks
npm run setup
```

## 🏗️ Cấu Trúc Dự Án

```
my-app/
├── src/
│   ├── components/          # React components
│   │   ├── Header/          # Header component
│   │   ├── Sidebar/         # Sidebar navigation
│   │   ├── PostCard/        # Post card component
│   │   └── ...
│   ├── pages/               # Page components
│   │   ├── Home/            # Trang chủ
│   │   ├── Forum/           # Diễn đàn câu hỏi
│   │   ├── Login/           # Đăng nhập
│   │   ├── Register/        # Đăng ký
│   │   ├── CreatePost/      # Tạo bài viết
│   │   ├── Admin/           # Trang admin
│   │   └── ...
│   ├── services/            # API services
│   ├── utils/               # Utility functions
│   ├── styles/              # Global styles
│   ├── constants/           # Constants
│   ├── models/              # Global state (DVA)
│   ├── layouts/             # Layout components
│   ├── app.ts               # Umi config
│   └── access.ts            # Access control
├── config/
│   └── routes.ts            # Route definitions
├── mock/
│   └── userAPI.ts           # Mock API responses
└── package.json
```

## 🔧 Lỗi Thường Gặp

### "Node 20 is required when using utoopack"

- Đảm bảo Node.js v20.x.x đã được cài đặt
- Kiểm tra: `node --version`
- Nếu dùng phiên bản khác, hãy đặt Node v20 lên đầu trong PATH

### "npm: command not found"

- Node.js chưa được cài đặt hoặc chưa được thêm vào PATH
- Cài đặt lại Node.js từ nodejs.org

### Port 8000 đã được sử dụng

- Dừng các ứng dụng khác đang sử dụng port 8000
- Hoặc chỉ định port khác: `PORT=3000 npm run dev`

## 🔧 Cấu Hình TypeScript

TypeScript configuration được kế thừa từ `.umi` directory (auto-generated):

```json
{
  "extends": "./src/.umi/tsconfig.json"
}
```

## 📝 Ghi Chú Phát Triển

### Alias Imports

```typescript
// Bạn có thể dùng @ thay vì ../../../
import { Component } from '@/components/Component';
import { utils } from '@/utils';
```

### Less Variables

File `src/styles/variables.less` chứa các biến CSS chung cho toàn ứng dụng

### Mock API

Để test mà không cần backend, dùng mock data trong `mock/userAPI.ts`

### Umi Max Features

- ✅ Layout system
- ✅ Routing
- ✅ DVA state management
- ✅ antd/pro-components integration
- ✅ TypeScript support
- ✅ Access control

## 🚦 Bắt Đầu Phát Triển

1. **Chạy dev server**: `npm run dev` (hoặc `./run-dev.bat` trên Windows)
2. **Mở browser**: Truy cập http://localhost:8000
3. **Sửa code**: Các thay đổi sẽ được hot-reload tự động
4. **Build**: `npm run build` khi sẵn sàng triển khai

## 📚 Tài Liệu Tham Khảo

- [Umi Max Documentation](https://umijs.org/docs/max/introduce)
- [Ant Design Pro Components](https://procomponents.ant.design/)
- [Ant Design](https://ant.design/)
- [React Documentation](https://react.dev)

## 🤝 Cần Giúp?

Kiểm tra:

1. Phiên bản Node.js: `node --version`
2. Phiên bản npm: `npm --version`
3. Xóa node_modules và npm cache: `rm -rf node_modules && npm cache clean --force && npm install`
4. Kiểm tra file `.env` (nếu có)
