import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = await fetch('http://127.0.0.1:8080/instance/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'bombin_secret_key_2026',
      },
      body: JSON.stringify({
        instanceName: `Bombin_Vendor_${Date.now()}`,
        token: 'bombin_token_12345',
        qrcode: true,
        integration: 'WHATSAPP-BAILEYS',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.log('Evolution API Error Response:', data);
      console.log('Status code:', response.status);
      // If the Evolution API returns an error
      return NextResponse.json(
        { error: data?.response?.message || data?.message || 'Failed to connect to Evolution API' },
        { status: response.status }
      );
    }

    // Check if the QR code base64 string is present in the response
    if (data.qrcode && data.qrcode.base64) {
      return NextResponse.json({ qrCodeString: data.qrcode.base64 });
    } else if (data.base64) {
      // Some versions of the API might return the base64 directly or inside a different key
      return NextResponse.json({ qrCodeString: data.base64 });
    } else {
      console.log('Evolution API Success but no QR code found:', data);
      return NextResponse.json(
        { error: 'QR Code not found in the Evolution API response' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.log(error); // As requested by the user
    console.error('Evolution API Connection Error:', error);
    return NextResponse.json(
      { error: 'Internal server error while connecting to WhatsApp' },
      { status: 500 }
    );
  }
}
