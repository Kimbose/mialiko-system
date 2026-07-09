'use client';
import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { supabase } from '@/lib/supabase';

export default function Scanner() {
  const [msg, setMsg] = useState('Subiri kuscan...');

  useEffect(() => {
    // Tunaanzisha scanner kwenye div yenye id "reader"
    const scanner = new Html5QrcodeScanner('reader', { 
      fps: 10, 
      qrbox: { width: 250, height: 250 } 
    }, false);

    scanner.render(async (decodedText) => {
      // decodedText ni ile ID ya mgeni iliyopo kwenye QR Code
      scanner.clear(); // Zima kamera baada ya kuscan
      setMsg('Inakagua...');

      // Update status ya mgeni kwenye Supabase
      const { error } = await supabase
        .from('guests')
        .update({ status: 'Checked-In' })
        .eq('id', decodedText);

      if (error) {
        setMsg('❌ Imeshindikana: ' + error.message);
      } else {
        setMsg('✅ Mgeni amethibitishwa! Karibu ndani.');
        // Unaweza kuongeza sound ya "beep" hapa
      }
    }, (err) => console.log(err));
  }, []);

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white text-center">
      <h1 className="text-2xl font-bold mb-6">Scanner ya Mlangoni</h1>
      {/* Hapa ndipo kamera itaonyeshwa */}
      <div id="reader" className="w-full max-w-sm mx-auto"></div>
      <p className="mt-10 text-xl font-bold text-yellow-500">{msg}</p>
    </div>
  );
}