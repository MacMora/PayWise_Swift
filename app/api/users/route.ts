import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'data', 'users.json');
  const file = await fs.readFile(filePath, 'utf-8');
  const users = JSON.parse(file);
  return NextResponse.json(users);
}
