'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import * as XLSX from 'xlsx';

interface Event {
  id: string;
  title: string;
}

export default function AddGuest() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [tableNumber, setTableNumber] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [uploadingBulk, setUploadingBulk] = useState(false);

  // MABADILIKO MAKUBWA: Kulinda fetch isifeli wakati wa Build kule Vercel
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Kagua kama tuko kwenye kivinjari (Browser) na sio kipindi cha build server
        if (typeof window !== 'undefined') {
          const { data, error } = await supabase.from('events').select('id, title');
          if (!error && data) {
            setEvents(data);
          } else if (error) {
            console.error('Supabase Error:', error.message);
          }
        }
      } catch (err) {
        console.error('Failed to fetch events during build:', err);
      }
    };
    
    fetchEvents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    
    if (!selectedEventId) {
      setError('⚠️ Tafadhali chagua sherehe kwanza.');
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from('guests')
      .insert([{ 
        event_id: selectedEventId, 
        name, 
        phone, 
        table_number: tableNumber || 'Haikupangwa', 
        status: 'Pending' 
      }]);
    
    setLoading(false);
    
    if (error) {
      setError(`Imeshindikana: ${error.message}`);
    } else {
      setMessage(`🟢 Ndg. ${name} amesajiliwa kwenye ${tableNumber ? 'Meza: ' + tableNumber : 'Meza haikupangwa'}!`);
      setName('');
      setPhone('');
      setTableNumber('');
    }
  };

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!selectedEventId) {
      setError('⚠️ CHAGUA SHEREHE KWANZA!');
      e.target.value = '';
      return;
    }
    
    setUploadingBulk(true);
    setMessage('');
    setError('');
    
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(worksheet) as any[];
        
        const guestsToInsert = parsedData
          .filter(row => (row.name || row.Jina) && (row.phone || row.Simu))
          .map(row => ({
            event_id: selectedEventId,
            name: String(row.name || row.Jina).trim(),
            phone: String(row.phone || row.Simu).trim(),
            table_number: String(row.table || row.Meza || 'Haikupangwa').trim(), 
            status: 'Pending'
          }));
          
        if (guestsToInsert.length === 0) {
          setError('❌ Excel haina data halali.');
          setUploadingBulk(false);
          return;
        }
        
        const { error: supabaseError } = await supabase.from('guests').insert(guestsToInsert);
        setUploadingBulk(false);
        
        if (supabaseError) {
          setError(`Makosa: ${supabaseError.message}`);
        } else {
          setMessage(`🎉 Wageni ${guestsToInsert.length} wameingizwa na meza zao!`);
        }
      } catch (err) {
        setError('Hitilafu ya kusoma Excel.');
        setUploadingBulk(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="w-full min-h-screen bg-gray-950 text-white flex flex-col justify-center items-center p-4">
      
      {/* CONTAINER KUU - CENTERED COMPACT */}
      <div className="w-full max-w-[340px] bg-gray-900 p-5 rounded-2xl border border-gray-800 shadow-2xl space-y-4">
        
        <div className="text-center space-y-0.5">
          <div className="text-amber-500 text-xs">✦ 📊 ✦</div>
          <h1 className="text-lg font-bold text-yellow-500 tracking-wide">Sajili Wageni</h1>
          <p className="text-gray-500 text-[10px]">Mmoja mmoja au pakia Excel chini.</p>
        </div>

        {/* 1. SEHEMU YA CHAGUA SHEREHE */}
        <div className="space-y-1">
          <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Aina ya Sherehe:</label>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-xs focus:outline-none focus:border-yellow-500 cursor-pointer"
          >
            <option value="">-- Chagua Sherehe --</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>{event.title}</option>
            ))}
          </select>
        </div>

        <div className="border-t border-gray-800/60 my-0.5"></div>

        {/* 2. CHAGUO A: FOMU YA MKONO */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1">
            <span>👤</span> Chaguo A: Mmoja Mmoja
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="text"
              placeholder="Jina la Mgeni"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-xl text-xs focus:outline-none focus:border-blue-500"
              required={!uploadingBulk}
            />
            <input
              type="tel"
              placeholder="Namba ya Simu"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-xl text-xs focus:outline-none focus:border-blue-500"
              required={!uploadingBulk}
            />
            <input
              type="text"
              placeholder="Namba ya Meza (Mfano: Table 5)"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-xl text-xs focus:outline-none focus:border-blue-500 text-yellow-500 placeholder-gray-600 font-medium"
            />
            <button
              type="submit"
              disabled={loading || uploadingBulk}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-xl text-xs transition disabled:opacity-50"
            >
              {loading ? 'Subiri...' : '➕ Hifadhi Mgeni'}
            </button>
          </form>
        </div>

        <div className="border-t border-gray-800/60 my-0.5"></div>

        {/* 3. CHAGUO B: EXCEL BULK */}
        <div className="space-y-1.5">
          <h3 className="text-[10px] font-bold text-green-400 uppercase tracking-wider flex items-center gap-1">
            <span>📊</span> Chaguo B: Pakia Excel
          </h3>
          <div className="relative border border-dashed border-gray-700 hover:border-green-500 rounded-xl p-3 text-center bg-gray-950/40 cursor-pointer">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleExcelUpload}
              disabled={loading || uploadingBulk}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-1">
              <div className="text-lg text-gray-500">📥</div>
              <p className="text-[10px] font-medium text-gray-300">Bofya kupakia faili (.xlsx)</p>
              <p className="text-[8px] text-gray-500">Inasoma vichwa: name, phone, table/Meza</p>
            </div>
          </div>
        </div>

        {/* MESSAGES */}
        <div className="text-center">
          {uploadingBulk && <p className="text-[10px] text-yellow-500 animate-pulse">Inapakia Excel...</p>}
          {message && <p className="text-[10px] text-green-400 font-medium">{message}</p>}
          {error && <p className="text-[10px] text-red-400 font-medium">{error}</p>}
        </div>

      </div>
    </div>
  );
}