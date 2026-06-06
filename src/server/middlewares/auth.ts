import type { User, UserRole } from '../models/User';
import { isAdmin } from '../models/User';

const AUTH_HEADER = 'authorization';

type RequestLike = {
  headers: Record<string, string | string[] | undefined>;
};

export interface AuthContext {
  userId: string;
  role: UserRole;
  token: string;
}

/** Giải mã JWT mock — @todo thay bằng jsonwebtoken.verify khi có secret */
export function parseToken(token: string | undefined): AuthContext | null {
  if (!token) return null;
  const raw = token.replace(/^Bearer\s+/i, '');
  const match = /^mock_token_(.+)$/.exec(raw);
  if (!match) return null;
  return { userId: match[1], role: 'student', token: raw };
}

export function getTokenFromRequest(req: RequestLike): string | undefined {
  const header = req.headers[AUTH_HEADER];
  if (typeof header === 'string') return header;
  return undefined;
}

export function requireAuth(req: RequestLike): AuthContext | null {
  return parseToken(getTokenFromRequest(req));
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
