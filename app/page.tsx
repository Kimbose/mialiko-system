'use client';



import Link from 'next/link';



export default function HomePage() {

  return (

    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4">

      <div className="w-full max-w-3xl text-center space-y-8">

       

        {/* Nembo na Utangulizi */}

        <div className="space-y-3">

          <div className="text-yellow-500 text-6xl animate-bounce">📱✨🎫</div>

          <h1 className="text-4xl font-extrabold tracking-wide bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600 bg-clip-text text-transparent">

            E-INVITATION & GATE PASS SYSTEM

          </h1>

          <p className="text-gray-400 max-w-md mx-auto text-sm">

            Mfumo thabiti wa kidijitali wa kusimamia sherehe, kutuma mialiko na kukagua wageni mlangoni kwa kutumia QR Code.

          </p>

        </div>



        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>



        {/* MENU KUU YA KUDHIBITI MFUMO (CONTROL PANEL) */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">

         

          {/* Kitufe cha 1: Sajili Sherehe */}

          <Link href="/create-event" className="group p-6 bg-gray-900 border border-gray-800 hover:border-yellow-600/50 rounded-2xl text-left transition duration-200 shadow-xl hover:-translate-y-1">

            <div className="flex items-center justify-between mb-2">

              <span className="text-3xl">🎉</span>

              <span className="text-xs text-gray-500 bg-gray-950 px-2.5 py-1 rounded-full font-sans">Hatua ya 1</span>

            </div>

            <h3 className="text-lg font-bold text-white group-hover:text-yellow-500 transition">Sajili Sherehe Mpya</h3>

            <p className="text-xs text-gray-400 mt-1">Anza hapa kwa kuingiza jina la sherehe, tarehe na ukumbi ili upate ID maalum.</p>

          </Link>



          {/* Kitufe cha 2: Sajili Wageni */}

          <Link href="/add-guest" className="group p-6 bg-gray-900 border border-gray-800 hover:border-yellow-600/50 rounded-2xl text-left transition duration-200 shadow-xl hover:-translate-y-1">

            <div className="flex items-center justify-between mb-2">

              <span className="text-3xl">👥</span>

              <span className="text-xs text-gray-500 bg-gray-950 px-2.5 py-1 rounded-full font-sans">Hatua ya 2</span>

            </div>

            <h3 className="text-lg font-bold text-white group-hover:text-yellow-500 transition">Ongeza Wageni (Alika)</h3>

            <p className="text-xs text-gray-400 mt-1">Sajili majina ya wageni na namba zao za simu uziunganishe na ID ya sherehe husika.</p>

          </Link>



          {/* Kitufe cha 3: Dashibodi na WhatsApp */}

          <Link href="/dashboard" className="group p-6 bg-gray-900 border border-gray-800 hover:border-yellow-600/50 rounded-2xl text-left transition duration-200 shadow-xl hover:-translate-y-1">

            <div className="flex items-center justify-between mb-2">

              <span className="text-3xl">📊</span>

              <span className="text-xs text-gray-500 bg-gray-950 px-2.5 py-1 rounded-full font-sans">Hatua ya 3</span>

            </div>

            <h3 className="text-lg font-bold text-white group-hover:text-yellow-500 transition">Orodha & Tuma WhatsApp</h3>

            <p className="text-xs text-gray-400 mt-1">Angalia majibu ya wageni wako (RSVP) na utume mialiko yenye link kwenda WhatsApp.</p>

          </Link>



          {/* Kitufe cha 4: Scanner ya Mlangoni */}

          <Link href="/scanner" className="group p-6 bg-gray-900 border border-yellow-600/20 hover:border-yellow-500 rounded-2xl text-left transition duration-200 shadow-xl hover:-translate-y-1 bg-gradient-to-br from-gray-900 to-yellow-950/20">

            <div className="flex items-center justify-between mb-2">

              <span className="text-3xl">📷</span>

              <span className="text-xs text-yellow-500 bg-yellow-950/50 border border-yellow-800/50 px-2.5 py-1 rounded-full font-sans font-bold">Mlangoni</span>

            </div>

            <h3 className="text-lg font-bold text-yellow-500 transition">QR Code Gate Pass Scanner</h3>

            <p className="text-xs text-gray-400 mt-1">Inua kamera ya simu siku ya sherehe kuskani kadi za wageni na kuzuia wasioalikwa.</p>

          </Link>



        </div>



        {/* Maelezo ya Chini */}

        <p className="text-[11px] text-gray-600 font-sans tracking-wider">

          © {new Date().getFullYear()} E-Invitation System. Imesukwa kitalaamu kabisa.

        </p>



      </div>

    </div>

  );

} 

