'use client';



import { useState, useEffect } from 'react';

import { supabase } from '@/lib/supabase';



interface Guest {

  id: string;

  name: string;

  phone: string;

  status: string;

}



interface Event {

  id: string;

  title: string;

}



export default function Dashboard() {

  const [events, setEvents] = useState<Event[]>([]); // Sehemu ya kuhifadhi sherehe zote

  const [selectedEventId, setSelectedEventId] = useState('');

  const [guests, setGuests] = useState<Guest[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');



  // 1. VUTA SHEREHE ZOTE KUTOKA DATABASE UKURASA UNAPOFUNGUKA

  useEffect(() => {

    const fetchEvents = async () => {

      const { data, error } = await supabase

        .from('events')

        .select('id, title');

     

      if (!error && data) {

        setEvents(data);

      }

    };

    fetchEvents();

  }, []);



  // 2. VUTA WAGENI KIOTOMATIKI PALE MTEJA ANAPOCHAGUA SHEREHE

  const handleEventChange = async (eventId: string) => {

    setSelectedEventId(eventId);

    if (!eventId) {

      setGuests([]);

      return;

    }



    loadingTrue();

    setError('');



    const { data, error } = await supabase

      .from('guests')

      .select('id, name, phone, status')

      .eq('event_id', eventId);



    setLoading(false);



    if (error) {

      setError(`Imeshindikana kuvuta wageni: ${error.message}`);

    } else {

      setGuests(data || []);

    }

  };



  const loadingTrue = () => {

    setLoading(true);

  };



  // MTAMBO WA KUPIGA HESABU ZA RIPOTI

  const totalGuests = guests.length;

  const attendingCount = guests.filter(g => g.status === 'Attending').length;

  const declinedCount = guests.filter(g => g.status === 'Declined').length;

  const checkedInCount = guests.filter(g => g.status === 'Checked-In').length;

 

  // Hesabu sahihi ya wageni ambao hawajajibu bado

  const pendingCount = guests.filter(g => g.status !== 'Attending' && g.status !== 'Declined' && g.status !== 'Checked-In').length;



  // UTATUZI WA NAMBA ZA SIMU: Format namba ianze vizuri

  const formatPhoneNumber = (phone: string) => {

    let formatted = phone.trim();

    if (formatted.startsWith('0')) {

      formatted = '255' + formatted.substring(1);

    } else if (formatted.startsWith('+')) {

      formatted = formatted.replace('+', '');

    }

    return formatted;

  };



  // MTAMBO WA KUTUMA MWALIKO WHATSAPP

  const sendWhatsAppMessage = (guest: Guest) => {

    const invitationLink = `http://127.0.0.1:3000/invitation/${guest.id}`;

    const message = `Habari ${guest.name},\n\nTunaheshimika kukualika rasmi kwenye sherehe yetu. Tafadhali fungua link hii hapa chini ili kuona kadi yako ya kidijitali na uthibitishe kama utahudhuria:\n\n👉 ${invitationLink}\n\n*Kumbuka:* Kadi yako ina QR Code itakayoskaniwa mlangoni (Gate Pass). Karibu sana!`;



    const formattedPhone = formatPhoneNumber(guest.phone);

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');

  };



  // 🚀 MTAMBO MPYA: WA KUTUMA NORMAL SMS (TEXT MESSAGE)

  const sendNormalSMS = (guest: Guest) => {

    const invitationLink = `http://127.0.0.1:3000/invitation/${guest.id}`;

    // SMS za kawaida hazina bold (*) au line breaks kubwa sana kwenye baadhi ya simu, hivyo ujumbe umerahisishwa uwe salama

    const message = `Habari ${guest.name}, Tunaheshimika kukualika rasmi kwenye sherehe yetu. Fungua link hii kuona kadi yako na uthibitishe mahudhurio: ${invitationLink} (Kadi yako ina QR Code ya Gate Pass)`;



    const rawPhone = guest.phone.trim();

    // Kwenye baadhi ya mifumo ya SMS ya simu, namba ya kawaida (mfano: 07xxxxxxxx au +255...) inakubali zaidi kuliko kuanza na 255 bila alama

    const smsPhone = rawPhone.startsWith('0') ? `+255${rawPhone.substring(1)}` : rawPhone;



    // Utatuzi wa iOS (iPhone) vs Android/Windows kwenye ufunguaji wa programu ya SMS

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    const smsUrl = `sms:${smsPhone}${isIOS ? '&' : '?'}body=${encodeURIComponent(message)}`;

   

    window.open(smsUrl, '_blank');

  };



  return (

    <div className="min-h-screen bg-gray-900 text-white p-8">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold text-yellow-500 mb-8 text-center">

          Dashibodi ya Wasimamizi & Wateja

        </h1>



        {/* SEHEMU YA DROPDOWN: Chagua sherehe badala ya ku-copy ID */}

        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 mb-8">

          <div>

            <label className="block text-sm font-medium mb-2 text-yellow-500">Chagua Sherehe Unayotaka Kuikagua:</label>

            <select

              value={selectedEventId}

              onChange={(e) => handleEventChange(e.target.value)}

              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-yellow-500 cursor-pointer text-sm font-medium"

            >

              <option value="">-- Bonyeza Hapa Kuchagua Sherehe --</option>

              {events.map((event) => (

                <option key={event.id} value={event.id}>

                  {event.title}

                </option>

              ))}

            </select>

          </div>

        </div>



        {loading && <p className="text-yellow-500 text-center mb-4 animate-pulse">Inafungua orodha ya wageni...</p>}

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}



        {/* Card za Takwimu */}

        {guests.length > 0 && (

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">

            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 text-center">

              <p className="text-xs text-gray-400 uppercase font-bold">Waalikwa</p>

              <p className="text-2xl font-extrabold text-blue-400 mt-1">{totalGuests}</p>

            </div>

            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 text-center">

              <p className="text-xs text-gray-400 uppercase font-bold">Watahudhuria</p>

              <p className="text-2xl font-extrabold text-green-400 mt-1">{attendingCount}</p>

            </div>

            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 text-center">

              <p className="text-xs text-gray-400 uppercase font-bold">Mlangoni</p>

              <p className="text-2xl font-extrabold text-purple-400 mt-1">{checkedInCount}</p>

            </div>

            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 text-center">

              <p className="text-xs text-gray-400 uppercase font-bold">Hawaji</p>

              <p className="text-2xl font-extrabold text-red-400 mt-1">{declinedCount}</p>

            </div>

            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 text-center">

              <p className="text-xs text-gray-400 uppercase font-bold">Hawajajibu</p>

              <p className="text-2xl font-extrabold text-yellow-500 mt-1">{pendingCount}</p>

            </div>

          </div>

        )}



        {/* Jedwali la Wageni */}

        {selectedEventId && !loading && (

          <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 overflow-hidden">

            <table className="w-full text-left border-collapse">

              <thead>

                <tr className="bg-gray-700 text-yellow-500 uppercase text-xs tracking-wider">

                  <th className="p-4">Jina la Mgeni</th>

                  <th className="p-4">Namba ya Simu</th>

                  <th className="p-4 text-center">Hali ya RSVP</th>

                  <th className="p-4 text-center">Tuma Mwaliko Kwa:</th>

                </tr>

              </thead>

              <tbody className="divide-y divide-gray-700">

                {guests.length === 0 ? (

                  <tr>

                    <td colSpan={4} className="p-8 text-center text-gray-400">

                      Hakuna wageni waliosajiliwa kwenye sherehe hii bado.

                    </td>

                  </tr>

                ) : (

                  guests.map((guest) => (

                    <tr key={guest.id} className="hover:bg-gray-700/50 transition">

                      <td className="p-4 font-medium">{guest.name}</td>

                      <td className="p-4 text-gray-300">{guest.phone}</td>

                      <td className="p-4 text-center">

                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${

                          guest.status === 'Attending'

                            ? 'bg-green-950 text-green-400 border border-green-800'

                            : guest.status === 'Checked-In'

                            ? 'bg-purple-950 text-purple-400 border border-purple-800'

                            : guest.status === 'Declined'

                            ? 'bg-red-950 text-red-400 border border-red-800'

                            : 'bg-yellow-950 text-yellow-400 border border-yellow-800'

                        }`}>

                          {guest.status === 'Attending'

                            ? 'Anahudhuria'

                            : guest.status === 'Checked-In'

                            ? 'Tayari Keshapo mlangoni'

                            : guest.status === 'Declined'

                            ? 'Hawaji'

                            : 'Kipindi cha Kusubiri'}

                        </span>

                      </td>

                      {/* 🚀 VITUFE VIWILI: WhatsApp na SMS sasa viko bega kwa bega */}

                      <td className="p-4 text-center flex items-center justify-center gap-2">

                        <button

                          onClick={() => sendWhatsAppMessage(guest)}

                          className="bg-green-600 hover:bg-green-500 text-white font-bold py-1 px-2.5 rounded text-xs transition duration-150 inline-flex items-center gap-1 shadow"

                        >

                          <span>💬</span> WhatsApp

                        </button>

                       

                        <button

                          onClick={() => sendNormalSMS(guest)}

                          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-1 px-2.5 rounded text-xs transition duration-150 inline-flex items-center gap-1 shadow"

                        >

                          <span>📱</span> SMS

                        </button>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>

  );

} 

