import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import {
  ShieldCheck,
  Building2,
  Users,
  Check,
  ArrowRight,
  LogOut,
  Sparkles,
  Lock
} from 'lucide-react';

export const SwitchUserModal: React.FC = () => {
  const {
    isSwitchUserModalOpen,
    setIsSwitchUserModalOpen,
    currentUser,
    switchUser,
    usersList,
    logout
  } = useApp();

  if (!isSwitchUserModalOpen) return null;

  return (
    <Modal
      isOpen={isSwitchUserModalOpen}
      onClose={() => setIsSwitchUserModalOpen(false)}
      title="Beralih Pengguna & Hak Akses (Switch User)"
      subtitle="Pilih profil pengguna untuk menguji dan mensimulasikan kontrol akses peran (RBAC) pada sistem."
      maxWidth="2xl"
    >
      <div className="space-y-4 text-xs">
        {/* Current User Active Indicator */}
        <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-sm">
              {currentUser.avatarText}
            </span>
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider block">
                Akun Aktif Saat Ini
              </span>
              <span className="font-bold text-slate-900 text-sm block">
                {currentUser.name}
              </span>
              <span className="text-slate-600 text-xs">
                {currentUser.roleTitle}
              </span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            Sedang Aktif
          </span>
        </div>

        {/* List of Available Roles to Switch To */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block px-1">
            Daftar Profil & Hak Akses Tersedia:
          </span>

          <div className="grid grid-cols-1 gap-2.5">
            {usersList.map((user) => {
              const isActive = user.id === currentUser.id;

              return (
                <div
                  key={user.id}
                  onClick={() => !isActive && switchUser(user.id)}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isActive
                      ? 'bg-slate-50 border-slate-300 ring-1 ring-slate-300/50 cursor-default'
                      : 'bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 cursor-pointer shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {user.avatarText}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm">
                          {user.name}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                            user.role === 'superadmin'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : user.role === 'operator_kanwil'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-purple-50 text-purple-700 border-purple-200'
                          }`}
                        >
                          {user.role === 'superadmin'
                            ? 'Superadmin'
                            : user.role === 'operator_kanwil'
                            ? 'Operator Kanwil'
                            : 'Viewer'}
                        </span>
                      </div>

                      <p className="text-slate-600 text-xs mt-0.5">{user.email}</p>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-medium">
                        <span>Wilayah: <strong>{user.kanwilAssignment || 'Nasional / Seluruh Kanwil'}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {user.role === 'superadmin'
                            ? 'Kelola Database UMKM Binaan DJBC & Verifikasi'
                            : user.role === 'operator_kanwil'
                            ? 'Input Asistensi & Nota Dinas Wilayah'
                            : 'Mode Monitoring & Read-Only'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end shrink-0">
                    {isActive ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold px-3 py-1 bg-emerald-50 rounded-lg text-xs border border-emerald-200">
                        <Check className="w-3.5 h-3.5" />
                        Profil Digunakan
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          switchUser(user.id);
                        }}
                        className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <span>Ganti Akun</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer with Logout to Portal Login option */}
        <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              setIsSwitchUserModalOpen(false);
              logout();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar ke Portal Login</span>
          </button>

          <button
            type="button"
            onClick={() => setIsSwitchUserModalOpen(false)}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium text-xs transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </Modal>
  );
};
