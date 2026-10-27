import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  ShieldCheck,
  Users,
  Lock,
  Check,
  X,
  History,
  Building,
  KeyRound,
  RefreshCw,
  Info
} from 'lucide-react';

export const UserManagementModule: React.FC = () => {
  const {
    currentUser,
    switchUser,
    usersList,
    auditLogs,
    resetDemoData,
    setIsSwitchUserModalOpen
  } = useApp();

  const permissionsMatrix = [
    {
      feature: 'Lihat Executive Dashboard & Peta Analitik',
      superadmin: true,
      operator: true,
      viewer: true
    },
    {
      feature: 'Kelola & Edit Database UMKM Binaan DJBC (Tambah/Edit/Hapus)',
      superadmin: true,
      operator: false,
      viewer: false
    },
    {
      feature: 'Lihat & Ekspor Data Database UMKM Binaan DJBC',
      superadmin: true,
      operator: true,
      viewer: true
    },
    {
      feature: 'Pencatatan Activity Log Asistensi',
      superadmin: true,
      operator: true,
      viewer: false
    },
    {
      feature: 'Input & Edit Metrik Transaksi Ekspor (FOB)',
      superadmin: true,
      operator: true,
      viewer: false
    },
    {
      feature: 'Pengajuan Nota Dinas Laporan Triwulan Kanwil',
      superadmin: true,
      operator: true,
      viewer: false
    },
    {
      feature: 'Verifikasi Resmi Laporan Triwulan (Pusat)',
      superadmin: true,
      operator: false,
      viewer: false
    },
    {
      feature: 'Ekspor Data CSV & Cetak Ringkasan PDF',
      superadmin: true,
      operator: true,
      viewer: true
    },
    {
      feature: 'Audit Log & Konfigurasi Sistem',
      superadmin: true,
      operator: false,
      viewer: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Module Title: Kemenkeu Blue & Gold Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#191e4a] border border-[#2b3577] rounded-3xl text-white shadow-xl">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2.5">
            <span>MANAJEMEN PENGGUNA & HAK AKSES (RBAC)</span>
            <span className="text-xs font-bold text-slate-950 bg-amber-400 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              3 Peran Aktif
            </span>
          </h2>
          <p className="text-xs text-blue-200 mt-1">
            Pengelolaan 3 level hak akses (Superadmin Pusat, Operator Kanwil/Satker, Viewer/Pimpinan) serta jejak audit sistem.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsSwitchUserModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all shadow-md active:scale-95"
          >
            <KeyRound className="w-3.5 h-3.5 stroke-[2.5]" />
            Switch User Portal
          </button>
          <button
            onClick={resetDemoData}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-blue-100 bg-[#252f70] hover:bg-[#2d3988] border border-[#35439a] rounded-xl transition-all shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            Reset Nilai Simulasi
          </button>
        </div>
      </div>

      {/* Role Switcher Sandbox Cards */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-blue-700" />
            Simulator Beralih Hak Akses (Live Role Switcher)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Klik salah satu akun di bawah untuk menguji batasan dan tampilan antarmuka sesuai peran masing-masing:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {usersList.map((user) => {
            const isActive = user.id === currentUser.id;
            return (
              <div
                key={user.id}
                onClick={() => switchUser(user.id)}
                className={`cursor-pointer p-4 rounded-xl border transition-all text-left flex flex-col justify-between ${
                  isActive
                    ? 'border-blue-700 bg-blue-50/50 shadow-sm ring-1 ring-blue-700'
                    : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                      {user.avatarText}
                    </span>
                    {isActive ? (
                      <span className="text-[10px] font-semibold text-blue-800 bg-blue-100/80 px-2 py-0.5 rounded">
                        Sedang Aktif
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-medium">
                        Klik untuk Aktifkan
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs truncate" title={user.name}>
                    {user.name}
                  </h4>
                  <p className="text-[11px] text-blue-700 font-medium mt-0.5">{user.roleTitle}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">{user.email}</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/60 text-[10px] text-slate-500">
                  {user.kanwilAssignment ? (
                    <span>Scope: <strong>{user.kanwilAssignment}</strong></span>
                  ) : (
                    <span>Scope: <strong>Nasional (Semua Kanwil)</strong></span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RBAC Matrix Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/70">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-700" />
            Matriks Hak Akses & Kewenangan (Role Permission Matrix)
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4 w-1/2">Fungsi / Kapabilitas Sistem</th>
                <th className="py-3 px-4 text-center">Superadmin / Pusat</th>
                <th className="py-3 px-4 text-center">Operator Kanwil</th>
                <th className="py-3 px-4 text-center">Viewer / Pimpinan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissionsMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {item.feature}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {item.superadmin ? (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-400">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {item.operator ? (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-400">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {item.viewer ? (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-400">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live System Audit Trail */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <History className="w-4 h-4 text-slate-700" />
            Jejak Audit Aktivitas Pengguna (System Audit Log)
          </h4>
          <span className="text-[11px] text-slate-400 font-mono">Terekam {auditLogs.length} Aktivitas</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Waktu (WIB)</th>
                <th className="py-3 px-4">Nama Pengguna & Peran</th>
                <th className="py-3 px-4">Modul</th>
                <th className="py-3 px-4">Aksi</th>
                <th className="py-3 px-4">Detail Aktivitas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono tabular-nums text-slate-600">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{log.userName}</div>
                    <div className="text-[10px] text-slate-400">{log.userRole}</div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700">
                    {log.module}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
