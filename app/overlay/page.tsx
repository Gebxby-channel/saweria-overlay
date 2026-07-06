'use client';

import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
// Mengambil font khusus dari Google Fonts via Next.js
import { Oswald, Share_Tech_Mono } from 'next/font/google';

// Inisialisasi Font
const oswald = Oswald({ subsets: ['latin'], weight: ['600', '700'] });
const techMono = Share_Tech_Mono({ subsets: ['latin'], weight: '400' });

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

      // Sembunyikan notifikasi setelah 7 detik agar penonton sempat baca
      setTimeout(() => {
        setDonation(null);
      }, 7000);
    });

    return () => {
      pusher.unsubscribe('saweria-channel');
    };
  }, []);

  if (!donation) return null;

  return (
    <>
      {/* CSS Custom untuk Animasi Cinematic Reveal yang lebih mulus dari bawaan Tailwind */}
      <style>{`
        @keyframes cinematic-reveal {
          0% { opacity: 0; transform: translateY(-40px) scale(0.95); filter: blur(8px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        .animate-cinematic {
          animation: cinematic-reveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div className="flex h-screen w-screen items-start justify-center pt-16">
        
        {/* Kontainer Utama: Hitam pekat transparan dengan border bawah merah tebal dan glow */}
        <div className="relative bg-black/85 border-b-4 border-red-600 shadow-[0_10px_40px_rgba(220,38,38,0.4)] p-8 rounded-sm min-w-[400px] max-w-2xl animate-cinematic overflow-hidden">
          
          {/* Efek Garis Dekoratif di Kiri (Gaya UI Game) */}
          <div className="absolute left-0 top-0 h-full w-1 bg-red-600/50"></div>

          <div className="flex flex-col items-center">
            
            {/* Nama Donatur - Menggunakan Oswald (Tinggi, Tegas, Cinematic) */}
            <h1 className={`${oswald.className} text-4xl text-white tracking-widest uppercase mb-1 drop-shadow-lg`}>
              {donation.donator_name}
            </h1>
            
            {/* Nominal - Warna Merah Terang agar mencolok */}
            <div className={`${oswald.className} text-3xl text-red-500 font-bold mb-5 tracking-wide drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]`}>
              IDR {donation.amount_raw.toLocaleString('id-ID')}
            </div>
            
            {/* Pesan Donasi - Menggunakan Share Tech Mono (Gaya Mesin Tik/Laporan Sistem) */}
            <div className={`${techMono.className} text-gray-300 text-lg text-center px-4 leading-relaxed bg-white/5 p-3 border border-white/10 w-full`}>
              {">"} {donation.message}
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
}