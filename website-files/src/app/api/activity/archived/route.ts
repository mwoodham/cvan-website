import { NextRequest, NextResponse } from 'next/server';
import { getArchivedActivity } from '@/lib/directus';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get('limit') || '9', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);

  const activities = await getArchivedActivity(limit, offset);

  return NextResponse.json({ activities });
}
