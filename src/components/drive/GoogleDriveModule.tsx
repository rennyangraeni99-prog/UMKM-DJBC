import React, { useState, useEffect, useRef } from 'react';
import {
  initAuth,
  googleSignIn,
  logoutGoogle,
  getAccessToken
} from '../../services/googleDriveAuth';
import {
  listDriveFiles,
  uploadFileToDrive,
  saveReportToDrive,
  deleteDriveFile,
  getDriveAbout,
  findOrCreateDJBCFolder,
  DriveFile,
  DriveStorageInfo
} from '../../services/googleDriveService';
import { useApp } from '../../context/AppContext';
import { GoogleSignInButton } from '../common/GoogleSignInButton';
import {
  HardDrive,
  Cloud,
  Upload,
  FileText,
  FileCheck2,
  Trash2,
  ExternalLink,
  RefreshCw,
  Search,
  FolderPlus,
  AlertTriangle,
  Database,
  CheckCircle2,
  ShieldAlert,
  DownloadCloud,
  File,
  FileSpreadsheet,
  FileImage,
  Folder
} from 'lucide-react';
import type { User as FirebaseUser } from 'firebase/auth';

export const GoogleDriveModule: React.FC = () => {
  const { umkmList, asistensiLogs, addToast, currentUser } = useApp();

  const [googleUser, setGoogleUser] = useState<FirebaseUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);

  const [storageInfo, setStorageInfo] = useState<DriveStorageInfo | null>(null);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'peb' | 'halal' | 'nib' | 'laporan'>('all');

  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState<'peb' | 'halal' | 'nib' | 'laporan' | 'other'>('peb');
  const [uploadNotes, setUploadNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Backup modal / state
  const [isBackingUp, setIsBackingUp] = useState(false);

  // Destructive delete confirmation modal state (MANDATORY)
  const [fileToDelete, setFileToDelete] = useState<DriveFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Listen for Google Auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, userToken) => {
        setGoogleUser(user);
        setToken(userToken);
        setIsInitializing(false);
      },
      () => {
        setGoogleUser(null);
        setToken(null);
        setIsInitializing(false);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Fetch Drive files and info when token is present
  useEffect(() => {
    if (token) {
      loadDriveData();
    }
  }, [token]);

  const loadDriveData = async () => {
    setIsLoadingFiles(true);
    try {
      const [fileList, aboutInfo] = await Promise.all([
        listDriveFiles(),
        getDriveAbout().catch(() => null)
      ]);
      setFiles(fileList);
      if (aboutInfo) setStorageInfo(aboutInfo);
    } catch (err: any) {
      console.error('Error loading Google Drive files:', err);
      addToast(err.message || 'Gagal memuat file dari Google Drive', 'error');
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleUser(result.user);
        setToken(result.accessToken);
        addToast(`Berhasil menghubungkan Google Drive (${result.user.email})`, 'success');
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      addToast(err.message || 'Gagal login dengan akun Google', 'error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogout = async () => {
    try {
      await logoutGoogle();
      setGoogleUser(null);
      setToken(null);
      setFiles([]);
      setStorageInfo(null);
      addToast('Koneksi Google Drive telah diputuskan', 'info');
    } catch (err: any) {
      console.error('Logout error:', err);
      addToast('Gagal memutuskan Google Drive', 'error');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setIsUploadModalOpen(true);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const folderId = await findOrCreateDJBCFolder();
      const prefix = `[${uploadCategory.toUpperCase()}] `;
      const targetFileName = `${prefix}${selectedFile.name}`;

      await uploadFileToDrive(selectedFile, folderId, uploadNotes, targetFileName);
      addToast(`Dokumen '${targetFileName}' berhasil diunggah ke Google Drive!`, 'success');

      setIsUploadModalOpen(false);
      setSelectedFile(null);
      setUploadNotes('');
      if (fileInputRef.current) fileInputRef.current.value = '';

      await loadDriveData();
    } catch (err: any) {
      console.error('Upload error:', err);
      addToast(err.message || 'Gagal mengunggah file ke Google Drive', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleBackupDatabaseToDrive = async () => {
    setIsBackingUp(true);
    try {
      const folderId = await findOrCreateDJBCFolder();
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `Backup_SIM_UMKM_DJBC_${timestamp}.json`;

      const backupPayload = {
        metadata: {
          title: 'Rekapitulasi Basis Data & Asistensi UMKM Ekspor DJBC',
          timestamp: new Date().toISOString(),
          exportedBy: currentUser.name,
          role: currentUser.role,
          totalUmkm: umkmList.length,
          totalAsistensi: asistensiLogs.length
        },
        umkmData: umkmList,
        asistensiData: asistensiLogs
      };

      await saveReportToDrive(
        fileName,
        JSON.stringify(backupPayload, null, 2),
        'application/json',
        folderId
      );

      addToast(`Backup berhasil disimpan ke folder 'DJBC - Dokumen Ekspor UMKM' di Google Drive!`, 'success');
      await loadDriveData();
    } catch (err: any) {
      console.error('Backup error:', err);
      addToast(err.message || 'Gagal menyimpan backup ke Google Drive', 'error');
    } finally {
      setIsBackingUp(false);
    }
  };

  // Explicit confirmation before destructive delete
  const confirmDeleteFile = async () => {
    if (!fileToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDriveFile(fileToDelete.id);
      addToast(`File '${fileToDelete.name}' berhasil dihapus dari Google Drive`, 'success');
      setFileToDelete(null);
      await loadDriveData();
    } catch (err: any) {
      console.error('Delete error:', err);
      addToast(err.message || 'Gagal menghapus file dari Google Drive', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatFileSize = (bytes?: string) => {
    if (!bytes) return '-';
    const num = parseInt(bytes, 10);
    if (isNaN(num)) return '-';
    if (num < 1024) return `${num} B`;
    if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
    return `${(num / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatQuota = (usageBytes?: string, limitBytes?: string) => {
    if (!usageBytes) return null;
    const usageNum = parseInt(usageBytes, 10);
    const limitNum = limitBytes ? parseInt(limitBytes, 10) : 0;
    const usageGb = (usageNum / (1024 * 1024 * 1024)).toFixed(2);
    const limitGb = limitNum > 0 ? (limitNum / (1024 * 1024 * 1024)).toFixed(1) : 'Tak terbatas';
    const percent = limitNum > 0 ? Math.min(100, Math.round((usageNum / limitNum) * 100)) : 0;

    return { usageGb, limitGb, percent };
  };

  const getFileIcon = (mimeType: string, name: string) => {
    if (mimeType.includes('folder')) return <Folder className="w-5 h-5 text-amber-400" />;
    if (mimeType.includes('pdf')) return <FileText className="w-5 h-5 text-rose-400" />;
    if (mimeType.includes('sheet') || name.endsWith('.xlsx') || name.endsWith('.csv'))
      return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
    if (mimeType.includes('image')) return <FileImage className="w-5 h-5 text-sky-400" />;
    return <File className="w-5 h-5 text-blue-300" />;
  };

  const filteredFiles = files.filter((f) => {
    const matchesSearch =
      searchQuery === '' ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.description && f.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      categoryFilter === 'all' ||
      f.category === categoryFilter ||
      f.name.toLowerCase().includes(`[${categoryFilter.toUpperCase()}]`);

    return matchesSearch && matchesCategory;
  });

  const quota = formatQuota(storageInfo?.usage, storageInfo?.limit);

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-[#1c2356] via-[#212b6b] to-[#1a2153] border border-[#2d3a82] rounded-3xl p-6 lg:p-8 shadow-xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 bg-amber-400 text-slate-950 rounded-2xl shadow-md flex items-center justify-center">
                <HardDrive className="w-6 h-6 stroke-[2.2]" />
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  Repositori Dokumen Google Drive
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    DJBC Cloud Drive
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-blue-200/90 font-medium mt-0.5">
                  Pengelolaan dokumen kepabeanan ekspor (PEB, Invoice, Sertifikat Halal, NIB & Rekap Laporan) terintegrasi Google Drive.
                </p>
              </div>
            </div>
          </div>

          {/* Connection status badge */}
          {googleUser ? (
            <div className="flex items-center gap-3 bg-[#151a42]/90 border border-emerald-400/30 p-2.5 pr-4 rounded-2xl shadow-inner">
              {googleUser.photoURL ? (
                <img
                  src={googleUser.photoURL}
                  alt={googleUser.displayName || 'Google User'}
                  className="w-10 h-10 rounded-xl object-cover border border-emerald-400/40"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-sm border border-emerald-400/40">
                  {googleUser.displayName?.[0] || 'G'}
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white truncate max-w-[170px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{googleUser.displayName || 'Google Drive Terhubung'}</span>
                </div>
                <div className="text-[11px] text-blue-200/80 truncate max-w-[170px]">{googleUser.email}</div>
              </div>
              <button
                onClick={handleGoogleLogout}
                className="ml-2 px-3 py-1.5 text-xs font-bold text-rose-300 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl transition-all"
              >
                Putuskan
              </button>
            </div>
          ) : (
            <div>
              <GoogleSignInButton
                onClick={handleGoogleLogin}
                isLoading={isLoggingIn}
                text="Hubungkan Google Drive"
                className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold border-0 shadow-lg shadow-amber-400/20"
              />
            </div>
          )}
        </div>
      </div>

      {/* When user is NOT authenticated with Google */}
      {!googleUser && !isInitializing && (
        <div className="bg-[#181d45] border border-[#2a3577] rounded-3xl p-8 text-center text-white space-y-6 shadow-xl">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-amber-400 shadow-inner">
            <Cloud className="w-10 h-10 stroke-[1.8]" />
          </div>

          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="text-lg font-bold text-white">Hubungkan Akun Google untuk Mengaktifkan Drive</h2>
            <p className="text-xs text-blue-200/80 leading-relaxed">
              Dengan menghubungkan Google Drive, petugas Bea Cukai dan pengelola UMKM dapat mengunggah dokumen ekspor (PEB, SKA, Surat Tugas, Sertifikat Halal), membackup data rekapitulasi, dan menautkan file pendukung secara langsung.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <GoogleSignInButton
              onClick={handleGoogleLogin}
              isLoading={isLoggingIn}
              text="Sign in with Google untuk Akses Drive"
              className="w-full sm:w-auto shadow-md"
            />
          </div>

          {/* Quick Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left pt-6 border-t border-[#263170] max-w-4xl mx-auto">
            <div className="p-4 bg-[#14183a] rounded-2xl border border-[#26306c] space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white">Penyimpanan Dokumen Ekspor</h3>
              <p className="text-[11px] text-blue-300/80 leading-relaxed">
                Unggah dan kelola Pemberitahuan Ekspor Barang (PEB), Invoice, Packing List, serta NIB langsung di Google Drive.
              </p>
            </div>

            <div className="p-4 bg-[#14183a] rounded-2xl border border-[#26306c] space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-400/20 text-emerald-400 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white">Backup Basis Data Terpadu</h3>
              <p className="text-[11px] text-blue-300/80 leading-relaxed">
                Simpan snapshot rekapitulasi UMKM dan log asistensi berkala ke folder khusus &apos;DJBC - Dokumen Ekspor UMKM&apos;.
              </p>
            </div>

            <div className="p-4 bg-[#14183a] rounded-2xl border border-[#26306c] space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-400/20 text-blue-400 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white">Keamanan & Otoritas Penuh</h3>
              <p className="text-[11px] text-blue-300/80 leading-relaxed">
                Token diakses secara in-memory client-side yang aman dengan konfirmasi dialog untuk setiap tindakan penghapusan.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* When user IS authenticated with Google */}
      {googleUser && (
        <div className="space-y-6">
          {/* Storage Quota & Actions Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Storage Card */}
            <div className="bg-[#181d45] border border-[#2a3577] rounded-3xl p-5 text-white space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-blue-300">Kapasitas Google Drive</span>
                <span className="text-xs font-bold text-amber-400">{quota?.percent || 0}% Terpakai</span>
              </div>
              <div className="w-full bg-[#12163b] h-3 rounded-full overflow-hidden p-0.5 border border-[#283270]">
                <div
                  className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${quota?.percent || 1}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-blue-200/80 font-medium">
                <span>{quota?.usageGb || '0'} GB terpakai</span>
                <span>Total kuota: {quota?.limitGb || '15 GB'}</span>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="lg:col-span-2 bg-[#181d45] border border-[#2a3577] rounded-3xl p-5 text-white flex flex-wrap items-center justify-between gap-3 shadow-lg">
              <div>
                <h2 className="text-sm font-bold text-white">Aksi Dokumen &amp; Sinkronisasi</h2>
                <p className="text-xs text-blue-200/80 mt-0.5">
                  Unggah berkas atau simpan backup rekapitulasi langsung ke Google Drive.
                </p>
              </div>

              <div className="flex items-center flex-wrap gap-2.5">
                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Unggah Dokumen</span>
                </button>

                <button
                  onClick={handleBackupDatabaseToDrive}
                  disabled={isBackingUp}
                  className="px-4 py-2.5 bg-[#252f70] hover:bg-[#2e3a8a] text-blue-100 hover:text-white font-bold text-xs rounded-xl border border-[#35439a] shadow-sm transition-all flex items-center gap-2 disabled:opacity-60"
                >
                  {isBackingUp ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                  ) : (
                    <DownloadCloud className="w-4 h-4 text-emerald-400" />
                  )}
                  <span>Backup Database UMKM</span>
                </button>

                <button
                  onClick={loadDriveData}
                  disabled={isLoadingFiles}
                  title="Segarkan Berkas"
                  className="p-2.5 bg-[#14183a] hover:bg-[#20275e] text-blue-300 hover:text-white rounded-xl border border-[#2a3577] transition-all"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingFiles ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Files Browser Header & Filters */}
          <div className="bg-[#181d45] border border-[#2a3577] rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  Daftar Berkas di Google Drive
                  <span className="text-xs font-mono font-bold bg-[#14183a] text-amber-400 px-2.5 py-0.5 rounded-full border border-[#2b3678]">
                    {filteredFiles.length} Berkas
                  </span>
                </h2>
                <p className="text-xs text-blue-200/70 mt-0.5">
                  Folder target: <span className="text-amber-300 font-mono">DJBC - Dokumen Ekspor UMKM</span>
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-300/70" />
                <input
                  type="text"
                  placeholder="Cari file dokumen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#12163b] border border-[#2a3577] rounded-xl text-xs text-white placeholder-blue-300/50 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {[
                { id: 'all', label: 'Semua Berkas' },
                { id: 'peb', label: 'PEB & Kepabeanan' },
                { id: 'halal', label: 'Sertifikat Halal & Mutu' },
                { id: 'nib', label: 'Legalitas & NIB' },
                { id: 'laporan', label: 'Laporan Asistensi' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCategoryFilter(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                    categoryFilter === tab.id
                      ? 'bg-amber-400 text-slate-950 shadow-md'
                      : 'bg-[#14183a] text-blue-200 hover:bg-[#20275e] border border-[#273273]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Files List / Grid */}
            {isLoadingFiles ? (
              <div className="py-16 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
                <p className="text-xs text-blue-200">Memuat berkas dari Google Drive...</p>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="py-16 text-center space-y-3 bg-[#14183a]/60 rounded-2xl border border-[#252f6d]">
                <FileText className="w-10 h-10 text-blue-400/40 mx-auto" />
                <div className="text-sm font-bold text-white">Tidak ada berkas yang cocok</div>
                <p className="text-xs text-blue-300/70 max-w-md mx-auto">
                  Belum ada dokumen yang sesuai dengan pencarian atau filter. Klik tombol &apos;Unggah Dokumen&apos; untuk menambahkan berkas baru.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#283270] text-[11px] font-black uppercase text-blue-300/80 tracking-wider">
                      <th className="py-3 px-4">Nama Dokumen</th>
                      <th className="py-3 px-4">Kategori</th>
                      <th className="py-3 px-4">Ukuran</th>
                      <th className="py-3 px-4">Terakhir Diubah</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222a61] text-xs">
                    {filteredFiles.map((file) => (
                      <tr key={file.id} className="hover:bg-[#1f275e]/60 transition-colors">
                        <td className="py-3.5 px-4 font-medium text-white">
                          <div className="flex items-center gap-3">
                            <span className="p-2 rounded-lg bg-[#14183a] border border-[#273273]">
                              {getFileIcon(file.mimeType, file.name)}
                            </span>
                            <div className="min-w-0 max-w-sm">
                              <div className="font-bold truncate text-white" title={file.name}>
                                {file.name}
                              </div>
                              {file.description && (
                                <div className="text-[10px] text-blue-300/70 truncate mt-0.5">
                                  {file.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              file.category === 'peb'
                                ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                                : file.category === 'halal'
                                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                                : file.category === 'nib'
                                ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                                : file.category === 'laporan'
                                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                : 'bg-slate-500/10 text-slate-300 border-slate-500/30'
                            }`}
                          >
                            {file.category === 'peb'
                              ? 'PEB Ekspor'
                              : file.category === 'halal'
                              ? 'Halal / Mutu'
                              : file.category === 'nib'
                              ? 'NIB & Izin'
                              : file.category === 'laporan'
                              ? 'Laporan Rekap'
                              : 'Umum'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-blue-200/80">
                          {formatFileSize(file.size)}
                        </td>

                        <td className="py-3.5 px-4 text-blue-200/80">
                          {file.modifiedTime
                            ? new Date(file.modifiedTime).toLocaleDateString('id-ID', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })
                            : '-'}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {file.webViewLink && (
                              <a
                                href={file.webViewLink}
                                target="_blank"
                                rel="noreferrer"
                                title="Buka di Google Drive"
                                className="p-2 bg-[#14183a] hover:bg-[#252f70] text-blue-300 hover:text-white rounded-lg border border-[#293475] transition-colors"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}

                            {/* Safe Delete with Mandatory Confirmation Modal */}
                            <button
                              onClick={() => setFileToDelete(file)}
                              title="Hapus Dokumen"
                              className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 rounded-lg border border-rose-500/30 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-[#181d45] border border-[#2e3b85] rounded-3xl p-6 sm:p-7 max-w-md w-full text-white shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#283472] pb-4">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-amber-400 text-slate-950">
                  <Upload className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">Unggah ke Google Drive</h3>
                  <p className="text-xs text-blue-200/80">Dokumen Pendukung UMKM Ekspor</p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-blue-300 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="p-3 bg-[#12163b] rounded-xl border border-[#273273] space-y-1">
                <div className="text-[11px] text-blue-300/80 font-semibold uppercase">Berkas Terpilih</div>
                <div className="text-xs font-bold text-white truncate">{selectedFile.name}</div>
                <div className="text-[10px] text-amber-300 font-mono">
                  {formatFileSize(selectedFile.size.toString())} · {selectedFile.type || 'Dokumen'}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-blue-200 mb-1.5">
                  Kategori Dokumen Ekspor
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-[#12163b] border border-[#2b377b] rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 font-medium"
                >
                  <option value="peb">Pemberitahuan Ekspor Barang (PEB) & Pabean</option>
                  <option value="halal">Sertifikat Halal / Mutu / BPOM / HACCP</option>
                  <option value="nib">NIB / NPWP / Izin Usaha / Legalitas</option>
                  <option value="laporan">Laporan Asistensi & Evaluasi Kanwil</option>
                  <option value="other">Dokumen Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-blue-200 mb-1.5">
                  Catatan / Keterangan Tambahan (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: PEB Ekspor Kopi Gayo ke Hamburg 2026"
                  value={uploadNotes}
                  onChange={(e) => setUploadNotes(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#12163b] border border-[#2b377b] rounded-xl text-xs text-white placeholder-blue-300/50 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#283472]">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-blue-200 hover:text-white bg-[#14183a] hover:bg-[#20275e] border border-[#283472] rounded-xl transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-60"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Mengunggah...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Mulai Unggah</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANDATORY: Destructive Delete Confirmation Modal */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="bg-[#181d45] border border-rose-500/40 rounded-3xl p-6 sm:p-7 max-w-md w-full text-white shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30 shrink-0">
                <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Konfirmasi Penghapusan File</h3>
                <p className="text-xs text-rose-300 font-semibold">Tindakan Destruktif Google Drive</p>
              </div>
            </div>

            <div className="p-4 bg-[#12163b] rounded-2xl border border-rose-500/20 space-y-2">
              <p className="text-xs text-blue-100 leading-relaxed">
                Apakah Anda yakin ingin menghapus berkas berikut dari Google Drive Anda secara permanen?
              </p>
              <div className="p-2.5 bg-[#171d47] rounded-xl border border-[#2b377b] text-xs font-bold text-amber-300 truncate">
                {fileToDelete.name}
              </div>
              <p className="text-[11px] text-rose-300/80 leading-snug">
                File akan dihapus secara langsung dari Google Drive dan tidak dapat dipulihkan melalui aplikasi ini.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setFileToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2.5 text-xs font-bold text-blue-200 hover:text-white bg-[#14183a] hover:bg-[#20275e] border border-[#283472] rounded-xl transition-all"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeleteFile}
                disabled={isDeleting}
                className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2 disabled:opacity-60"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Hapus Permanen</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
