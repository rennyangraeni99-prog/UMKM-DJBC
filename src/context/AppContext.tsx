import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UMKMEntity,
  ActivityLogAsistensi,
  MetricEkspor,
  PelaporanTriwulanKanwil,
  UserProfile,
  UserRole,
  AuditLog
} from '../types';
import {
  INITIAL_UMKM,
  INITIAL_ASISTENSI_LOGS,
  INITIAL_METRIC_EKSPOR,
  INITIAL_PELAPORAN_KANWIL,
  INITIAL_AUDIT_LOGS,
  MOCK_USERS
} from '../data/mockData';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface AppContextType {
  // Current user & role
  currentUser: UserProfile;
  switchUser: (userId: string) => void;
  usersList: UserProfile[];
  
  // Auth & Session
  isAuthenticated: boolean;
  login: (userId: string) => void;
  logout: () => void;
  isSwitchUserModalOpen: boolean;
  setIsSwitchUserModalOpen: (open: boolean) => void;
  
  // Navigation
  activeTab: 'dashboard' | 'umkm' | 'asistensi' | 'pelaporan' | 'drive' | 'rbac';
  setActiveTab: (tab: 'dashboard' | 'umkm' | 'asistensi' | 'pelaporan' | 'drive' | 'rbac') => void;

  // Selected filters
  selectedKanwilFilter: string;
  setSelectedKanwilFilter: (kanwil: string) => void;

  // UMKM Master Data
  umkmList: UMKMEntity[];
  addUmkm: (umkm: Omit<UMKMEntity, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateUmkm: (id: string, updated: Partial<UMKMEntity>) => void;
  deleteUmkm: (id: string) => void;

  // Asistensi Logs
  asistensiLogs: ActivityLogAsistensi[];
  addAsistensiLog: (log: Omit<ActivityLogAsistensi, 'id' | 'createdAt'>) => void;
  updateAsistensiLog: (id: string, updated: Partial<ActivityLogAsistensi>) => void;
  deleteAsistensiLog: (id: string) => void;

  // Metric Ekspor
  metricEksporList: MetricEkspor[];
  addMetricEkspor: (metric: Omit<MetricEkspor, 'id'>) => void;
  updateMetricEkspor: (id: string, updated: Partial<MetricEkspor>) => void;
  deleteMetricEkspor: (id: string) => void;

  // Pelaporan Kanwil
  pelaporanList: PelaporanTriwulanKanwil[];
  submitLaporanKanwil: (laporan: Omit<PelaporanTriwulanKanwil, 'id'>) => void;
  verifikasiLaporan: (id: string, catatan: string) => void;

  // Audit Logs
  auditLogs: AuditLog[];
  logAuditAction: (action: string, module: string, details: string) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Reset to initial demo data
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Active User State
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('sim_umkm_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return MOCK_USERS[0];
      }
    }
    return MOCK_USERS[0]; // Default Superadmin
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('sim_umkm_auth');
    return saved !== null ? saved === 'true' : true;
  });
  const [isSwitchUserModalOpen, setIsSwitchUserModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'umkm' | 'asistensi' | 'pelaporan' | 'drive' | 'rbac'>('dashboard');
  const [selectedKanwilFilter, setSelectedKanwilFilter] = useState<string>('Semua Kanwil');

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // UMKM Master Data
  const [umkmList, setUmkmList] = useState<UMKMEntity[]>(() => {
    const saved = localStorage.getItem('sim_umkm_master_data_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch { return INITIAL_UMKM; }
    }
    return INITIAL_UMKM;
  });

  // Asistensi Logs
  const [asistensiLogs, setAsistensiLogs] = useState<ActivityLogAsistensi[]>(() => {
    const saved = localStorage.getItem('sim_umkm_asistensi_logs_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch { return INITIAL_ASISTENSI_LOGS; }
    }
    return INITIAL_ASISTENSI_LOGS;
  });

  // Metric Ekspor
  const [metricEksporList, setMetricEksporList] = useState<MetricEkspor[]>(() => {
    const saved = localStorage.getItem('sim_umkm_metric_ekspor');
    if (saved) {
      try { return JSON.parse(saved); } catch { return INITIAL_METRIC_EKSPOR; }
    }
    return INITIAL_METRIC_EKSPOR;
  });

  // Pelaporan Kanwil
  const [pelaporanList, setPelaporanList] = useState<PelaporanTriwulanKanwil[]>(() => {
    const saved = localStorage.getItem('sim_umkm_pelaporan_kanwil');
    if (saved) {
      try { return JSON.parse(saved); } catch { return INITIAL_PELAPORAN_KANWIL; }
    }
    return INITIAL_PELAPORAN_KANWIL;
  });

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('sim_umkm_audit_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch { return INITIAL_AUDIT_LOGS; }
    }
    return INITIAL_AUDIT_LOGS;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('sim_umkm_master_data_v2', JSON.stringify(umkmList));
  }, [umkmList]);

  useEffect(() => {
    localStorage.setItem('sim_umkm_asistensi_logs_v2', JSON.stringify(asistensiLogs));
  }, [asistensiLogs]);

  useEffect(() => {
    localStorage.setItem('sim_umkm_metric_ekspor', JSON.stringify(metricEksporList));
  }, [metricEksporList]);

  useEffect(() => {
    localStorage.setItem('sim_umkm_pelaporan_kanwil', JSON.stringify(pelaporanList));
  }, [pelaporanList]);

  useEffect(() => {
    localStorage.setItem('sim_umkm_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('sim_umkm_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Log Audit Action Helper
  const logAuditAction = (action: string, module: string, details: string) => {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userName: currentUser.name,
      userRole: currentUser.roleTitle,
      module,
      action,
      details
    };
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  };

  // Auth Login / Logout
  const login = (userId: string) => {
    const target = MOCK_USERS.find((u) => u.id === userId) || MOCK_USERS[0];
    setCurrentUser(target);
    setIsAuthenticated(true);
    localStorage.setItem('sim_umkm_auth', 'true');
    localStorage.setItem('sim_umkm_current_user', JSON.stringify(target));
    if (target.role === 'operator_kanwil' && target.kanwilAssignment) {
      setSelectedKanwilFilter(target.kanwilAssignment);
    } else {
      setSelectedKanwilFilter('Semua Kanwil');
    }
    addToast(`Selamat datang, ${target.name.split(',')[0]}`, 'success');
    logAuditAction('LOGIN', 'Autentikasi', `Pengguna ${target.name} (${target.roleTitle}) berhasil masuk.`);
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('sim_umkm_auth', 'false');
    logAuditAction('LOGOUT', 'Autentikasi', `Pengguna ${currentUser.name} keluar dari sistem.`);
    addToast('Anda telah keluar dari Portal SIM-Asistensi Ekspor DJBC.', 'info');
  };

  // Switch User
  const switchUser = (userId: string) => {
    const target = MOCK_USERS.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
      setIsAuthenticated(true);
      localStorage.setItem('sim_umkm_auth', 'true');
      localStorage.setItem('sim_umkm_current_user', JSON.stringify(target));
      if (target.role === 'operator_kanwil' && target.kanwilAssignment) {
        setSelectedKanwilFilter(target.kanwilAssignment);
      } else {
        setSelectedKanwilFilter('Semua Kanwil');
      }
      setIsSwitchUserModalOpen(false);
      addToast(`Beralih profil ke: ${target.name.split(',')[0]} (${target.roleTitle})`, 'info');
      logAuditAction('SWITCH_ROLE', 'RBAC', `Beralih ke hak akses ${target.roleTitle}`);
    }
  };

  // UMKM CRUD
  const addUmkm = (umkmData: Omit<UMKMEntity, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString().substring(0, 10);
    const newId = `umkm-${String(umkmList.length + 1).padStart(3, '0')}`;
    const newEntity: UMKMEntity = {
      ...umkmData,
      id: newId,
      createdAt: now,
      updatedAt: now
    };
    setUmkmList((prev) => [newEntity, ...prev]);
    logAuditAction('CREATE', 'Master Data UMKM', `Menambahkan UMKM baru: ${newEntity.namaUmkm}`);
    addToast(`Data UMKM "${newEntity.namaUmkm}" berhasil disimpan.`, 'success');
  };

  const updateUmkm = (id: string, updated: Partial<UMKMEntity>) => {
    const now = new Date().toISOString().substring(0, 10);
    setUmkmList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated, updatedAt: now } : item))
    );
    const target = umkmList.find((u) => u.id === id);
    logAuditAction('UPDATE', 'Master Data UMKM', `Memperbarui data ${target?.namaUmkm || id}`);
    addToast('Data UMKM berhasil diperbarui.', 'success');
  };

  const deleteUmkm = (id: string) => {
    const target = umkmList.find((u) => u.id === id);
    setUmkmList((prev) => prev.filter((item) => item.id !== id));
    logAuditAction('DELETE', 'Master Data UMKM', `Menghapus data ${target?.namaUmkm || id}`);
    addToast(`Data UMKM ${target?.namaUmkm || id} telah dihapus.`, 'warning');
  };

  // Asistensi CRUD
  const addAsistensiLog = (logData: Omit<ActivityLogAsistensi, 'id' | 'createdAt'>) => {
    const now = new Date().toISOString().substring(0, 10);
    const newId = `ast-${String(asistensiLogs.length + 1).padStart(3, '0')}`;
    const newLog: ActivityLogAsistensi = {
      ...logData,
      id: newId,
      createdAt: now
    };
    setAsistensiLogs((prev) => [newLog, ...prev]);
    logAuditAction('CREATE', 'Asistensi & Pendampingan', `Input log asistensi untuk ${newLog.umkmNama}`);
    addToast(`Log asistensi ${newLog.jenisAsistensi} berhasil dicatat.`, 'success');
  };

  const updateAsistensiLog = (id: string, updated: Partial<ActivityLogAsistensi>) => {
    setAsistensiLogs((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
    logAuditAction('UPDATE', 'Asistensi & Pendampingan', `Update progres asistensi ${id}`);
    addToast('Progres asistensi berhasil diperbarui.', 'success');
  };

  const deleteAsistensiLog = (id: string) => {
    setAsistensiLogs((prev) => prev.filter((item) => item.id !== id));
    logAuditAction('DELETE', 'Asistensi & Pendampingan', `Menghapus log asistensi ID ${id}`);
    addToast('Log asistensi berhasil dihapus.', 'info');
  };

  // Metric Ekspor CRUD
  const addMetricEkspor = (metricData: Omit<MetricEkspor, 'id'>) => {
    const newId = `m-${String(metricEksporList.length + 1).padStart(3, '0')}`;
    const newMetric: MetricEkspor = {
      ...metricData,
      id: newId
    };
    setMetricEksporList((prev) => [newMetric, ...prev]);
    logAuditAction('CREATE', 'Metric Ekspor', `Pencatatan transaksi ekspor ${newMetric.umkmNama}`);
    addToast(`Data metrik ekspor untuk ${newMetric.umkmNama} berhasil ditambahkan.`, 'success');
  };

  const updateMetricEkspor = (id: string, updated: Partial<MetricEkspor>) => {
    setMetricEksporList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
    logAuditAction('UPDATE', 'Metric Ekspor', `Memperbarui metrik ekspor ID ${id}`);
    addToast('Metrik performa ekspor berhasil diperbarui.', 'success');
  };

  const deleteMetricEkspor = (id: string) => {
    setMetricEksporList((prev) => prev.filter((item) => item.id !== id));
    logAuditAction('DELETE', 'Metric Ekspor', `Menghapus metrik ekspor ID ${id}`);
    addToast('Data metrik ekspor dihapus.', 'info');
  };

  // Pelaporan Kanwil
  const submitLaporanKanwil = (laporanData: Omit<PelaporanTriwulanKanwil, 'id'>) => {
    const newId = `rep-${Date.now()}`;
    const newLaporan: PelaporanTriwulanKanwil = {
      ...laporanData,
      id: newId
    };
    setPelaporanList((prev) => [newLaporan, ...prev]);
    logAuditAction('SUBMIT', 'Kepatuhan Pelaporan', `Pengajuan Nota Dinas ${newLaporan.nomorNotaDinas} (${newLaporan.kanwilNama})`);
    addToast(`Laporan ${newLaporan.kuartal} ${newLaporan.kanwilNama} dengan Nota Dinas berhasil diajukan.`, 'success');
  };

  const verifikasiLaporan = (id: string, catatan: string) => {
    setPelaporanList((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'Terverifikasi',
              catatanReviuPusat: catatan || 'Terverifikasi oleh Kantor Pusat tanpa catatan revisi.',
              diverifikasiOleh: currentUser.name
            }
          : item
      )
    );
    logAuditAction('VERIFY', 'Kepatuhan Pelaporan', `Verifikasi Laporan Triwulan ID ${id}`);
    addToast('Laporan Kanwil berhasil diverifikasi oleh Kantor Pusat.', 'success');
  };

  // Reset Demo Data
  const resetDemoData = () => {
    setUmkmList(INITIAL_UMKM);
    setAsistensiLogs(INITIAL_ASISTENSI_LOGS);
    setMetricEksporList(INITIAL_METRIC_EKSPOR);
    setPelaporanList(INITIAL_PELAPORAN_KANWIL);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    localStorage.removeItem('sim_umkm_master_data');
    localStorage.removeItem('sim_umkm_asistensi_logs');
    localStorage.removeItem('sim_umkm_metric_ekspor');
    localStorage.removeItem('sim_umkm_pelaporan_kanwil');
    localStorage.removeItem('sim_umkm_audit_logs');
    addToast('Data simulasi telah di-reset ke nilai default standar.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchUser,
        usersList: MOCK_USERS,
        isAuthenticated,
        login,
        logout,
        isSwitchUserModalOpen,
        setIsSwitchUserModalOpen,
        activeTab,
        setActiveTab,
        selectedKanwilFilter,
        setSelectedKanwilFilter,
        umkmList,
        addUmkm,
        updateUmkm,
        deleteUmkm,
        asistensiLogs,
        addAsistensiLog,
        updateAsistensiLog,
        deleteAsistensiLog,
        metricEksporList,
        addMetricEkspor,
        updateMetricEkspor,
        deleteMetricEkspor,
        pelaporanList,
        submitLaporanKanwil,
        verifikasiLaporan,
        auditLogs,
        logAuditAction,
        toasts,
        addToast,
        removeToast,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
