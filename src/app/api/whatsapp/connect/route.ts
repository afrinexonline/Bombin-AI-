import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseAnonKey } from '../../../lib/supabaseClient';

/*
 * Creates a WhatsApp (Evolution API) instance for the signed-in merchant.
 *
 * Security:
 * - Only a logged-in Supabase user may call this. The browser must send the
 *   user's access token as "Authorization: Bearer <token>"; the server asks
 *   Supabase to confirm it before doing anything.
 * - Evolution API address, key and token come from environment variables only.
 */

async function getSignedInUserId(request: NextRequest): Promise<string | null> {
  const header = request.headers.get('authorization') ?? '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await client.auth.getUser(match[1].trim());
  if (error || !data?.user) return null;
  return data.user.id;
}

export async function POST(request: NextRequest) {
  // 1. Server settings must exist before we do anything else.
  const evolutionUrl = process.env.EVOLUTION_API_URL?.trim().replace(/\/$/, '');
  const evolutionKey = process.env.EVOLUTION_API_KEY?.trim();
  const instanceToken = process.env.EVOLUTION_INSTANCE_TOKEN?.trim();

  if (!evolutionUrl || !evolutionKey || !instanceToken) {
    console.error('[whatsapp/connect] status=not_configured (Evolution API settings missing)');
    return NextResponse.json(
      { error: 'WhatsApp connection is not configured on the server.' },
      { status: 500 }
    );
  }

  // 2. Only signed-in users.
  let userId: string | null = null;
  try {
    userId = await getSignedInUserId(request);
  } catch {
    userId = null;
  }
  if (!userId) {
    console.warn('[whatsapp/connect] status=unauthorized');
    return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  }

  // 3. Ask Evolution API for a new instance + QR code.
  try {
    const response = await fetch(`${evolutionUrl}/instance/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: evolutionKey,
      },
      body: JSON.stringify({
        instanceName: `Bombin_Vendor_${Date.now()}`,
        token: instanceToken,
        qrcode: true,
        integration: 'WHATSAPP-BAILEYS',
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.error(`[whatsapp/connect] status=upstream_error code=${response.status}`);
      return NextResponse.json(
        { error: 'Could not start the WhatsApp connection. Please try again.' },
        { status: 502 }
      );
    }

    const qrCodeString = data?.qrcode?.base64 ?? data?.base64;
    if (qrCodeString) {
      console.log('[whatsapp/connect] status=ok');
      return NextResponse.json({ qrCodeString });
    }

    console.error('[whatsapp/connect] status=no_qr_code');
    return NextResponse.json(
      { error: 'Could not get a QR code. Please try again.' },
      { status: 502 }
    );
  } catch {
    console.error('[whatsapp/connect] status=network_error');
    return NextResponse.json(
      { error: 'Could not reach the WhatsApp service. Please try again.' },
      { status: 500 }
    );
  }
}
