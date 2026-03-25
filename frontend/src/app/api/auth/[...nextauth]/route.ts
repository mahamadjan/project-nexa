import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return NextResponse.json({ error: 'Not Found' }, { status: 404 });
}

export async function POST(request: Request) {
  return NextResponse.json({ error: 'Not Found' }, { status: 404 });
}
