'use client';

import React, { useState } from 'react';

export default function EventDashboard() {
  const [vips] = useState([
    { id: 1, name: 'John Doe', phone: '0712345678', status: 'Amekubali', seats: 2 },
    { id: 2, name: 'Annamaria Juma', phone: '0655998877', status: 'Hawezi Kuja', seats: 0 },
    { id: 3, name: 'Mhandisi Madati', phone: '0794130990', status: 'Bado Hajajibu', seats: 1 },
  ]);

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-gray-800">
      <div className="max-w-6xl mx-auto bg-white border border-gray-200 p-6 rounded-xl shadow-sm mb-6">
        <span className="text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-600 px-3 py-1 rounded-full">Dashboard</span>
        <h1 className="text-2xl font-bold text-gray-950 mt-2">Harusi ya Juma na Asha 🥳</h1>
        <p className="text-gray-500 text-sm">Ukumbi: Igowole, Mufindi</p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Wageni Waliolikwa</p>
          <p className="text-3xl font-bold text-gray-950 mt-1">150</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-green-500">
          <p className="text-sm text-green-600">Wanaokuja (RSVP)</p>
          <p className="text-3xl font-bold text-gray-950 mt-1">92</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-red-500">
          <p className="text-sm text-red-600">Hawaji</p>
          <p className="text-3xl font-bold text-gray-950 mt-1">12</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 bg-gray-50">
          <h2 className="font-bold text-gray-950">Orodha ya Wageni</h2>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200 text-xs text-gray-500 bg-gray-50">
              <th className="p-4">Jina</th>
              <th className="p-4">Simu</th>
              <th className="p-4">Hali</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {vips.map((v) => (
              <tr key={v.id}>
                <td className="p-4 font-medium text-gray-900">{v.name}</td>
                <td className="p-4 text-gray-500">{v.phone}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    v.status === 'Amekubali' ? 'bg-green-50 text-green-700' :
                    v.status === 'Hawezi Kuja' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {v.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}