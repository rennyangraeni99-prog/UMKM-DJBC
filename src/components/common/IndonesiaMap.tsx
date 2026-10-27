import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Globe2, Filter, CheckCircle2, Eye, Compass, Layers } from 'lucide-react';

interface KanwilHotspot {
  id: string;
  name: string;
  shortName: string;
  city: string;
  island: string;
  x: number; // percentage coordinate on map canvas (0-100)
  y: number; // percentage coordinate on map canvas (0-100)
}

// Coordinates calibrated precisely to match the uploaded Indonesia silhouette map
const KANWIL_HOTSPOTS: KanwilHotspot[] = [
  { id: 'Kanwil DJBC Sumatera Utara', name: 'Kanwil DJBC Sumatera Utara', shortName: 'Sumatera Utara', city: 'Medan', island: 'Sumatera', x: 11.6, y: 27.6 },
  { id: 'Kanwil DJBC Banten', name: 'Kanwil DJBC Banten', shortName: 'Banten', city: 'Serang', island: 'Jawa', x: 27.4, y: 73.4 },
  { id: 'Kanwil DJBC Jawa Barat', name: 'Kanwil DJBC Jawa Barat', shortName: 'Jawa Barat', city: 'Bandung', island: 'Jawa', x: 30.6, y: 75.5 },
  { id: 'Kanwil DJBC Jawa Tengah & D.I. Yogyakarta', name: 'Kanwil DJBC Jateng & DIY', shortName: 'Jateng & DIY', city: 'Semarang', island: 'Jawa', x: 36.9, y: 77.5 },
  { id: 'Kanwil DJBC Jawa Timur I', name: 'Kanwil DJBC Jawa Timur I', shortName: 'Jawa Timur I', city: 'Surabaya', island: 'Jawa', x: 41.2, y: 79.6 },
  { id: 'Kanwil DJBC Bali, NTB, dan NTT', name: 'Kanwil DJBC Bali, NTB, NTT', shortName: 'Bali & Nusra', city: 'Denpasar', island: 'Bali-Nusra', x: 49.9, y: 83.2 },
  { id: 'Kanwil DJBC Kalimantan Bagian Barat', name: 'Kanwil DJBC Kalbagbar', shortName: 'Kalbagbar', city: 'Pontianak', island: 'Kalimantan', x: 35.1, y: 45.0 },
  { id: 'Kanwil DJBC Sulawesi Bagian Selatan', name: 'Kanwil DJBC Sulbagsel', shortName: 'Sulbagsel', city: 'Makassar', island: 'Sulawesi', x: 54.3, y: 61.3 },
  { id: 'Kanwil DJBC Maluku', name: 'Kanwil DJBC Maluku', shortName: 'Maluku', city: 'Ambon', island: 'Maluku', x: 72.9, y: 55.6 }
];

export const IndonesiaMap: React.FC = () => {
  const { umkmList, metricEksporList, asistensiLogs, selectedKanwilFilter, setSelectedKanwilFilter } = useApp();
  const [hoveredHotspot, setHoveredHotspot] = useState<KanwilHotspot | null>(null);
  const [colorMode, setColorMode] = useState<'kemenkeu' | 'silhouette'>('kemenkeu');

  // Helper stats for a kanwil
  const getKanwilStats = (kanwilId: string) => {
    const umkms = umkmList.filter((u) => u.kanwilPembina === kanwilId);
    const metrics = metricEksporList.filter((m) => m.kanwil === kanwilId);
    const logs = asistensiLogs.filter((a) => a.kanwil === kanwilId);
    const totalFob = metrics.reduce((acc, curr) => acc + curr.fobTahunBerjalanUsd, 0);
    return {
      totalUmkm: umkms.length,
      telahEkspor: umkms.filter((u) => u.klasterEkspor === 'Telah Ekspor').length,
      siapEkspor: umkms.filter((u) => u.klasterEkspor === 'Siap Ekspor').length,
      potensiEkspor: umkms.filter((u) => u.klasterEkspor === 'Potensi Ekspor').length,
      totalFobUsd: totalFob,
      totalAsistensi: logs.length
    };
  };

  return (
    <div className="relative bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xl overflow-hidden">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h4 className="text-sm sm:text-base font-black text-slate-900 tracking-wide uppercase flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-blue-700" />
            <span>Peta Sebaran Wilayah Kepulauan Indonesia</span>
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Sebaran geospasial titik Kanwil DJBC pembina UMKM ekspor sesuai peta referensi resmi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Style Mode Selector */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-[11px] font-semibold text-slate-600">
            <button
              onClick={() => setColorMode('kemenkeu')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                colorMode === 'kemenkeu' ? 'bg-[#1b2559] text-amber-400 shadow-2xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Biru Kemenkeu</span>
            </button>
            <button
              onClick={() => setColorMode('silhouette')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                colorMode === 'silhouette' ? 'bg-slate-900 text-white shadow-2xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-slate-200" />
              <span>Siluet Referensi</span>
            </button>
          </div>

          <button
            onClick={() => setSelectedKanwilFilter('Semua Kanwil')}
            className={`px-3.5 py-1 rounded-xl border font-bold text-xs transition-colors ${
              selectedKanwilFilter === 'Semua Kanwil'
                ? 'bg-blue-800 text-white border-blue-900 shadow-xs'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            Nasional (Semua)
          </button>
        </div>
      </div>

      {/* Map Graphic Canvas with the Exact User Uploaded Indonesia Map */}
      <div className={`relative w-full aspect-[24/10] min-h-[290px] sm:min-h-[360px] rounded-2xl border transition-all duration-300 flex items-center justify-center overflow-hidden select-none ${
        colorMode === 'kemenkeu'
          ? 'bg-gradient-to-b from-[#0f1738] via-[#141f48] to-[#0c1432] border-[#223066] shadow-inner'
          : 'bg-[#f8fafc] border-slate-200 shadow-inner'
      }`}>
        {/* Subtle grid pattern for cartographic look */}
        <div className={`absolute inset-0 pointer-events-none ${
          colorMode === 'kemenkeu'
            ? 'bg-[radial-gradient(#38bdf8_0.8px,transparent_0.8px)] [background-size:24px_24px] opacity-20'
            : 'bg-[radial-gradient(#94a3b8_0.8px,transparent_0.8px)] [background-size:24px_24px] opacity-25'
        }`} />

        {/* The Exact Silhouette Map Image from User */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center p-3 sm:p-5">
          {colorMode === 'kemenkeu' ? (
            /* Render with Kemenkeu Blue & Subtle Glowing Shoreline */
            <img
              src="/assets/aistudio/indonesia_map_kemenkeu_blue.png"
              alt="Peta Indonesia DJBC"
              className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all duration-300"
            />
          ) : (
            /* Render Exact Black Silhouette as uploaded by user */
            <img
              src="/assets/aistudio/bfcfeb50-309e-412e-a28e-1d0d1e6fbb34_ba9887f1.jpg"
              alt="Peta Indonesia Referensi"
              className="w-full h-full object-contain mix-blend-multiply opacity-95 transition-all duration-300"
            />
          )}
        </div>

        {/* Compass Rose (Arah Mata Angin) */}
        <div className="absolute bottom-3 left-4 pointer-events-none hidden sm:flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-[10px] font-black ${
            colorMode === 'kemenkeu'
              ? 'bg-[#151e44]/80 text-amber-400 border-[#2f3d79]'
              : 'bg-white/80 text-slate-800 border-slate-300 shadow-xs'
          }`}>
            <span className="flex flex-col items-center leading-none">
              <span className="text-[7px]">▲</span>
              <span>U</span>
            </span>
          </div>
          <span className={`text-[10px] font-mono tracking-widest uppercase font-semibold ${
            colorMode === 'kemenkeu' ? 'text-blue-300/50' : 'text-slate-400'
          }`}>
            INDONESIA ARCHIPELAGO
          </span>
        </div>

        {/* Interactive Hotspot Buttons for Kanwil Bea Cukai */}
        {KANWIL_HOTSPOTS.map((spot) => {
          const stats = getKanwilStats(spot.id);
          const isSelected = selectedKanwilFilter === spot.id;

          return (
            <div
              key={spot.id}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
            >
              <button
                onClick={() => setSelectedKanwilFilter(isSelected ? 'Semua Kanwil' : spot.id)}
                onMouseEnter={() => setHoveredHotspot(spot)}
                onMouseLeave={() => setHoveredHotspot(null)}
                className={`relative flex items-center justify-center transition-all hover:scale-125 focus:outline-none ${
                  isSelected ? 'scale-125 z-30' : ''
                }`}
                aria-label={spot.name}
              >
                {/* Ping animation effect on active or key locations */}
                {isSelected && (
                  <span className="absolute w-7 h-7 rounded-full bg-amber-400 opacity-75 animate-ping pointer-events-none" />
                )}

                {/* Outer badge */}
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all shadow-md ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 font-black ring-4 ring-amber-300/50 shadow-amber-500/50'
                      : colorMode === 'kemenkeu'
                      ? 'bg-[#1a2356] text-amber-400 ring-2 ring-blue-300/80 hover:bg-amber-400 hover:text-slate-950'
                      : 'bg-slate-900 text-amber-400 ring-2 ring-white hover:bg-blue-700 hover:text-white'
                  }`}
                >
                  <MapPin className="w-3 h-3 stroke-[2.5]" />
                </span>

                {/* Always visible label on desktop */}
                <span
                  className={`hidden md:inline-block absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg transition-all ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 ring-1 ring-amber-300 font-black'
                      : colorMode === 'kemenkeu'
                      ? 'bg-[#0f1738]/90 text-blue-100 border border-[#2d3a77] hover:text-amber-300 hover:border-amber-400'
                      : 'bg-white/95 text-slate-800 border border-slate-200 hover:text-blue-700 hover:border-blue-300'
                  }`}
                >
                  {spot.shortName}
                </span>
              </button>
            </div>
          );
        })}

        {/* Hover / Selected Kanwil Detailed Floating Card */}
        {(hoveredHotspot || (selectedKanwilFilter !== 'Semua Kanwil' && KANWIL_HOTSPOTS.find(s => s.id === selectedKanwilFilter))) && (
          <div className="absolute bottom-3 right-4 left-4 sm:left-auto sm:w-84 bg-[#141b44]/95 text-white p-4 rounded-2xl shadow-2xl backdrop-blur-md border border-[#2e3b7c] z-30 transition-all text-xs animate-in fade-in duration-150">
            {(() => {
              const target = hoveredHotspot || KANWIL_HOTSPOTS.find(s => s.id === selectedKanwilFilter)!;
              const stats = getKanwilStats(target.id);
              return (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between pb-2 border-b border-[#28346e]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                      <span className="font-bold text-white text-xs">{target.name}</span>
                    </div>
                    <span className="text-[10px] uppercase font-mono text-amber-300 font-bold bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30">
                      {target.island}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-[#1c2559] p-2 rounded-xl border border-[#2a3777]">
                      <span className="text-blue-300 block text-[10px]">Total UMKM Binaan:</span>
                      <span className="font-mono font-bold text-white text-xs">{stats.totalUmkm} Usaha</span>
                    </div>
                    <div className="bg-[#1c2559] p-2 rounded-xl border border-[#2a3777]">
                      <span className="text-blue-300 block text-[10px]">Telah Ekspor Mandiri:</span>
                      <span className="font-mono font-bold text-emerald-400 text-xs">{stats.telahEkspor} UMKM</span>
                    </div>
                    <div className="bg-[#1c2559] p-2 rounded-xl border border-[#2a3777]">
                      <span className="text-blue-300 block text-[10px]">Total Realisasi FOB:</span>
                      <span className="font-mono font-bold text-amber-300 text-xs">
                        ${stats.totalFobUsd.toLocaleString('en-US')}
                      </span>
                    </div>
                    <div className="bg-[#1c2559] p-2 rounded-xl border border-[#2a3777]">
                      <span className="text-blue-300 block text-[10px]">Aktivitas Asistensi:</span>
                      <span className="font-mono font-bold text-sky-400 text-xs">{stats.totalAsistensi} Sesi</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#28346e] flex items-center justify-between text-[10px] text-blue-200">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-amber-400" />
                      <span>{selectedKanwilFilter === target.id ? 'Filter Aktif Terpilih' : 'Klik titik untuk filter data'}</span>
                    </span>
                    {selectedKanwilFilter === target.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedKanwilFilter('Semua Kanwil');
                        }}
                        className="text-amber-400 hover:text-amber-300 font-bold underline"
                      >
                        Reset Filter
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Kanwil Quick Chips Bar */}
      <div className="mt-3.5 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap shrink-0 mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3 text-amber-500" />
          <span>Kanwil:</span>
        </span>
        {KANWIL_HOTSPOTS.map((k) => (
          <button
            key={k.id}
            onClick={() => setSelectedKanwilFilter(selectedKanwilFilter === k.id ? 'Semua Kanwil' : k.id)}
            className={`px-3 py-1 rounded-xl whitespace-nowrap shrink-0 text-xs font-semibold border transition-all ${
              selectedKanwilFilter === k.id
                ? 'bg-[#181f4d] text-amber-400 border-amber-400 font-bold shadow-xs ring-1 ring-amber-400/30'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            {k.shortName}
          </button>
        ))}
      </div>
    </div>
  );
};
