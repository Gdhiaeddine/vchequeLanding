import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'vcheque-super-secret-key-fallback-32-bytes-minimum!'
);

const COOKIE_NAME = 'vcheque_admin_session';

export interface SessionPayload {
  userId: number;
  email: string;
  name: string;
  is2faVerified: boolean;
}

export async function createSession(payload: SessionPayload, remember = false): Promise<string> {
  const expiresIn = remember ? '30d' : '8h';
  const maxAge = remember ? 30 * 24 * 60 * 60 : 8 * 60 * 60;

  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(SECRET_KEY);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  });

  return token;
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return {
      userId: payload.userId as number,
      email: payload.email as string,
      name: payload.name as string,
      is2faVerified: payload.is2faVerified as boolean,
    };
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function verifyTokenString(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return {
      userId: payload.userId as number,
      email: payload.email as string,
      name: payload.name as string,
      is2faVerified: payload.is2faVerified as boolean,
    };
  } catch {
    return null;
  }
}
