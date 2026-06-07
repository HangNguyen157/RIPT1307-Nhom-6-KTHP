module.exports = {
  extends: require.resolve('@umijs/max/eslint'),
  // Thư mục api/ ở gốc là output build của apiRoute (code compile) — không lint
  ignorePatterns: ['api/**'],
};
