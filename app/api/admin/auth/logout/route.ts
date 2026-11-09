import { NextResponse } from 'next/server';
import { destroySession } from '@/lib/auth/session';

export async function POST() {
  await destroySession();
  return NextResponse.json({ success: true, redirect: '/admin/login' });
}

export async function GET(request: Request) {
  await destroySession();
  const url = new URL('/admin/login', request.url);
  return NextResponse.redirect(url);
}
