'use client';

import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';

interface DonationData {
  donator_name: string;
  amount_raw: number;
  message: string;
}

export default function OverlayPage() {
  const [donation, setDonation] = useState<DonationData | null>(null);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe('saweria-channel');
    
    channel.bind('donation', function(data: any) {
      const donationInfo = data.data?.[0] || data; 
      setDonation(donationInfo);

      // Sembunyikan notifikasi setelah 6 detik
      setTimeout(() => {
        setDonation(null);
      }, 6000);
    });

    return () => {
      pusher.unsubscribe('saweria-channel');
    };
  }, []);

  if (!donation) return null;

  return (
    // items-start dan pt-16 akan memposisikan notifikasi di ATAS dengan sedikit jarak dari pucuk layar
    <div className="flex h-screen w-screen items-start justify-center pt-16">
      
      {/* Box Notifikasi: Dark mode, backdrop blur, border neon */}
      <div className="bg-gray-900/90 border border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.4)] p-8 rounded-2xl text-center min-w-[350px] max-w-lg animate-bounce backdrop-blur-md">
        
        {/* Nama Donatur: Teks Gradien */}
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2 uppercase tracking-wider">
          {donation.donator_name}
        </h1>
        
        {/* Nominal: Warna Hijau Neon */}
        <p className="text-2xl text-green-400 font-bold mb-4 drop-shadow-md">
          Rp {donation.amount_raw.toLocaleString('id-ID')}
        </p>
        
        {/* Pesan Donasi */}
        <p className="text-gray-200 text-lg italic font-medium">
          "{donation.message}"
        </p>
        
      </div>
    </div>
  );
}