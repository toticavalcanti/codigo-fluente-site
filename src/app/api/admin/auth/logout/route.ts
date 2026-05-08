import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
  
  // Clear the cookie
  response.cookies.set('cf-admin-token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });

  return response;
}
