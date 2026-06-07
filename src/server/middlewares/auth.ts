import { initDb } from '../db';
import { initModels, User } from '../models';
import type { UserRole } from '../models/User';
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

export function parseToken(token: string | undefined): AuthContext | null {
  if (!token) return null;
  const raw = token.replace(/^Bearer\s+/i, '');
  const match = /^(?:mock_token_|db_token_)(.+)$/.exec(raw);
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

export async function requireAuthUser(
  req: RequestLike,
): Promise<AuthContext | null> {
  const ctx = parseToken(getTokenFromRequest(req));
  if (!ctx) return null;

  await initDb();
  initModels();

  const user = await User.findByPk(ctx.userId, {
    attributes: ['id', 'role', 'status'],
  });
  if (!user || user.get('status') === 'banned') return null;

  return {
    userId: ctx.userId,
    role: user.get('role') as UserRole,
    token: ctx.token,
  };
}

export function canModifyOwnOrAdmin(
  authorId: string | null | undefined,
  auth: AuthContext,
): boolean {
  if (auth.role === 'admin') return true;
  return !!authorId && authorId === auth.userId;
}

export function requireAdmin(user: { role?: UserRole } | null | undefined): boolean {
  return isAdmin(user as any);
}

export function requireRole(
  ctx: AuthContext | null,
  roles: UserRole[],
): boolean {
  return !!ctx && roles.includes(ctx.role);
}
