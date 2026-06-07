export function formatRelativeTime(date: Date | string | null | undefined): string {
  if (!date) return 'Mới';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return 'Mới';

  const diffMs = Date.now() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Vừa xong';
  if (diffMins < 60) return `${diffMins} phút trước`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays} ngày trước`;

  return d.toLocaleDateString('vi-VN');
}
