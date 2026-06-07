import { UserEntity } from '../models/entities';
import type { User, UserRole } from '../models/User';
import { isAdmin } from '../models/User';
import { verifyToken } from '../services/authService';

const AUTH_HEADER = 'authorization';

type RequestLike = {
  headers: Record<string, string | string[] | undefined>;
};

export interface AuthContext {
  userId: string;
  role: UserRole;
  token: string;
}

/**
 * Giải mã JWT thật (do authService.createToken phát hành) và tra DB
 * để lấy role/status thực của user — không hardcode role.
 */
export async function parseToken(
  token: string | undefined,
): Promise<AuthContext | null> {
  if (!token) return null;
  const raw = token.replace(/^Bearer\s+/i, '');

  const decoded = verifyToken(raw);
  if (!decoded?.userId) return null;

  const user = await UserEntity.findByPk(decoded.userId, {
    attributes: ['id', 'role', 'status'],
  });
  if (!user || user.status === 'banned') return null;

  return { userId: user.id, role: user.role, token: raw };
}

export function getTokenFromRequest(req: RequestLike): string | undefined {
  const header = req.headers[AUTH_HEADER];
  if (typeof header === 'string') return header;
  return undefined;
}

export async function requireAuth(
  req: RequestLike,
): Promise<AuthContext | null> {
  return parseToken(getTokenFromRequest(req));
}

/** Trả về AuthContext nếu request là của admin hợp lệ, ngược lại null. */
export async function requireAdminAuth(
  req: RequestLike,
): Promise<AuthContext | null> {
  const ctx = await requireAuth(req);
  if (!ctx || ctx.role !== 'admin') return null;
  return ctx;
}

export function requireAdmin(
  user: Pick<User, 'role'> | null | undefined,
): boolean {
  return isAdmin(user);
}

export function requireRole(
  ctx: AuthContext | null,
  roles: UserRole[],
): boolean {
  return !!ctx && roles.includes(ctx.role);
}
