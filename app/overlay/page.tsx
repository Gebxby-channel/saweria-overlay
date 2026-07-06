'use client';

import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
//tes
// Tipe data sederhana untuk donasi
interface DonationData {
  donator_name: string;
  amount_raw: number;
  message: string;
}

export default function OverlayPage() {
  const [donation, setDonation] = useState<DonationData | null>(null);

  useEffect(() => {
    // Inisialisasi Pusher Client
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    // Berlangganan ke channel yang sama dengan backend
    const channel = pusher.subscribe('saweria-channel');
    
    // Dengarkan event 'donation'
    channel.bind('donation', function(data: any) {
      console.log('Donasi masuk:', data);
      // Saweria biasanya mengirim array di dalam object, kita ambil data pertama
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

  if (!donation) return null; // Layar kosong/transparan jika tidak ada donasi

  return (
    <div className="flex h-screen w-screen items-end justify-center pb-10">
      {/* Container Notifikasi (Silakan styling sesuka hati) */}
      <div className="bg-white/90 p-6 rounded-2xl shadow-xl text-center max-w-md animate-bounce">
        <h1 className="text-2xl font-bold text-gray-800">
          🎉 {donation.donator_name} 🎉
        </h1>
        <p className="text-xl text-green-600 font-semibold my-2">
          Rp {donation.amount_raw.toLocaleString('id-ID')}
        </p>
        <p className="text-gray-700 italic">"{donation.message}"</p>
        
        {/* Opsional: Tambahkan tag audio di sini jika ada suara khusus */}
      </div>
    </div>
  );
}