const path = require('path');

// Thư mục api/ ở gốc là build output của apiRoute (bundle nén) — tuyệt đối
// không cho eslint/prettier format lại (sẽ nổ ra hàng chục nghìn dòng).
// Dùng config dạng hàm vì glob exclude không tin cậy trên đường dẫn tuyệt đối.
const notBuildOutput = (files) =>
  files.filter((f) => {
    const rel = path.relative(process.cwd(), f).replace(/\\/g, '/');
    return !rel.startsWith('api/');
  });

const quote = (files) => files.map((f) => `"${f}"`).join(' ');

module.exports = {
  '*.{md,json}': ['prettier --cache --write'],
  '*.{css,less}': [
    'max lint --fix --stylelint-only',
    'prettier --cache --write',
  ],
  '*.ts?(x)': [
    'max lint --fix --eslint-only',
    'prettier --cache --parser=typescript --write',
  ],
  '*.{js,jsx}': (files) => {
    const src = notBuildOutput(files);
    if (src.length === 0) return [];
    return [
      `max lint --fix --eslint-only ${quote(src)}`,
      `prettier --cache --write ${quote(src)}`,
    ];
  },
};
