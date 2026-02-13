import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth';

export const POST = withAuth(async (_request, { userId }) => {
  return NextResponse.json({ userId });
});
