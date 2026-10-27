import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IndonesiaMap } from '../common/IndonesiaMap';
import {
  Building2,
  Users,
  TrendingUp,
  Globe2,
  PackageCheck,
  Printer,
  Sparkles,
  Award,
  Layers,
  ArrowRight,
  Download,
  Star,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Minus,
  CheckCircle2,
  Calendar,
  Filter,
  BarChart3,
  Flame,
  Ship
} from 'lucide-react';

export const ExecutiveDashboard: React.FC = () => {
  const {
    umkmList,
    metricEksporList,
    asistensiLogs,
    selectedKanwilFilter,
    setSelectedKanwilFilter,
    setActiveTab,
    currentUser
  } = useApp();

  const [chartMetric, setChartMetric] = useState<'fob' | 'volume'>('fob');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Tahun 2026');

  // Filtered dataset based on selected Kanwil
  const filteredUmkm = useMemo(() => {
    if (currentUser.role === 'operator_kanwil' && currentUser.kanwilAssignment) {
      return umkmList.filter((u) => u.kanwilPembina === currentUser.kanwilAssignment);
    }
    if (selectedKanwilFilter !== 'Semua Kanwil') {
      return umkmList.filter((u) => u.kanwilPembina === selectedKanwilFilter);
    }
    return umkmList;
  }, [umkmList, currentUser, selectedKanwilFilter]);

  const filteredMetrics = useMemo(() => {
    if (currentUser.role === 'operator_kanwil' && currentUser.kanwilAssignment) {
      return metricEksporList.filter((m) => m.kanwil === currentUser.kanwilAssignment);
    }
    if (selectedKanwilFilter !== 'Semua Kanwil') {
      return metricEksporList.filter((m) => m.kanwil === selectedKanwilFilter);
    }
    return metricEksporList;
  }, [metricEksporList, currentUser, selectedKanwilFilter]);

  const filteredLogs = useMemo(() => {
    if (currentUser.role === 'operator_kanwil' && currentUser.kanwilAssignment) {
      return asistensiLogs.filter((a) => a.kanwil === currentUser.kanwilAssignment);
    }
    if (selectedKanwilFilter !== 'Semua Kanwil') {
      return asistensiLogs.filter((a) => a.kanwil === selectedKanwilFilter);
    }
    return asistensiLogs;
  }, [asistensiLogs, currentUser, selectedKanwilFilter]);

  // 1. Jumlah UMKM Binaan
  const totalUmkmBinaan = filteredUmkm.length;

  // 2. Jumlah UMKM yang diasistensi
  const assistedUmkmIds = useMemo(() => {
    const ids = new Set<string>();
    filteredLogs.forEach((log) => {
      if (log.umkmId) ids.add(log.umkmId);
    });
    return ids;
  }, [filteredLogs]);

  const totalUmkmDiasistensi = assistedUmkmIds.size;
  const persentaseDiasistensi = totalUmkmBinaan > 0 
    ? Math.round((totalUmkmDiasistensi / totalUmkmBinaan) * 100) 
    : 0;

  // 3. Nilai Ekspor (Total Realisasi FOB Berjalan & Nilai Tahun Lalu)
  const totalFobBerjalanUsd = filteredMetrics.reduce((acc, curr) => acc + curr.fobTahunBerjalanUsd, 0);
  const totalFobSebelumnyaUsd = filteredMetrics.reduce((acc, curr) => acc + curr.fobTahunSebelumnyaUsd, 0);
  const totalFobBerjalanIdr = totalFobBerjalanUsd * 16000;
  const yoyGrowthPercent = totalFobSebelumnyaUsd > 0
    ? ((totalFobBerjalanUsd - totalFobSebelumnyaUsd) / totalFobSebelumnyaUsd) * 100
    : 0;

  // 4. Klasterisasi UMKM (Potensi Ekspor, Siap Ekspor, Telah Ekspor)
  const klasterStats = useMemo(() => {
    const stats = {
      potensi: filteredUmkm.filter((u) => u.klasterEkspor === 'Potensi Ekspor').length,
      siap: filteredUmkm.filter((u) => u.klasterEkspor === 'Siap Ekspor').length,
      telah: filteredUmkm.filter((u) => u.klasterEkspor === 'Telah Ekspor').length
    };
    const total = totalUmkmBinaan || 1;
    return {
      ...stats,
      potensiPct: Math.round((stats.potensi / total) * 100),
      siapPct: Math.round((stats.siap / total) * 100),
      telahPct: Math.round((stats.telah / total) * 100)
    };
  }, [filteredUmkm, totalUmkmBinaan]);

  // 5. Top 10 Negara Tujuan Ekspor
  const top10NegaraTujuan = useMemo(() => {
    const baseRankings = [
      { negara: 'Amerika Serikat', kode: 'US', kawasan: 'Amerika Utara', baseExporters: 4, baseFobUsd: 890000, flag: '🇺🇸' },
      { negara: 'Jepang', kode: 'JP', kawasan: 'Asia Timur', baseExporters: 3, baseFobUsd: 480000, flag: '🇯🇵' },
      { negara: 'Tiongkok', kode: 'CN', kawasan: 'Asia Timur', baseExporters: 3, baseFobUsd: 615000, flag: '🇨🇳' },
      { negara: 'Belanda', kode: 'NL', kawasan: 'Eropa Barat', baseExporters: 3, baseFobUsd: 590000, flag: '🇳🇱' },
      { negara: 'Uni Emirat Arab', kode: 'AE', kawasan: 'Timur Tengah', baseExporters: 2, baseFobUsd: 520000, flag: '🇦🇪' },
      { negara: 'Jerman', kode: 'DE', kawasan: 'Eropa Tengah', baseExporters: 3, baseFobUsd: 380000, flag: '🇩🇪' },
      { negara: 'Australia', kode: 'AU', kawasan: 'Oseania', baseExporters: 2, baseFobUsd: 290000, flag: '🇦🇺' },
      { negara: 'Korea Selatan', kode: 'KR', kawasan: 'Asia Timur', baseExporters: 2, baseFobUsd: 210000, flag: '🇰🇷' },
      { negara: 'Singapura', kode: 'SG', kawasan: 'Asia Tenggara', baseExporters: 3, baseFobUsd: 185000, flag: '🇸🇬' },
      { negara: 'Malaysia', kode: 'MY', kawasan: 'Asia Tenggara', baseExporters: 2, baseFobUsd: 95000, flag: '🇲🇾' }
    ];

    const dynamicMap: Record<string, { count: number; fobUsd: number }> = {};
    filteredMetrics.forEach((m) => {
      (m.negaraTujuan || []).forEach((country: string) => {
        if (!dynamicMap[country]) {
          dynamicMap[country] = { count: 0, fobUsd: 0 };
        }
        dynamicMap[country].count += 1;
        dynamicMap[country].fobUsd += m.fobTahunBerjalanUsd / (m.negaraTujuan.length || 1);
      });
    });

    return baseRankings.map((base) => {
      const extra = dynamicMap[base.negara] || { count: 0, fobUsd: 0 };
      const totalFob = Math.round(base.baseFobUsd + extra.fobUsd);
      return {
        ...base,
        totalExporters: base.baseExporters + (extra.count > 0 ? 1 : 0),
        totalFobUsd: totalFob,
        fobIdr: totalFob * 16000
      };
    }).sort((a, b) => b.totalFobUsd - a.totalFobUsd);
  }, [filteredMetrics]);

  // 6. Top 10 Hasil Produksi (Komoditas Unggulan)
  const top10HasilProduksi = useMemo(() => {
    const commodityMap: Record<string, { count: number; umkmNames: string[]; sharePct: number }> = {};
    
    filteredUmkm.forEach((u) => {
      const item = u.komoditasUtama || 'Lainnya';
      if (!commodityMap[item]) {
        commodityMap[item] = { count: 0, umkmNames: [], sharePct: 0 };
      }
      commodityMap[item].count += 1;
      if (commodityMap[item].umkmNames.length < 3) {
        commodityMap[item].umkmNames.push(u.namaUmkm);
      }
    });

    const defaultList = [
      { name: 'Kopi Arabika & Robusta Specialty', count: 6, kbli: 'Industri Pengolahan Kopi', trend: '+14%' },
      { name: 'Cokelat Olahan & Biji Kakao Fermentasi', count: 4, kbli: 'Industri Kakao & Cokelat', trend: '+22%' },
      { name: 'Furniture Rotan Sintetis & Alami', count: 4, kbli: 'Industri Furnitur Rotan', trend: '+8%' },
      { name: 'Briket Arang Tempurung Kelapa', count: 3, kbli: 'Industri Bahan Bakar Biomassa', trend: '+35%' },
      { name: 'Minyak Atsiri (Patchouli & Cengkeh)', count: 3, kbli: 'Industri Minyak Atsiri', trend: '+12%' },
      { name: 'Kerajinan Batik Tulis & Tenun Tradisional', count: 3, kbli: 'Industri Kerajinan & Tekstil', trend: '+5%' },
      { name: 'Ikan Tuna Beku & Olahan Hasil Laut', count: 2, kbli: 'Industri Pengolahan Hasil Laut', trend: '+18%' },
      { name: 'Rempah Kering (Pala, Lada, Kayu Manis)', count: 2, kbli: 'Industri Rempah-rempah', trend: '+10%' },
      { name: 'Kerajinan Kayu Ukir & Homeware', count: 2, kbli: 'Industri Barang Kerajinan Kayu', trend: '+6%' },
      { name: 'Kripik Buah Vakum & Camilan Herbal', count: 2, kbli: 'Industri Makanan Ringan Sehat', trend: '+9%' }
    ];

    return defaultList.map((item, idx) => {
      const found = commodityMap[item.name];
      const count = found ? Math.max(item.count, found.count) : item.count;
      return {
        ranking: idx + 1,
        ...item,
        actualCount: count,
        sharePct: Math.round((count / (totalUmkmBinaan || 10)) * 100)
      };
    });
  }, [filteredUmkm, totalUmkmBinaan]);

  const formatCurrencyIdr = (val: number) => {
    if (val >= 1_000_000_000_000) {
      return `Rp ${(val / 1_000_000_000_000).toFixed(1)} Triliun`;
    }
    if (val >= 1_000_000_000) {
      return `Rp ${(val / 1_000_000_000).toFixed(1)} Milyar`;
    }
    return `Rp ${(val / 1_000_000).toFixed(0)} Juta`;
  };

  return (
    <div className="space-y-6">
      {/* Scope Bar & Filter Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#191e4a] border border-[#2b3577] p-4 rounded-2xl text-white shadow-md">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
            <span>DASHBOARD UMKM BINAAN DJBC</span>
            <span className="text-xs font-bold text-slate-950 bg-amber-400 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Eksekutif
            </span>
          </h1>
          <p className="text-xs text-blue-200 mt-1">
            Monitoring kinerja ekspor, klasterisasi, sebaran regional, dan asistensi kepabeanan terpadu.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <select
              value={selectedKanwilFilter}
              onChange={(e) => setSelectedKanwilFilter(e.target.value)}
              className="appearance-none bg-[#121639] text-white text-xs font-semibold rounded-xl pl-3 pr-8 py-2 border border-[#2f3984] focus:outline-none focus:ring-1 focus:ring-amber-400"
            >
              <option value="Semua Kanwil">Seluruh Kanwil DJBC (Nasional)</option>
              <option value="Kanwil DJBC Jawa Timur I">Kanwil DJBC Jawa Timur I</option>
              <option value="Kanwil DJBC Sumatera Utara">Kanwil DJBC Sumatera Utara</option>
              <option value="Kanwil DJBC Jawa Tengah & D.I. Yogyakarta">Kanwil DJBC Jateng & DIY</option>
              <option value="Kanwil DJBC Jawa Barat">Kanwil DJBC Jawa Barat</option>
              <option value="Kanwil DJBC Banten">Kanwil DJBC Banten</option>
              <option value="Kanwil DJBC Bali, NTB, dan NTT">Kanwil DJBC Bali, NTB, NTT</option>
              <option value="Kanwil DJBC Sulawesi Bagian Selatan">Kanwil DJBC Sulbagsel</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-amber-400 absolute right-2.5 top-3 pointer-events-none" />
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all shadow-md shrink-0 active:scale-95 no-print"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cetak PDF</span>
          </button>
        </div>
      </div>

      {/* TOP 3 STAT CARDS - Exact Visual Hierarchy from Reference Mockup */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* CARD 1: Nilai Realisasi Ekspor (Deep Navy / Indigo Blue Container like ALL MONTH / $3500) */}
        <div className="bg-[#242c6f] border border-[#353f8e] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[200px]">
          {/* Subtle decorative circles */}
          <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-blue-200">
              <span className="uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>ALL PERIOD (2026)</span>
              </span>
              <span className="uppercase tracking-wider font-bold text-amber-300">
                TOTAL FOB AMOUNT
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                {formatCurrencyIdr(totalFobBerjalanIdr)}
              </div>
            </div>
            <div className="text-xs font-mono text-blue-200 mt-1">
              ≈ ${(totalFobBerjalanUsd).toLocaleString('en-US')} USD
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-[#343e88] flex items-center justify-between">
            <div className="text-xs text-blue-200 leading-snug">
              Total Akumulasi Realisasi Ekspor UMKM Binaan DJBC
            </div>

            {/* Layered star badge as shown in mockup */}
            <div className="w-12 h-12 rounded-2xl bg-[#39449f] border border-blue-400/40 flex flex-col items-center justify-center shrink-0 shadow-lg text-amber-300">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-[10px] font-black leading-none mt-0.5 text-white">
                {klasterStats.telah}
              </span>
            </div>
          </div>
        </div>

        {/* CARD 2: UMKM Diasistensi (Warm Amber/Kemenkeu Gold Gradient like PENDING CLEARANCE in Mockup) */}
        <div className="bg-gradient-to-br from-[#ea580c] via-[#f59e0b] to-[#d97706] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[200px]">
          {/* Subtle curved background overlay */}
          <div className="absolute inset-0 bg-white/5 opacity-50 pointer-events-none" />
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-yellow-300/20 rounded-full blur-xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between text-xs font-bold text-amber-100 uppercase tracking-wider">
              <span>PENDING & DIASISTENSI</span>
              <span className="bg-black/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px]">
                OKTOBER 2026
              </span>
            </div>

            <div className="mt-4">
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-sm">
                {totalUmkmDiasistensi}
                <span className="text-xl font-bold text-amber-100 ml-2">/ {totalUmkmBinaan} UMKM</span>
              </div>
              <div className="text-xs font-semibold text-amber-100 mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                <span>{persentaseDiasistensi}% UMKM telah menerima pendampingan</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-white/20 flex items-center justify-between">
            <span className="text-xs font-medium text-amber-50">
              {filteredLogs.length} Aktivitas Log Tercatat
            </span>
            <div className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
              <ChevronDown className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* CARD 3: Klasterisasi & Siap Ekspor (Vibrant Pink/Rose Gradient or Royal Blue like WITHDRAW READY in Mockup) */}
        <div className="bg-gradient-to-br from-[#f43f5e] via-[#fb7185] to-[#f472b6] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[200px]">
          <div className="absolute inset-0 bg-white/5 opacity-40 pointer-events-none" />
          <div className="absolute -right-6 -top-6 w-36 h-36 bg-pink-300/20 rounded-full blur-xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between text-xs font-bold text-rose-100 uppercase tracking-wider">
              <span>KLASTERISASI EKSPOR</span>
              <span className="bg-black/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px]">
                STATUS AKTIF
              </span>
            </div>

            <div className="mt-4">
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-sm">
                {klasterStats.telah + klasterStats.siap}
                <span className="text-xl font-bold text-rose-100 ml-2">Siap/Telah</span>
              </div>
              <div className="text-xs font-semibold text-rose-100 mt-1">
                {klasterStats.potensi} UMKM dalam kategori Potensi Ekspor
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-white/20 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-50">
              <Ship className="w-3.5 h-3.5 text-white" />
              <span>{klasterStats.telahPct}% Telah Melakukan Ekspor Mandiri</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
              <ChevronDown className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN SECTION MATCHING THE MOCKUP */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN (2/3 WIDTH): Flow Chart, Peta Sebaran, Analytic & Dynamic row cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. FLOW CHART (Crisp White Card with rounded-3xl) */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base sm:text-lg font-black tracking-wider text-slate-900 uppercase">
                  FLOW CHART PERFORMA EKSPOR
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tren perkembangan transaksi ekspor FOB dan tingkat keberhasilan asistensi kanwil
                </p>
              </div>

              {/* Legends matching Data No 1, Data No 2, Data No 3 in mockup */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-[#5458f7]" />
                  <span className="text-slate-700">Ekspor Mandiri</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-[#f97316]" />
                  <span className="text-slate-700">Fasilitas KITE</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-[#ec4899]" />
                  <span className="text-slate-700">Asistensi DJBC</span>
                </div>
              </div>
            </div>

            {/* Interactive SVG Multi-line Chart matching reference image style */}
            <div className="mt-6 relative">
              <svg className="w-full h-56 sm:h-64 overflow-visible" viewBox="0 0 600 240">
                {/* Horizontal grid lines */}
                <line x1="40" y1="20" x2="580" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="40" y1="65" x2="580" y2="65" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="40" y1="110" x2="580" y2="110" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="40" y1="155" x2="580" y2="155" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="40" y1="200" x2="580" y2="200" stroke="#cbd5e1" strokeWidth="1" />

                {/* Y-axis labels */}
                <text x="30" y="24" fill="#94a3b8" fontSize="10" textAnchor="end" fontFamily="monospace">250</text>
                <text x="30" y="69" fill="#94a3b8" fontSize="10" textAnchor="end" fontFamily="monospace">200</text>
                <text x="30" y="114" fill="#94a3b8" fontSize="10" textAnchor="end" fontFamily="monospace">150</text>
                <text x="30" y="159" fill="#94a3b8" fontSize="10" textAnchor="end" fontFamily="monospace">100</text>
                <text x="30" y="204" fill="#94a3b8" fontSize="10" textAnchor="end" fontFamily="monospace">50</text>

                {/* X-axis labels */}
                {['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'].map((m, i) => (
                  <text key={m} x={65 + i * 45} y="222" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">
                    {m}
                  </text>
                ))}

                {/* Line 1: Blue / Ekspor Mandiri */}
                <path
                  d="M 65 170 Q 110 50, 155 70 T 245 130 T 335 80 T 425 75 T 515 150 T 560 140"
                  fill="none"
                  stroke="#5458f7"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Line 2: Orange / Fasilitas KITE */}
                <path
                  d="M 65 190 Q 110 130, 155 120 T 245 150 T 335 125 T 425 150 T 515 130 T 560 170"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Line 3: Magenta / Asistensi DJBC */}
                <path
                  d="M 65 180 Q 110 160, 155 140 T 245 140 T 335 150 T 425 120 T 515 135 T 560 155"
                  fill="none"
                  stroke="#ec4899"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Milestone 1: 80% with pill badge (like mockup) */}
                <circle cx="155" cy="70" r="5" fill="#5458f7" stroke="#fff" strokeWidth="2" />
                <rect x="135" y="38" width="40" height="20" rx="5" fill="#1e255a" />
                <text x="155" y="52" fill="#fde047" fontSize="10" fontWeight="bold" textAnchor="middle">80%</text>
                <line x1="155" y1="58" x2="155" y2="65" stroke="#1e255a" strokeWidth="1.5" />

                {/* Milestone 2: 60% with pill badge */}
                <circle cx="280" cy="120" r="5" fill="#f97316" stroke="#fff" strokeWidth="2" />
                <rect x="260" y="88" width="40" height="20" rx="5" fill="#ea580c" />
                <text x="280" y="102" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">60%</text>
                <line x1="280" y1="108" x2="280" y2="115" stroke="#ea580c" strokeWidth="1.5" />

                {/* Milestone 3: 63% with pill badge */}
                <circle cx="425" cy="75" r="5" fill="#ec4899" stroke="#fff" strokeWidth="2" />
                <rect x="405" y="43" width="40" height="20" rx="5" fill="#be185d" />
                <text x="425" y="57" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">63%</text>
                <line x1="425" y1="63" x2="425" y2="70" stroke="#be185d" strokeWidth="1.5" />
              </svg>

              {/* Gradient DOWNLOAD button positioned at bottom right like mockup */}
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2 text-xs font-black tracking-wider text-white uppercase rounded-xl bg-gradient-to-r from-[#ec4899] via-[#f43f5e] to-[#fb7185] hover:opacity-95 shadow-md active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>DOWNLOAD LAPORAN</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2. PETA SEBARAN (Crisp White Card with rounded-3xl) */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-black tracking-wider text-slate-900 uppercase flex items-center gap-2">
                  <Globe2 className="w-5 h-5 text-blue-700" />
                  <span>PETA SEBARAN UMKM BINAAN NASIONAL</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sebaran titik koordinasi Kanwil DJBC pembina di seluruh kepulauan Indonesia
                </p>
              </div>
              <div className="text-xs font-bold text-blue-800 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                {selectedKanwilFilter}
              </div>
            </div>

            <IndonesiaMap />
          </div>

          {/* 3. ROW CARD 1: ANALYTIC (Matching ANALYTIC in Mockup) */}
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shrink-0 shadow-md">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black tracking-wider text-slate-900 uppercase">
                  ANALYTIC: KLASTERISASI STATUS EKSPOR
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Potensi: <strong className="text-slate-800">{klasterStats.potensi}</strong> ({klasterStats.potensiPct}%) · Siap: <strong className="text-slate-800">{klasterStats.siap}</strong> ({klasterStats.siapPct}%) · Telah: <strong className="text-emerald-700">{klasterStats.telah}</strong> ({klasterStats.telahPct}%)
                </p>
              </div>
            </div>

            {/* Indicator toggle buttons (↑ = ↓ like mockup) */}
            <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
              <button className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors">
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors">
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors">
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 4. ROW CARD 2: DYNAMIC (Matching DYNAMIC in Mockup) */}
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ec4899] to-[#f43f5e] flex items-center justify-center text-white font-black shrink-0 shadow-md">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black tracking-wider text-slate-900 uppercase">
                  DYNAMIC: TOP 10 HASIL PRODUKSI & KOMODITAS
                </h4>
                <p className="text-xs text-slate-500 mt-0.5 truncate max-w-md">
                  Kopi Arabika, Cokelat Biji Fermentasi, Rotan Sintetis, Briket Kelapa, Atsiri, Batik
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400">PERTUMBUHAN YoY</div>
                <div className="text-sm font-black text-emerald-600 font-mono">+18.5%</div>
              </div>

              {/* Indicator toggle buttons (↑ = ↓ like mockup) */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors">
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors">
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors">
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* 5. TOP 10 NEGARA TUJUAN & TOP 10 KOMODITAS DETAIL TABLES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Top 10 Negara Tujuan */}
            <div className="bg-white rounded-3xl p-5 shadow-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-xs font-black tracking-wider text-slate-900 uppercase flex items-center gap-1.5">
                  <Globe2 className="w-4 h-4 text-blue-700" />
                  <span>Top 10 Negara Tujuan</span>
                </h4>
                <span className="text-[10px] font-bold text-slate-400">Total Nilai FOB</span>
              </div>

              <div className="space-y-2">
                {top10NegaraTujuan.slice(0, 5).map((item, idx) => (
                  <div key={item.negara} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm">{item.flag}</span>
                      <div>
                        <div className="font-bold text-slate-900">{item.negara}</div>
                        <div className="text-[10px] text-slate-400">{item.kawasan} · {item.totalExporters} UMKM</div>
                      </div>
                    </div>
                    <div className="text-right font-mono font-bold text-blue-800">
                      ${(item.totalFobUsd).toLocaleString('en-US')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top 10 Hasil Produksi */}
            <div className="bg-white rounded-3xl p-5 shadow-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-xs font-black tracking-wider text-slate-900 uppercase flex items-center gap-1.5">
                  <PackageCheck className="w-4 h-4 text-amber-600" />
                  <span>Top 10 Hasil Produksi</span>
                </h4>
                <span className="text-[10px] font-bold text-slate-400">Kategori Unggulan</span>
              </div>

              <div className="space-y-2">
                {top10HasilProduksi.slice(0, 5).map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-[10px] shrink-0">
                        {item.ranking}
                      </span>
                      <div className="truncate">
                        <div className="font-bold text-slate-900 truncate" title={item.name}>{item.name}</div>
                        <div className="text-[10px] text-slate-400">{item.actualCount} UMKM Binaan</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold font-mono text-emerald-600 shrink-0">
                      {item.trend}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (1/3 WIDTH): DATA INPUT / LOG AKTIVITAS (Matching DATA INPUT card in Mockup) */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black tracking-wider text-slate-900 uppercase">
                DATA INPUT & AKTIVITAS
              </h3>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                Terverifikasi
              </span>
            </div>

            {/* FEATURED TOP HIGHLIGHT CARD (Deep Indigo/Blue Card with Stars as in mockup) */}
            <div className="bg-[#242c6f] text-white rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden space-y-3 border border-[#353f8e]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black flex items-center justify-center text-xs shadow-md">
                    BC
                  </div>
                  <div>
                    <h5 className="font-black text-xs tracking-wider text-white uppercase">
                      EKSPOR PERDANA UMKM
                    </h5>
                    <p className="text-[11px] text-amber-300 font-semibold">
                      PT Aroma Kopi Nusantara
                    </p>
                  </div>
                </div>

                {/* 3 Stars as shown in mockup */}
                <div className="flex items-center gap-0.5 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                </div>
              </div>

              <p className="text-xs text-blue-100/90 leading-relaxed">
                Realisasi pelepasan ekspor 1 kontainer (18 Ton) Kopi Arabika Specialty ke Amerika Serikat senilai FOB Rp 4,5 Milyar melalui Pelabuhan Tanjung Perak.
              </p>

              <div className="pt-2 border-t border-blue-400/20 flex items-center justify-between text-[10px] text-blue-200">
                <span>Kanwil DJBC Jawa Timur I</span>
                <span className="font-mono text-amber-300 font-bold">27 / 10 / 2026</span>
              </div>
            </div>

            {/* Subsequent Activity List Items matching UPDATE ONE in mockup */}
            <div className="space-y-4 pt-1">
              {/* Item 2 */}
              <div className="flex items-start gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  AS
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h6 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      ASISTENSI SERTIFIKASI
                    </h6>
                    <span className="text-[10px] font-mono text-slate-400">26 / 10 / 26</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-snug">
                    Pendampingan pengurusan HACCP dan uji laboratorium mutu komoditas vanili organik binaan.
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                    Kanwil DJBC Bali & Nusra
                  </span>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-start gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  ND
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h6 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      NOTA DINAS PELAPORAN
                    </h6>
                    <span className="text-[10px] font-mono text-slate-400">25 / 10 / 26</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-snug">
                    ND-104/WBC.02/2026 Laporan Triwulan III telah diajukan dan menunggu verifikasi pusat.
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                    Kanwil DJBC Sumatera Utara
                  </span>
                </div>
              </div>

              {/* Item 4 */}
              <div className="flex items-start gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  KL
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h6 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      UPGRADE KLASTER EKSPOR
                    </h6>
                    <span className="text-[10px] font-mono text-slate-400">24 / 10 / 26</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-snug">
                    CV Rotan Jepara Lestari resmi ditingkatkan dari Potensi Ekspor ke Siap Ekspor setelah kurasi buyer.
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Kanwil DJBC Jateng & DIY
                  </span>
                </div>
              </div>
            </div>

            {/* Scroll Down Arrow indicator as shown at bottom of DATA INPUT in mockup */}
            <div className="flex justify-center pt-2">
              <button
                onClick={() => setActiveTab('asistensi')}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors shadow-xs"
                title="Lihat seluruh log aktivitas asistensi"
              >
                <ArrowDown className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
