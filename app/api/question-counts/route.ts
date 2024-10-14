import { NextResponse } from 'next/server';
import { getQuestionCountsBySubject } from '@/app/actions/testActions';

export async function GET() {
  try {
    const questionCounts = await getQuestionCountsBySubject();
    return NextResponse.json(questionCounts);
  } catch (error) {
    console.error('Error fetching question counts:', error);
    return NextResponse.json({ error: 'Failed to fetch question counts' }, { status: 500 });
  }
}
