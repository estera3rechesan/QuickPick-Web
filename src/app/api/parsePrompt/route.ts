import { NextRequest, NextResponse } from 'next/server';
import { parseUserPrompt } from '@/utils/parseUserPrompt';

//Endpoint pentru a interpreta promptul utilizatorului
export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required and must be a string' }, { status: 400 });
    }

    const parsed = await parseUserPrompt(prompt);

    return NextResponse.json(parsed);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
