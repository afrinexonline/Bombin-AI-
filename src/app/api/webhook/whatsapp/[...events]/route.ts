import { NextResponse, NextRequest } from 'next/server';
import { createHash, timingSafeEqual } from 'crypto';
import { GoogleGenAI } from '@google/genai';

/*
 * Inbound WhatsApp events from Evolution API.
 *
 * Security:
 * - Every call must carry the shared secret in the "x-webhook-secret" header.
 *   It is compared with WEBHOOK_SECRET in constant time. Anything else → 401.
 * - We never log customers' phone numbers or message text, and never return
 *   raw AI error details to the caller.
 *
 * Note: sending the AI reply back to WhatsApp is not built yet (M5/M6).
 */

const SECRET_HEADER = 'x-webhook-secret';

const SYSTEM_INSTRUCTION =
  'You are the official automated AI Sales closer for Bombin AI. Keep your response brief, highly persuasive, professional, and localized for the West African market.';

/** Constant-time comparison. Hashing first makes both inputs the same length. */
function secretMatches(provided: string, expected: string): boolean {
  const a = createHash('sha256').update(provided).digest();
  const b = createHash('sha256').update(expected).digest();
  return timingSafeEqual(a, b);
}

function log(eventPath: string, status: string) {
  console.log(`[webhook/whatsapp] event=${eventPath} status=${status}`);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ events: string[] }> }
) {
  const { events } = await params;
  const eventPath = events.join('/');

  // 1. Check the shared secret before reading anything else.
  const expectedSecret = process.env.WEBHOOK_SECRET;
  if (!expectedSecret) {
    log(eventPath, 'not_configured');
    return NextResponse.json({ error: 'Webhook is not configured.' }, { status: 500 });
  }

  const providedSecret = request.headers.get(SECRET_HEADER) ?? '';
  if (!providedSecret || !secretMatches(providedSecret, expectedSecret)) {
    log(eventPath, 'unauthorized');
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  // 2. Read the payload.
  let body: any;
  try {
    body = await request.json();
  } catch {
    log(eventPath, 'bad_payload');
    return NextResponse.json({ status: 'error', error: 'Invalid payload.' }, { status: 400 });
  }

  const senderNumber: string | undefined = body?.data?.key?.remoteJid || body?.sender;
  const incomingMessage: string =
    body?.data?.message?.conversation ||
    body?.data?.message?.extendedTextMessage?.text ||
    body?.text ||
    body?.message ||
    '';
  const instanceName: string | undefined = body?.instance;

  // Status updates, contact syncs, etc. have no text: acknowledge quietly.
  if (!incomingMessage || typeof incomingMessage !== 'string') {
    log(eventPath, 'ignored_no_text');
    return NextResponse.json({ status: 'ignored', reason: 'No message content' });
  }

  // A real message must say who sent it and which instance it came from.
  if (!senderNumber || !instanceName) {
    log(eventPath, 'ignored_missing_sender_or_instance');
    return NextResponse.json({ status: 'ignored', reason: 'Missing sender or instance' });
  }

  // 3. AI reply. The model is a setting, chosen in M6.
  const model = process.env.GEMINI_MODEL?.trim();
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!model || !apiKey) {
    log(eventPath, 'ai_not_configured');
    return NextResponse.json(
      { status: 'error', error: 'AI model not configured.' },
      { status: 503 }
    );
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model,
      contents: incomingMessage,
      config: { systemInstruction: SYSTEM_INSTRUCTION },
    });

    log(eventPath, 'ai_reply_ok');
    return NextResponse.json({ status: 'success', reply: response.text });
  } catch (aiError: any) {
    // Log only a status code, never the message text or error body.
    log(eventPath, `ai_error code=${aiError?.status ?? 'unknown'}`);
    return NextResponse.json(
      { status: 'error', error: 'The AI could not reply right now.' },
      { status: 200 }
    );
  }
}
