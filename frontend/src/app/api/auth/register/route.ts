import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!email || !name || !password) {
      return NextResponse.json({ error: 'Заполните все поля' }, { status: 400 });
    }

    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.error || 'Ошибка при регистрации' }, { status: res.status });
    }

    return NextResponse.json({ user: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Сервер недоступен. Убедитесь, что бэкенд запущен.' }, { status: 500 });
  }
}
