import { promises as fs } from 'node:fs';
import path from 'node:path';

import { NextResponse } from 'next/server';

type WaitlistEntry = {
  email: string;
  createdAt: string;
};

type WaitlistPayload = {
  entries: WaitlistEntry[];
};

const WAITLIST_FILE_PATH = path.join(process.cwd(), 'data', 'premium-waitlist.json');

export const runtime = 'nodejs';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function readWaitlist(): Promise<WaitlistPayload> {
  try {
    const fileData = await fs.readFile(WAITLIST_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(fileData) as WaitlistPayload;

    if (!Array.isArray(parsed.entries)) {
      return { entries: [] };
    }

    return parsed;
  } catch {
    return { entries: [] };
  }
}

async function writeWaitlist(payload: WaitlistPayload): Promise<void> {
  await fs.mkdir(path.dirname(WAITLIST_FILE_PATH), { recursive: true });
  await fs.writeFile(WAITLIST_FILE_PATH, JSON.stringify(payload, null, 2), 'utf-8');
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: string } | null;
  const normalizedEmail = body?.email?.trim().toLowerCase() ?? '';

  if (!isValidEmail(normalizedEmail)) {
    return NextResponse.json({ error: '올바른 이메일 주소를 입력해 주세요.' }, { status: 400 });
  }

  const waitlist = await readWaitlist();
  const alreadyRegistered = waitlist.entries.some((entry) => entry.email === normalizedEmail);

  if (!alreadyRegistered) {
    waitlist.entries.push({
      email: normalizedEmail,
      createdAt: new Date().toISOString()
    });

    await writeWaitlist(waitlist);
  }

  return NextResponse.json({ message: '대기 목록에 등록되었어요. 오픈 시 가장 먼저 알려드릴게요!' });
}
