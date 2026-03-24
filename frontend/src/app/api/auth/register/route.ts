import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!email || !name || !password) {
      return NextResponse.json({ error: 'Заполните все поля' }, { status: 400 });
    }

    // NO BACKEND: Instantly return a success response to allow frontend-only registration
    const mockUser = {
      id: 'local-user-' + Date.now(),
      name,
      email,
      role: 'USER'
    };

    return NextResponse.json({ user: mockUser }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}
