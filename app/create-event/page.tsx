'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function CreateEvent() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Tuma data kwenye jedwali la 'events' kule Supabase
    const { data, error } = await supabase
      .from('events')
      .insert([{ title, date, location }])
      .select();

    setLoading(false);

    if (error) {
      setMessage(`Makosa yametokea: ${error.message}`);
    } else {
      setMessage('Hongera! Sherehe imesajiliwa kikamilifu kwenye database!');
      setTitle('');
      setDate('');
      setLocation('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-750">
        <h2 className="text-2xl font-bold text-center mb-6 text-yellow-500">
          Usajili wa Sherehe Mpya
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Jina la Sherehe:</label>
            <input
              type="text"
              required
              placeholder="Mf. Harusi ya Emmanuel & Maria"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tarehe ya Sherehe:</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Ukumbi / Mahali:</label>
            <input
              type="text"
              required
              placeholder="Mf. Ukumbi wa Mbeya City"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-yellow-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 px-4 rounded transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Inasajili...' : 'Sajili Sherehe'}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm font-medium text-green-400 bg-gray-900 p-2.5 rounded border border-gray-700">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}