'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
// 🚀 LETA UNGANISHO LA FIREBASE ULILOLITENGENEZA
import { database } from '@/firebase'; 
import { ref, get, update } from 'firebase/database';
import QRCode from 'qrcode';

interface GuestData {
  id: string;
  name: string;
  table_number: string;
  status: string;
  source: 'supabase' | 'firebase'; // Tunatunza huyu mgeni ametoka wapi
  events?: {
    title: string;
    date: string;
    location: string;
    time?: string;
  };
}

export default function InvitationPage() {
  const params = useParams();
  const id = params?.id as string;

  const [guest, setGuest] = useState<GuestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [rsvpStatus, setRsvpStatus] = useState<string | null>(null);
  const [qrImageUrl, setQrImageUrl] = useState<string>('');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  useEffect(() => {
    const setupData = async () => {
      if (!id || id === '[id]') {
        setLoading(false);
        return;
      }

      // Angalia kama ID ni UUID (Supabase) au ya kawaida (Firebase)
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

      try {
        if (isUuid) {
          // ==========================================
          // 1. KAMA NI ID YA SUPABASE VUTA DATA HAPA
          // ==========================================
          const { data: guestData, error: guestError } = await supabase
            .from('guests')
            .select('id, name, table_number, status, event_id')
            .eq('id', id)
            .maybeSingle();

          if (guestError) throw guestError;

          if (guestData) {
            setRsvpStatus(guestData.status);

            let eventDetails = {
              title: 'SHEREHE YA SHEREHEHUB',
              date: 'Itapangwa',
              location: 'Ukumbi Utathibitishwa',
              time: 'Saa 12:00 Jioni'
            };

            if (guestData.event_id) {
              const { data: eventData, error: eventError } = await supabase
                .from('events')
                .select('title, date, location')
                .eq('id', guestData.event_id)
                .maybeSingle();

              if (!eventError && eventData) {
                eventDetails = {
                  title: eventData.title || 'SHEREHE MAALUM',
                  date: eventData.date || 'Itapangwa',
                  location: eventData.location || 'Ukumbi Utathibitishwa',
                  time: 'Saa 12:00 Jioni'
                };
              }
            }

            setGuest({
              id: guestData.id,
              name: guestData.name,
              table_number: guestData.table_number || 'Haikupangwa',
              status: guestData.status || 'Haujatumwa',
              source: 'supabase',
              events: eventDetails
            });
          }
        } else {
          // ==========================================
          // 2. KAMA SIO UUID (NI ID YA FIREBASE YA SIMU) VUTA DATA HAPA
          // ==========================================
          const mgeniRef = ref(database, `wageni/${id}`);
          const snapshot = await get(mgeniRef);

          if (snapshot.exists()) {
            const firebaseGuest = snapshot.val();
            
            // Hapa tunatafuta jina la sherehe kule Firebase kwa kutumia shereheId yake
            let jinaLaSherehe = "SHEREHE YA SHEREHEHUB";
            if (firebaseGuest.shereheId) {
              const shereheSnapshot = await get(ref(database, `sherehe/${firebaseGuest.shereheId}`));
              if (shereheSnapshot.exists()) {
                jinaLaSherehe = shereheSnapshot.val().jinaLaSherehe || "SHEREHE YA SHEREHEHUB";
              }
            }

            // Kubadilisha majina ya hadhi ya Firebase yaende sawa na ya Next.js web
            let webStatus = 'Haujatumwa';
            if (firebaseGuest.hadhiYaMwaliko === 'Nitahudhulia') webStatus = 'Attending';
            if (firebaseGuest.hadhiYaMwaliko === 'Sitahudhulia') webStatus = 'Not Attending';

            setRsvpStatus(webStatus);

            setGuest({
              id: id,
              name: firebaseGuest.jinaLaMgeni || 'Mgeni Maalum',
              table_number: firebaseGuest.nambaYaKiti || 'Haikupangwa',
              status: webStatus,
              source: 'firebase',
              events: {
                title: jinaLaSherehe.toUpperCase(),
                date: 'Angalia Kadi',
                location: 'Ukumbi Maalum',
                time: 'Saa 12:00 Jioni'
              }
            });
          }
        }
      } catch (err) {
        console.error("Hitilafu ya Mfumo:", err);
      } finally {
        setLoading(false);
      }
    };

    setupData();
  }, [id]);

  // TUNATENGENEZA QR CODE BAADA YA DATA KUPATIKANA
  useEffect(() => {
    if (guest?.id) {
      const generateQR = async () => {
        const domainUrl = typeof window !== 'undefined' ? window.location.origin : '';
        const fullUrl = `${domainUrl}/invitation/${guest.id}`;
        const qr = await QRCode.toDataURL(fullUrl, { width: 250, margin: 1 });
        setQrImageUrl(qr);
      };
      generateQR();
    }
  }, [guest]);

  const handleRSVP = async (status: 'Attending' | 'Not Attending') => {
    if (!guest?.id) return;

    try {
      if (guest.source === 'supabase') {
        // Update Supabase
        const { error } = await supabase.from('guests').update({ status }).eq('id', guest.id);
        if (error) throw error;
      } else {
        // Update Firebase (Tunatafsiri hadhi kurudi kwenye Kiswahili cha App)
        const hadhiKiswa = status === 'Attending' ? 'Nitahudhulia' : 'Sitahudhulia';
        const mgeniRef = ref(database, `wageni/${guest.id}`);
        await update(mgeniRef, { hadhiYaMwaliko: hadhiKiswa });
      }

      setRsvpStatus(status);
      
      if (status === 'Attending') {
        setAlertMessage('🎉 Shukrani! Nafasi yako imehifadhiwa. Tunakusubiri kwa hamu!');
      } else {
        setAlertMessage('✉️ Ujumbe umepokelewa. Tutaukumbuka uwepo wako kwenye sherehe hii.');
      }
    } catch (err) {
      console.error(err);
      setAlertMessage('❌ Imeshindwa kuhifadhi. Tafadhali jaribu tena.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1d] text-white flex items-center justify-center text-xs tracking-widest animate-pulse">
        INAPAKIA MWALIKO WAKO...
      </div>
    );
  }

  if (!guest) {
    return (
      <div className="min-h-screen bg-[#0a0f1d] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="text-amber-500 text-4xl mb-2">⚠️</div>
        <p className="text-amber-500 mb-4 text-lg font-bold">ID ya Mwaliko haijatambuliwa.</p>
        <p className="text-gray-400 text-sm max-w-sm">
          Tafadhali tumia link sahihi iliyo kwenye Database au App ya simu.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-950 text-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-[360px] bg-[#0c1322] px-6 py-8 rounded-2xl shadow-2xl border border-gray-800/80 space-y-6 text-center">
        
        {/* JINA LA SHEREHE */}
        <div className="space-y-1">
          <div className="text-amber-500 text-xs tracking-widest">✨ ✉️ ✨</div>
          <h1 className="text-base font-black tracking-wide text-gray-100 uppercase mt-1">
            {guest.events?.title}
          </h1>
        </div>

        {/* MWALIKWA */}
        <div className="space-y-1 py-1 border-y border-gray-800/40">
          <p className="text-[11px] text-gray-400 font-medium">Tunaheshimika Kumwalika:</p>
          <p className="text-base font-extrabold text-yellow-500 tracking-wide uppercase">
            {guest.name}
          </p>
        </div>

        {/* QR CODE */}
        <div className="flex flex-col items-center justify-center bg-white p-3 rounded-xl shadow-inner max-w-[140px] mx-auto border border-amber-500/20">
          {qrImageUrl && <img src={qrImageUrl} alt="QR Code" className="w-[110px] h-[110px]" />}
          <p className="text-[8px] text-gray-500 font-bold uppercase tracking-wider mt-1.5">Scan Pass Mlangoni</p>
        </div>

        {/* TAARIFA ZA TUKIO */}
        <div className="bg-[#141d30] border border-gray-800 rounded-xl p-4 text-left space-y-3">
          <div className="flex items-center gap-2.5 text-xs">
            <span>📅</span>
            <div>
              <p className="text-[10px] text-gray-400">Tarehe ya Sherehe:</p>
              <p className="text-gray-200">{guest.events?.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-xs">
            <span>🕒</span>
            <div>
              <p className="text-[10px] text-gray-400">Muda / Saa:</p>
              <p className="text-gray-200">{guest.events?.time}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-xs">
            <span>📍</span>
            <div>
              <p className="text-[10px] text-gray-400">Mahali / Ukumbi:</p>
              <p className="text-gray-200 font-medium text-amber-500">{guest.events?.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-xs pt-2 border-t border-gray-800/60">
            <span>🍽️</span>
            <div>
              <p className="text-[10px] text-amber-500 font-bold">MEZA YAKO:</p>
              <p className="text-xs font-black text-amber-400 uppercase">{guest.table_number}</p>
            </div>
          </div>
        </div>

        {/* VITUFE VYA RSVP */}
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => handleRSVP('Attending')} 
            className={`py-2.5 rounded-xl text-xs font-bold transition duration-300 ${rsvpStatus === 'Attending' ? 'bg-green-600 text-white shadow-lg shadow-green-900/40' : 'bg-[#141d30] border border-gray-800 text-gray-300 hover:bg-gray-800'}`}
          >
            {rsvpStatus === 'Attending' ? '✓ Nitafika' : 'Nitafika'}
          </button>
          <button 
            onClick={() => handleRSVP('Not Attending')} 
            className={`py-2.5 rounded-xl text-xs font-bold transition duration-300 ${rsvpStatus === 'Not Attending' ? 'bg-red-600 text-white shadow-lg shadow-red-900/40' : 'bg-[#141d30] border border-gray-800 text-gray-300 hover:bg-gray-800'}`}
          >
            {rsvpStatus === 'Not Attending' ? '✕ Sitafika' : 'Sitafika'}
          </button>
        </div>

        {alertMessage && (
          <div className={`text-[11px] p-3 rounded-xl border animate-fadeIn transition duration-500 ${
            rsvpStatus === 'Attending' 
              ? 'bg-green-950/30 border-green-500/30 text-green-400' 
              : 'bg-red-950/30 border-red-500/30 text-red-400'
          }`}>
            {alertMessage}
          </div>
        )}

      </div>
    </div>
  );
}