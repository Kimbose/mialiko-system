'use client';

import { useState } from 'react';

export default function NewEvent() {
  const [eventName, setEventName] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Sherehe imesajiliwa!\nJina: ${eventName}\nMahali: ${location}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-gray-800">
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 w-full max-w-lg">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-950">Unda Sherehe Mpya 🥳</h1>
          <p className="text-gray-500 text-sm">Jaza taarifa za sherehe ili uanze kualika wageni kidijitali.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Jina la Sherehe *</label>
            <input
              type="text"
              required
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Mf. Harusi ya Juma na Asha"
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Tarehe na Muda *</label>
              <input
                type="datetime-local"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Ukumbi / Mahali *</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Mf. Igowole, Mufindi"
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Maelezo ya Ziada (Optional)</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mf. Rangi za siku ni Dhahabu na Nyeupe. Karibuni sana!"
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded-lg text-sm font-semibold transition"
            >
              Ghairi
            </button>
            <button
              type="submit"
              className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg text-sm font-semibold transition shadow"
            >
              Anzisha Sherehe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}