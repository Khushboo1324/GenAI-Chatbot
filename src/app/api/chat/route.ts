import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { personas } from '@/config/personas';

export async function POST(req: NextRequest) {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || '',
    });

    const { messages, personaId } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    if (!personaId) {
      return NextResponse.json({ error: 'Persona ID is required' }, { status: 400 });
    }

    const persona = personas.find((p) => p.id === personaId);
    if (!persona) {
      return NextResponse.json({ error: 'Invalid persona ID' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    // Convert OpenAI style messages to Gemini format
    const formattedContents = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-preview',
      contents: formattedContents,
      config: {
        systemInstruction: persona.systemPrompt,
        temperature: 0.7,
      }
    });

    const reply = response.text || 'No response';

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to communicate with Gemini' },
      { status: 500 }
    );
  }
}
