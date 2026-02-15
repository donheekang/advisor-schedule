import { NextRequest, NextResponse } from 'next/server';

type FirebaseTokenPayload = {
  user_id?: string;
  sub?: string;
};

function decodeJwtPayload(token: string): FirebaseTokenPayload {
  const payloadPart = token.split('.')[1];

  if (!payloadPart) {
    throw new Error('Unauthorized');
  }

  const normalized = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  const jsonPayload = Buffer.from(padded, 'base64').toString('utf-8');

  return JSON.parse(jsonPayload) as FirebaseTokenPayload;
}

export async function verifyBearerToken(authorizationHeader?: string): Promise<{ uid: string }> {
  const [scheme, token] = authorizationHeader?.split(' ') ?? [];

  if (scheme !== 'Bearer' || !token) {
    throw new Error('Unauthorized');
  }

  const payload = decodeJwtPayload(token);
  const uid = payload.user_id ?? payload.sub;

  if (!uid) {
    throw new Error('Unauthorized');
  }

  return { uid };
}

type AuthenticatedHandler = (
  request: NextRequest,
  authContext: { userId: string }
) => Promise<Response> | Response;

export function withAuth(handler: AuthenticatedHandler) {
  return async function authenticatedRoute(request: NextRequest): Promise<Response> {
    const authorizationHeader = request.headers.get('authorization') ?? undefined;

    try {
      const decodedToken = await verifyBearerToken(authorizationHeader);
      return handler(request, { userId: decodedToken.uid });
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  };
}
