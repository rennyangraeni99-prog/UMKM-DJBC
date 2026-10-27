import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Building2,
  FileText,
  ClipboardCheck,
  ShieldCheck,
  Lock,
  Building,
  UserCheck,
  LogOut,
  ArrowRightLeft,
  Sparkles,
  HardDrive
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    umkmList,
    asistensiLogs,
    pelaporanList,
    setIsSwitchUserModalOpen,
    logout
  } = useApp();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'DASHBOARD',
      subtitle: 'Analisis Ekspor & Sebaran',
      icon: <LayoutDashboard className="w-5 h-5" />,
      count: null
    },
    {
      id: 'umkm',
      label: 'DATABASE UMKM',
      subtitle: 'Basis Data Profil Usaha',
      icon: <Building2 className="w-5 h-5" />,
      count: umkmList.length
    },
    {
      id: 'asistensi',
      label: 'ASISTENSI UMKM',
      subtitle: 'Data Pendampingan',
      icon: <FileText className="w-5 h-5" />,
      count: asistensiLogs.length
    },
    {
      id: 'pelaporan',
      label: 'KEPATUHAN KANWIL',
      subtitle: 'Checklist TW I - IV',
      icon: <ClipboardCheck className="w-5 h-5" />,
      count: pelaporanList.filter(p => p.status === 'Terverifikasi' || p.status === 'Sudah Dilaporkan').length
    },
    {
      id: 'drive',
      label: 'GOOGLE DRIVE',
      subtitle: 'Dokumen Ekspor Cloud',
      icon: <HardDrive className="w-5 h-5" />,
      count: null
    },
    {
      id: 'rbac',
      label: 'HAK AKSES RBAC',
      subtitle: 'Hak Akses & Audit Log',
      icon: <ShieldCheck className="w-5 h-5" />,
      count: null
    }
  ] as const;

  return (
    <aside className="w-64 bg-[#181d45] border-r border-[#262f6b] flex flex-col shrink-0 min-h-[calc(100vh-61px)] text-white select-none">
      {/* Scope banner if operator */}
      {currentUser.role === 'operator_kanwil' && currentUser.kanwilAssignment && (
        <div className="mx-4 mt-4 p-3 bg-[#1f2863] border border-amber-400/40 rounded-xl text-xs">
          <div className="flex items-center gap-1.5 text-amber-300 font-bold">
            <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Scope Wilayah Terbatas</span>
          </div>
          <p className="text-[11px] text-blue-100 mt-1 leading-snug font-medium">
            {currentUser.kanwilAssignment}
          </p>
        </div>
      )}

      {currentUser.role === 'viewer' && (
        <div className="mx-4 mt-4 p-3 bg-[#1d2458] border border-blue-400/30 rounded-xl text-xs">
          <div className="flex items-center gap-1.5 text-blue-200 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Mode Pimpinan Eksekutif</span>
          </div>
          <p className="text-[11px] text-blue-200/80 mt-1 leading-snug">
            Akses analitik, pemantauan kendala, dan cetak laporan eksekutif.
          </p>
        </div>
      )}

      {/* Navigation Links matching reference image mockup */}
      <nav className="p-4 space-y-2 flex-1">
        <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-blue-300/70">
          MENU UTAMA
        </div>
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-left transition-all relative ${
                isActive
                  ? 'bg-[#293275] text-white font-bold shadow-lg ring-1 ring-amber-400/40'
                  : 'text-blue-200 hover:bg-[#20275e] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span className={isActive ? 'text-amber-400' : 'text-blue-300'}>
                  {item.icon}
                </span>
                <div className="truncate">
                  <div className="text-xs font-black tracking-wide leading-tight truncate">{item.label}</div>
                  <div className={`text-[10px] leading-tight truncate mt-0.5 ${isActive ? 'text-blue-200' : 'text-blue-300/70'}`}>
                    {item.subtitle}
                  </div>
                </div>
              </div>

              {/* Active Dot Indicator as shown in reference mockup */}
              {isActive ? (
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)] shrink-0 ml-2 animate-pulse" />
              ) : item.count !== null ? (
                <span className="text-[10px] font-mono tabular-nums px-2 py-0.5 rounded-full font-bold bg-[#14183a] text-blue-300 border border-[#2b3577]">
                  {item.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Bottom Promo / Upgrade-style Card matching reference mockup */}
      <div className="p-4 border-t border-[#262f6b] bg-[#14183a]/80 space-y-3">
        <div className="p-3 bg-[#1d2459] rounded-2xl border border-[#2c3679] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black flex items-center justify-center text-xs shadow-md">
                {currentUser.avatarText}
              </span>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate max-w-[110px]" title={currentUser.name}>
                  {currentUser.name.split(',')[0]}
                </div>
                <div className="text-[10px] text-amber-300 font-semibold truncate">
                  {currentUser.roleTitle}
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              title="Keluar ke Portal"
              className="text-blue-300 hover:text-rose-400 p-1 rounded-lg hover:bg-[#252f70] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[10px] text-blue-200/80 leading-relaxed">
            Sistem Informasi Asistensi & Monitoring Ekspor UMKM Terpadu DJBC.
          </p>

          {/* Eye-catching gradient action button like UPGRADE in mockup */}
          <button
            onClick={() => setIsSwitchUserModalOpen(true)}
            className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-xs tracking-wider rounded-xl uppercase shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>SWITCH USER</span>
          </button>
        </div>

        {/* Small Directorate footer line */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-blue-300/70 font-medium">
          <Building className="w-3 h-3 text-amber-400" />
          <span>Ditjen Bea dan Cukai · Kemenkeu RI</span>
        </div>
      </div>
    </aside>
  );
};
