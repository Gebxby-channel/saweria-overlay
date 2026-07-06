import { NextResponse } from 'next/server';
import Pusher from 'pusher';
//tes 
// Inisialisasi Pusher Server
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export async function POST(request: Request) {
  try {
    // Ambil data JSON yang dikirim Saweria
    const body = await request.json();

    // Tembak data tersebut ke channel Pusher
    // Channel: 'saweria-channel', Event: 'donation'
    await pusher.trigger('saweria-channel', 'donation', body);

    return NextResponse.json({ message: 'Webhook received & forwarded' }, { status: 200 });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}