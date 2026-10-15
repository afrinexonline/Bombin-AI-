import { NextResponse, NextRequest } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Initialize the Google Gen AI client using the environment variable
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ events: string[] }> }
) {
  const { events } = await params;
  const eventPath = events.join('/');

  console.log('=== WEBHOOK ROUTE TOUCHED SUCCESSFULLY ===');
  console.log('📡 Event Sub-Path:', eventPath);

  try {
    const body = await request.json();

    // Extract key variables from the Evolution API payload (with test fallbacks)
    const senderNumber = body?.data?.key?.remoteJid || body?.sender || '123456789@s.whatsapp.net';
    const incomingMessage = body?.data?.message?.conversation || body?.data?.message?.extendedTextMessage?.text || body?.text || body?.message || '';
    const instanceName = body?.instance || 'bombin_mock';

    // FORCE RAW TEXT LOG FIRST — always prints before any AI call
    console.log('====================================');
    console.log('🔔 INBOUND WHATSAPP PACKET');
    console.log('Event Type:', eventPath);
    console.log('Sender Number:', senderNumber);
    console.log('Incoming Text:', incomingMessage);
    console.log('Instance Name:', instanceName);
    console.log('GEMINI_API_KEY loaded:', process.env.GEMINI_API_KEY ? 'YES' : 'MISSING');
    console.log('====================================');

    // If there's no actual message text (e.g., status updates, contact syncs), acknowledge silently
    if (!incomingMessage) {
      return NextResponse.json({ status: 'ignored', reason: 'No message content' });
    }

    // === ISOLATED GEMINI AI BLOCK ===
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: incomingMessage,
        config: {
          systemInstruction: 'You are the official automated AI Sales closer for Bombin AI. Keep your response brief, highly persuasive, professional, and localized for the West African market.',
        }
      });

      console.log('--- REAL-TIME SALES CLOSER REPLY ---', response.text);
      return NextResponse.json({ status: 'success', reply: response.text });

    } catch (aiError: any) {
      // Graceful fallback: log the raw AI error but do NOT crash the server
      console.error('⚠️ GEMINI AI SHORT-CIRCUIT ERROR:', aiError?.message || aiError);
      console.error('⚠️ ERROR DETAILS:', JSON.stringify({ name: aiError?.name, status: aiError?.status, statusText: aiError?.statusText }, null, 2));
      return NextResponse.json(
        { status: 'success', error: 'AI_SHORT_CIRCUIT', detail: aiError?.message || 'Unknown AI error' },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error('Webhook Payload Parse Error:', error);
    return NextResponse.json(
      { status: 'success', error: 'PAYLOAD_PARSE_FAILURE' },
      { status: 200 }
    );
  }
}
