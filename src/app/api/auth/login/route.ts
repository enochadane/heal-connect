import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin, signSessionToken, setAdminSessionCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const sessionUser = await authenticateAdmin(email, password);

    if (!sessionUser) {
      return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
    }

    const token = signSessionToken({
      userId: sessionUser.userId,
      email: sessionUser.email,
      name: sessionUser.name,
      role: sessionUser.role,
    });

    await setAdminSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        email: sessionUser.email,
        name: sessionUser.name,
        role: sessionUser.role,
      },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
