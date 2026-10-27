import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ActivityLogAsistensi } from '../../types';
import { KANWIL_LIST } from '../../data/mockData';
import { Modal } from '../common/Modal';
import {
  Plus,
  Search,
  Download,
  FileText,
  RotateCcw,
  Eye,
  Edit2,
  Trash2,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  HardDrive
} from 'lucide-react';

export const AsistensiModule: React.FC = () => {
  const {
    asistensiLogs,
    addAsistensiLog,
    updateAsistensiLog,
    deleteAsistensiLog,
    currentUser,
    selectedKanwilFilter,
    setSelectedKanwilFilter,
    setActiveTab
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKlaster, setSelectedKlaster] = useState<string>('Semua');
  const [selectedProgress, setSelectedProgress] = useState<string>('Semua');
  const [selectedKendalaUtama, setSelectedKendalaUtama] = useState<string>('Semua');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<ActivityLogAsistensi | null>(null);
  const [viewingLog, setViewingLog] = useState<ActivityLogAsistensi | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State matching the 28 columns
  const [formData, setFormData] = useState({
    sertifikatUmkm: '',
    kantorWilayah: currentUser.role === 'operator_kanwil' && currentUser.kanwilAssignment ? currentUser.kanwilAssignment : 'Kanwil DJBC Jawa Timur I',
    namaUmkm: '',
    namaPemilik: '',
    jenisKelamin: 'Laki-laki' as 'Laki-laki' | 'Perempuan',
    kategoriUsaha: 'Industri Pengolahan Makanan & Minuman',
    subKategoriUsaha: '',
    hasilProduksi: '',
    instansiPembina: 'KPPBC & Disperindag',
    klasterisasiUmkm: 'Siap Ekspor',
    statusEkspor: 'Pernah Ekspor',
    statusFasilitasKepabeanan: 'KITE IKM',
    targetBinaanDjbc: 'Mandiri Ekspor 2026',
    kendalaUtama: 'Legalitas & Regulasi',
    kendalaLainnya: '',
    uraianKendala: '',
    jenisAsistensi: 'Klinik Ekspor Kepabeanan',
    penjelasanKegiatanAsistensi: '',
    progressTindakLanjut: 'Dalam Proses',
    penjelasanProgressTindakLanjut: '',
    bentukSinergi: 'Sinergi Bea Cukai, Bank Indonesia, dan LPEI',
    hasilPemberdayaan: '',
    nilaiEksporSebelumnyaIdr: 0,
    nilaiEksporBerjalanIdr: 0,
    tanggalEksporBerjalan: new Date().toISOString().substring(0, 10),
    negaraTujuanEkspor: '',
    statusDataInformasi: 'Terverifikasi & Aktif',
    keterangan: ''
  });

  const canEdit = currentUser.role === 'superadmin' || currentUser.role === 'operator_kanwil';

  // Filtered List
  const filteredList = useMemo(() => {
    return asistensiLogs.filter((log) => {
      const kanwil = log.kantorWilayah || log.kanwil || '';

      // Kanwil Filter
      if (currentUser.role === 'operator_kanwil' && currentUser.kanwilAssignment) {
        if (kanwil !== currentUser.kanwilAssignment) return false;
      } else if (selectedKanwilFilter !== 'Semua Kanwil') {
        if (kanwil !== selectedKanwilFilter) return false;
      }

      // Klaster Filter
      if (selectedKlaster !== 'Semua' && log.klasterisasiUmkm !== selectedKlaster) {
        return false;
      }

      // Progress Filter
      if (selectedProgress !== 'Semua' && log.progressTindakLanjut !== selectedProgress) {
        return false;
      }

      // Kendala Utama Filter
      if (selectedKendalaUtama !== 'Semua' && log.kendalaUtama !== selectedKendalaUtama) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = (log.namaUmkm || log.umkmNama || '').toLowerCase().includes(q);
        const matchPemilik = (log.namaPemilik || '').toLowerCase().includes(q);
        const matchProduk = (log.hasilProduksi || '').toLowerCase().includes(q);
        const matchKanwil = kanwil.toLowerCase().includes(q);
        const matchKendala = (log.kendalaUtama || '').toLowerCase().includes(q) || (log.uraianKendala || '').toLowerCase().includes(q);
        const matchNegara = (log.negaraTujuanEkspor || '').toLowerCase().includes(q);
        const matchSertifikat = (log.sertifikatUmkm || '').toLowerCase().includes(q);
        return matchName || matchPemilik || matchProduk || matchKanwil || matchKendala || matchNegara || matchSertifikat;
      }

      return true;
    });
  }, [
    asistensiLogs,
    currentUser,
    selectedKanwilFilter,
    selectedKlaster,
    selectedProgress,
    selectedKendalaUtama,
    searchQuery
  ]);

  const resetForm = () => {
    setFormData({
      sertifikatUmkm: '',
      kantorWilayah: currentUser.role === 'operator_kanwil' && currentUser.kanwilAssignment ? currentUser.kanwilAssignment : 'Kanwil DJBC Jawa Timur I',
      namaUmkm: '',
      namaPemilik: '',
      jenisKelamin: 'Laki-laki',
      kategoriUsaha: 'Industri Pengolahan Makanan & Minuman',
      subKategoriUsaha: '',
      hasilProduksi: '',
      instansiPembina: 'KPPBC & Disperindag',
      klasterisasiUmkm: 'Siap Ekspor',
      statusEkspor: 'Pernah Ekspor',
      statusFasilitasKepabeanan: 'KITE IKM',
      targetBinaanDjbc: 'Mandiri Ekspor 2026',
      kendalaUtama: 'Legalitas & Regulasi',
      kendalaLainnya: '',
      uraianKendala: '',
      jenisAsistensi: 'Klinik Ekspor Kepabeanan',
      penjelasanKegiatanAsistensi: '',
      progressTindakLanjut: 'Dalam Proses',
      penjelasanProgressTindakLanjut: '',
      bentukSinergi: 'Sinergi Bea Cukai, Bank Indonesia, dan LPEI',
      hasilPemberdayaan: '',
      nilaiEksporSebelumnyaIdr: 0,
      nilaiEksporBerjalanIdr: 0,
      tanggalEksporBerjalan: new Date().toISOString().substring(0, 10),
      negaraTujuanEkspor: '',
      statusDataInformasi: 'Terverifikasi & Aktif',
      keterangan: ''
    });
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (log: ActivityLogAsistensi) => {
    setEditingLog(log);
    setFormData({
      sertifikatUmkm: log.sertifikatUmkm || '',
      kantorWilayah: log.kantorWilayah || log.kanwil || 'Kanwil DJBC Jawa Timur I',
      namaUmkm: log.namaUmkm || log.umkmNama || '',
      namaPemilik: log.namaPemilik || '',
      jenisKelamin: log.jenisKelamin || 'Laki-laki',
      kategoriUsaha: log.kategoriUsaha || 'Industri Pengolahan Makanan & Minuman',
      subKategoriUsaha: log.subKategoriUsaha || '',
      hasilProduksi: log.hasilProduksi || '',
      instansiPembina: log.instansiPembina || 'KPPBC & Disperindag',
      klasterisasiUmkm: log.klasterisasiUmkm || 'Siap Ekspor',
      statusEkspor: log.statusEkspor || 'Pernah Ekspor',
      statusFasilitasKepabeanan: log.statusFasilitasKepabeanan || 'KITE IKM',
      targetBinaanDjbc: log.targetBinaanDjbc || 'Mandiri Ekspor 2026',
      kendalaUtama: log.kendalaUtama || 'Legalitas & Regulasi',
      kendalaLainnya: log.kendalaLainnya || '',
      uraianKendala: log.uraianKendala || '',
      jenisAsistensi: log.jenisAsistensi || 'Klinik Ekspor Kepabeanan',
      penjelasanKegiatanAsistensi: log.penjelasanKegiatanAsistensi || '',
      progressTindakLanjut: log.progressTindakLanjut || 'Dalam Proses',
      penjelasanProgressTindakLanjut: log.penjelasanProgressTindakLanjut || '',
      bentukSinergi: log.bentukSinergi || '',
      hasilPemberdayaan: log.hasilPemberdayaan || '',
      nilaiEksporSebelumnyaIdr: log.nilaiEksporSebelumnyaIdr || 0,
      nilaiEksporBerjalanIdr: log.nilaiEksporBerjalanIdr || 0,
      tanggalEksporBerjalan: log.tanggalEksporBerjalan || new Date().toISOString().substring(0, 10),
      negaraTujuanEkspor: log.negaraTujuanEkspor || '',
      statusDataInformasi: log.statusDataInformasi || 'Terverifikasi & Aktif',
      keterangan: log.keterangan || ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaUmkm || !formData.hasilProduksi || !formData.namaPemilik) {
      alert('Mohon lengkapi Nama UMKM, Nama Pemilik, dan Hasil Produksi.');
      return;
    }

    const payload: Omit<ActivityLogAsistensi, 'id' | 'createdAt'> = {
      ...formData,
      // Compatibility fields
      umkmId: editingLog?.umkmId || `umkm-ast-${Date.now()}`,
      umkmNama: formData.namaUmkm,
      kanwil: formData.kantorWilayah,
      penjelasanAktivitas: formData.penjelasanKegiatanAsistensi,
      tindakLanjut: formData.penjelasanProgressTindakLanjut,
      mitraSinergi: formData.bentukSinergi,
      statusProgres: (formData.progressTindakLanjut as any) || 'Dalam Proses'
    };

    if (editingLog) {
      updateAsistensiLog(editingLog.id, payload);
      setEditingLog(null);
    } else {
      addAsistensiLog(payload);
      setIsAddModalOpen(false);
    }
  };

  // Export CSV dengan 28 Kolom Sesuai Permintaan
  const handleExportCsv = () => {
    const headers = [
      'No.,Sertifikat UMKM,Kantor Wilayah,Nama UMKM,Nama Pemilik,Jenis Kelamin,Kategori Usaha,Sub Kategori Usaha,Hasil Produksi,Instansi Pembina,Klasterisasi UMKM,Status Ekspor,Status Fasilitas Kepabeanan,Target Binaan Oleh DJBC,Kendala Utama,Kendala Lainnya,Uraian Kendala,Jenis Asistensi,Penjelasan Kegiatan Asistensi,Progress Tindak Lanjut,Penjelasan ProgressTindak Lanjut,Bentuk Sinergi yang Telah Dilakukan,Hasil Pemberdayaan dan Tindak Lanjut,"Nilai Ekspor (FOB) Tahun Sebelumnya (dalam rupiah)","Nilai Ekspor (FOB) Tahun Berjalan (dalam rupiah)","Tanggal Ekspor Tahun Berjalan",Negara Tujuan Ekspor Tahun Berjalan,Status Data dan Informasi,Keterangan'
    ];

    const rows = filteredList.map((log, idx) =>
      [
        `"${idx + 1}"`,
        `"${(log.sertifikatUmkm || '-').replace(/"/g, '""')}"`,
        `"${(log.kantorWilayah || log.kanwil || '-').replace(/"/g, '""')}"`,
        `"${(log.namaUmkm || log.umkmNama || '-').replace(/"/g, '""')}"`,
        `"${(log.namaPemilik || '-').replace(/"/g, '""')}"`,
        `"${(log.jenisKelamin || '-').replace(/"/g, '""')}"`,
        `"${(log.kategoriUsaha || '-').replace(/"/g, '""')}"`,
        `"${(log.subKategoriUsaha || '-').replace(/"/g, '""')}"`,
        `"${(log.hasilProduksi || '-').replace(/"/g, '""')}"`,
        `"${(log.instansiPembina || '-').replace(/"/g, '""')}"`,
        `"${(log.klasterisasiUmkm || '-').replace(/"/g, '""')}"`,
        `"${(log.statusEkspor || '-').replace(/"/g, '""')}"`,
        `"${(log.statusFasilitasKepabeanan || '-').replace(/"/g, '""')}"`,
        `"${(log.targetBinaanDjbc || '-').replace(/"/g, '""')}"`,
        `"${(log.kendalaUtama || '-').replace(/"/g, '""')}"`,
        `"${(log.kendalaLainnya || '-').replace(/"/g, '""')}"`,
        `"${(log.uraianKendala || '-').replace(/"/g, '""')}"`,
        `"${(log.jenisAsistensi || '-').replace(/"/g, '""')}"`,
        `"${(log.penjelasanKegiatanAsistensi || log.penjelasanAktivitas || '-').replace(/"/g, '""')}"`,
        `"${(log.progressTindakLanjut || log.statusProgres || '-').replace(/"/g, '""')}"`,
        `"${(log.penjelasanProgressTindakLanjut || log.tindakLanjut || '-').replace(/"/g, '""')}"`,
        `"${(log.bentukSinergi || log.mitraSinergi || '-').replace(/"/g, '""')}"`,
        `"${(log.hasilPemberdayaan || '-').replace(/"/g, '""')}"`,
        `"${log.nilaiEksporSebelumnyaIdr ? `Rp ${log.nilaiEksporSebelumnyaIdr.toLocaleString('id-ID')}` : 'Rp 0'}"`,
        `"${log.nilaiEksporBerjalanIdr ? `Rp ${log.nilaiEksporBerjalanIdr.toLocaleString('id-ID')}` : 'Rp 0'}"`,
        `"${(log.tanggalEksporBerjalan || '-').replace(/"/g, '""')}"`,
        `"${(log.negaraTujuanEkspor || '-').replace(/"/g, '""')}"`,
        `"${(log.statusDataInformasi || '-').replace(/"/g, '""')}"`,
        `"${(log.keterangan || '-').replace(/"/g, '""')}"`
      ].join(',')
    );

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Asistensi_UMKM_DJBC_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isFilterActive =
    searchQuery ||
    selectedKlaster !== 'Semua' ||
    selectedProgress !== 'Semua' ||
    selectedKendalaUtama !== 'Semua';

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedKlaster('Semua');
    setSelectedProgress('Semua');
    setSelectedKendalaUtama('Semua');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Bar: Kemenkeu Blue & Gold Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#191e4a] border border-[#2b3577] rounded-3xl text-white shadow-xl">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2.5">
            <span>ASISTENSI UMKM</span>
            <span className="text-xs font-bold text-slate-950 bg-amber-400 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {filteredList.length} Log Asistensi
            </span>
          </h2>
          <p className="text-xs text-blue-200 mt-1">
            Pencatatan pendampingan teknis kepabeanan, kurasi produk, fasilitasi kendala, dan monitoring progres ekspor.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('drive')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-amber-300 bg-[#252f70] hover:bg-[#2d3988] border border-[#35439a] rounded-xl transition-all shadow-xs"
            title="Buka Repositori Dokumen Google Drive"
          >
            <HardDrive className="w-3.5 h-3.5 text-amber-400" />
            <span>Google Drive</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-blue-100 bg-[#252f70] hover:bg-[#2d3988] border border-[#35439a] rounded-xl transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            Ekspor CSV (28 Kolom)
          </button>

          {canEdit && (
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Tambah Data Asistensi
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3.5 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari UMKM, pemilik, produk, negara tujuan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>

          {/* Kantor Wilayah Filter */}
          <div>
            <select
              value={selectedKanwilFilter}
              onChange={(e) => setSelectedKanwilFilter(e.target.value)}
              disabled={currentUser.role === 'operator_kanwil'}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            >
              <option value="Semua Kanwil">Semua Kantor Wilayah</option>
              {KANWIL_LIST.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>

          {/* Klasterisasi UMKM Filter */}
          <div>
            <select
              value={selectedKlaster}
              onChange={(e) => setSelectedKlaster(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            >
              <option value="Semua">Semua Klasterisasi UMKM</option>
              <option value="Potensi Ekspor">Potensi Ekspor</option>
              <option value="Siap Ekspor">Siap Ekspor</option>
              <option value="Telah Ekspor">Telah Ekspor</option>
            </select>
          </div>

          {/* Progress Tindak Lanjut Filter */}
          <div>
            <select
              value={selectedProgress}
              onChange={(e) => setSelectedProgress(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            >
              <option value="Semua">Semua Progress Tindak Lanjut</option>
              <option value="Kendala Teratasi">Kendala Teratasi</option>
              <option value="Dalam Proses">Dalam Proses</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>
        </div>

        {/* Inline metadata counter & reset */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Menampilkan <strong className="text-slate-800 font-mono tabular-nums">{filteredList.length}</strong> dari {asistensiLogs.length} data Asistensi UMKM
            </span>
            <span aria-hidden="true">·</span>
            <span>Wilayah: {currentUser.role === 'operator_kanwil' ? currentUser.kanwilAssignment : selectedKanwilFilter}</span>
          </div>
          {isFilterActive && (
            <button
              onClick={resetAllFilters}
              className="flex items-center gap-1 text-blue-700 hover:text-blue-900 hover:underline font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* 2. Structured Table with Exact 28 Columns Requested */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-3 text-center">No.</th>
                <th className="py-3 px-3">Sertifikat UMKM</th>
                <th className="py-3 px-3">Kantor Wilayah</th>
                <th className="py-3 px-3">Nama UMKM</th>
                <th className="py-3 px-3">Nama Pemilik</th>
                <th className="py-3 px-3">Jenis Kelamin</th>
                <th className="py-3 px-3">Kategori Usaha</th>
                <th className="py-3 px-3">Sub Kategori Usaha</th>
                <th className="py-3 px-3">Hasil Produksi</th>
                <th className="py-3 px-3">Instansi Pembina</th>
                <th className="py-3 px-3">Klasterisasi UMKM</th>
                <th className="py-3 px-3">Status Ekspor</th>
                <th className="py-3 px-3">Status Fasilitas Kepabeanan</th>
                <th className="py-3 px-3">Target Binaan Oleh DJBC</th>
                <th className="py-3 px-3">Kendala Utama</th>
                <th className="py-3 px-3">Kendala Lainnya</th>
                <th className="py-3 px-3">Uraian Kendala</th>
                <th className="py-3 px-3">Jenis Asistensi</th>
                <th className="py-3 px-3">Penjelasan Kegiatan Asistensi</th>
                <th className="py-3 px-3">Progress Tindak Lanjut</th>
                <th className="py-3 px-3">Penjelasan ProgressTindak Lanjut</th>
                <th className="py-3 px-3">Bentuk Sinergi yang Telah Dilakukan</th>
                <th className="py-3 px-3">Hasil Pemberdayaan dan Tindak Lanjut</th>
                <th className="py-3 px-3 text-right">Nilai Ekspor (FOB) Tahun Sebelumnya (dalam rupiah)</th>
                <th className="py-3 px-3 text-right">Nilai Ekspor (FOB) Tahun Berjalan (dalam rupiah)</th>
                <th className="py-3 px-3">Tanggal Ekspor Tahun Berjalan</th>
                <th className="py-3 px-3">Negara Tujuan Ekspor Tahun Berjalan</th>
                <th className="py-3 px-3">Status Data dan Informasi</th>
                <th className="py-3 px-3">Keterangan</th>
                <th className="py-3 px-3 text-right sticky right-0 bg-slate-50 shadow-xs">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={30} className="py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-medium text-slate-600">Tidak ada data Asistensi UMKM yang cocok dengan filter.</p>
                  </td>
                </tr>
              ) : (
                filteredList.map((log, idx) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* No. */}
                    <td className="py-3 px-3 text-center font-mono font-medium text-slate-500 tabular-nums">
                      {idx + 1}
                    </td>

                    {/* 1. Sertifikat UMKM */}
                    <td className="py-3 px-3 max-w-[200px] truncate text-slate-800" title={log.sertifikatUmkm || '-'}>
                      <span className="font-mono text-slate-700">{log.sertifikatUmkm || '-'}</span>
                    </td>

                    {/* 2. Kantor Wilayah */}
                    <td className="py-3 px-3 text-slate-800 font-medium max-w-[220px] truncate" title={log.kantorWilayah || log.kanwil}>
                      {log.kantorWilayah || log.kanwil}
                    </td>

                    {/* 3. Nama UMKM */}
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {log.namaUmkm || log.umkmNama}
                    </td>

                    {/* 4. Nama Pemilik */}
                    <td className="py-3 px-3 text-slate-900 font-medium">
                      {log.namaPemilik || '-'}
                    </td>

                    {/* 5. Jenis Kelamin */}
                    <td className="py-3 px-3 text-slate-700">
                      {log.jenisKelamin || '-'}
                    </td>

                    {/* 6. Kategori Usaha */}
                    <td className="py-3 px-3 text-slate-700 max-w-[180px] truncate" title={log.kategoriUsaha || '-'}>
                      {log.kategoriUsaha || '-'}
                    </td>

                    {/* 7. Sub Kategori Usaha */}
                    <td className="py-3 px-3 text-slate-700 max-w-[180px] truncate" title={log.subKategoriUsaha || '-'}>
                      {log.subKategoriUsaha || '-'}
                    </td>

                    {/* 8. Hasil Produksi */}
                    <td className="py-3 px-3 font-medium text-slate-900 max-w-[200px] truncate" title={log.hasilProduksi || '-'}>
                      {log.hasilProduksi || '-'}
                    </td>

                    {/* 9. Instansi Pembina */}
                    <td className="py-3 px-3 text-slate-700 max-w-[200px] truncate" title={log.instansiPembina || '-'}>
                      {log.instansiPembina || '-'}
                    </td>

                    {/* 10. Klasterisasi UMKM */}
                    <td className="py-3 px-3">
                      {log.klasterisasiUmkm === 'Telah Ekspor' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          ✦ Telah Ekspor
                        </span>
                      )}
                      {log.klasterisasiUmkm === 'Siap Ekspor' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                          ● Siap Ekspor
                        </span>
                      )}
                      {log.klasterisasiUmkm === 'Potensi Ekspor' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          ○ Potensi Ekspor
                        </span>
                      )}
                      {!['Telah Ekspor', 'Siap Ekspor', 'Potensi Ekspor'].includes(log.klasterisasiUmkm || '') && (
                        <span className="text-slate-600">{log.klasterisasiUmkm || '-'}</span>
                      )}
                    </td>

                    {/* 11. Status Ekspor */}
                    <td className="py-3 px-3 text-slate-800 font-medium">
                      {log.statusEkspor || '-'}
                    </td>

                    {/* 12. Status Fasilitas Kepabeanan */}
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-800 border border-slate-200">
                        {log.statusFasilitasKepabeanan || '-'}
                      </span>
                    </td>

                    {/* 13. Target Binaan Oleh DJBC */}
                    <td className="py-3 px-3 text-slate-800 max-w-[220px] truncate" title={log.targetBinaanDjbc || '-'}>
                      {log.targetBinaanDjbc || '-'}
                    </td>

                    {/* 14. Kendala Utama */}
                    <td className="py-3 px-3 font-medium text-slate-800">
                      {log.kendalaUtama || '-'}
                    </td>

                    {/* 15. Kendala Lainnya */}
                    <td className="py-3 px-3 text-slate-600 max-w-[180px] truncate" title={log.kendalaLainnya || '-'}>
                      {log.kendalaLainnya || '-'}
                    </td>

                    {/* 16. Uraian Kendala */}
                    <td className="py-3 px-3 text-slate-700 max-w-[260px] truncate" title={log.uraianKendala || '-'}>
                      {log.uraianKendala || '-'}
                    </td>

                    {/* 17. Jenis Asistensi */}
                    <td className="py-3 px-3 text-blue-700 font-semibold max-w-[200px] truncate" title={log.jenisAsistensi || '-'}>
                      {log.jenisAsistensi || '-'}
                    </td>

                    {/* 18. Penjelasan Kegiatan Asistensi */}
                    <td className="py-3 px-3 text-slate-700 max-w-[280px] truncate" title={log.penjelasanKegiatanAsistensi || log.penjelasanAktivitas || '-'}>
                      {log.penjelasanKegiatanAsistensi || log.penjelasanAktivitas || '-'}
                    </td>

                    {/* 19. Progress Tindak Lanjut */}
                    <td className="py-3 px-3">
                      {(log.progressTindakLanjut === 'Kendala Teratasi' || log.statusProgres === 'Kendala Teratasi') && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          Kendala Teratasi
                        </span>
                      )}
                      {(log.progressTindakLanjut === 'Dalam Proses' || log.statusProgres === 'Dalam Proses') && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" />
                          Dalam Proses
                        </span>
                      )}
                      {(log.progressTindakLanjut === 'Selesai' || log.statusProgres === 'Selesai') && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                          <CheckCircle className="w-3 h-3 text-blue-600" />
                          Selesai
                        </span>
                      )}
                    </td>

                    {/* 20. Penjelasan ProgressTindak Lanjut */}
                    <td className="py-3 px-3 text-slate-700 max-w-[260px] truncate" title={log.penjelasanProgressTindakLanjut || log.tindakLanjut || '-'}>
                      {log.penjelasanProgressTindakLanjut || log.tindakLanjut || '-'}
                    </td>

                    {/* 21. Bentuk Sinergi yang Telah Dilakukan */}
                    <td className="py-3 px-3 text-slate-700 max-w-[220px] truncate" title={log.bentukSinergi || log.mitraSinergi || '-'}>
                      {log.bentukSinergi || log.mitraSinergi || '-'}
                    </td>

                    {/* 22. Hasil Pemberdayaan dan Tindak Lanjut */}
                    <td className="py-3 px-3 text-slate-800 max-w-[240px] truncate" title={log.hasilPemberdayaan || '-'}>
                      {log.hasilPemberdayaan || '-'}
                    </td>

                    {/* 23. Nilai Ekspor (FOB) Tahun Sebelumnya (dalam rupiah) */}
                    <td className="py-3 px-3 text-right font-mono font-medium text-slate-700 tabular-nums">
                      {log.nilaiEksporSebelumnyaIdr
                        ? `Rp ${log.nilaiEksporSebelumnyaIdr.toLocaleString('id-ID')}`
                        : 'Rp 0'}
                    </td>

                    {/* 24. Nilai Ekspor (FOB) Tahun Berjalan (dalam rupiah) */}
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {log.nilaiEksporBerjalanIdr
                        ? `Rp ${log.nilaiEksporBerjalanIdr.toLocaleString('id-ID')}`
                        : 'Rp 0'}
                    </td>

                    {/* 25. Tanggal Ekspor Tahun Berjalan */}
                    <td className="py-3 px-3 font-mono text-slate-600">
                      {log.tanggalEksporBerjalan || '-'}
                    </td>

                    {/* 26. Negara Tujuan Ekspor Tahun Berjalan */}
                    <td className="py-3 px-3 font-semibold text-slate-800 max-w-[180px] truncate" title={log.negaraTujuanEkspor || '-'}>
                      {log.negaraTujuanEkspor || '-'}
                    </td>

                    {/* 27. Status Data dan Informasi */}
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {log.statusDataInformasi || 'Terverifikasi & Aktif'}
                      </span>
                    </td>

                    {/* 28. Keterangan */}
                    <td className="py-3 px-3 text-slate-600 max-w-[200px] truncate" title={log.keterangan || '-'}>
                      {log.keterangan || '-'}
                    </td>

                    {/* Aksi (Sticky Right) */}
                    <td className="py-3 px-3 text-right sticky right-0 bg-white/95 shadow-xs">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setViewingLog(log)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                          title="Lihat Rincian Lengkap"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {canEdit && (
                          <>
                            <button
                              onClick={() => handleOpenEdit(log)}
                              className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                              title="Edit Data Asistensi"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeletingId(log.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                              title="Hapus Data Asistensi"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Data Asistensi UMKM */}
      <Modal
        isOpen={isAddModalOpen || editingLog !== null}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingLog(null);
        }}
        title={editingLog ? `Edit Data Asistensi: ${editingLog.namaUmkm || editingLog.umkmNama}` : 'Tambah Data Asistensi UMKM'}
        subtitle="Formulir penatausahaan pendampingan ekspor, diagnosa kendala, dan tindak lanjut sinergi binaan DJBC."
        maxWidth="4xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Section 1: Identitas Usaha & Sertifikasi */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
            <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              1. Identitas Usaha & Sertifikasi
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Nama UMKM *</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Usaha / PT / CV"
                  value={formData.namaUmkm}
                  onChange={(e) => setFormData({ ...formData, namaUmkm: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Nama Pemilik *</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Pemilik / PIC"
                  value={formData.namaPemilik}
                  onChange={(e) => setFormData({ ...formData, namaPemilik: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Jenis Kelamin *</label>
                <select
                  value={formData.jenisKelamin}
                  onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value as 'Laki-laki' | 'Perempuan' })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Kantor Wilayah *</label>
                <select
                  value={formData.kantorWilayah}
                  onChange={(e) => setFormData({ ...formData, kantorWilayah: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none"
                >
                  {KANWIL_LIST.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-medium mb-1">Sertifikat UMKM</label>
                <input
                  type="text"
                  placeholder="NIB, Halal BPJPH, HACCP, SNI, SVLK, ISO 9001..."
                  value={formData.sertifikatUmkm}
                  onChange={(e) => setFormData({ ...formData, sertifikatUmkm: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Kategori Usaha & Hasil Produksi */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
            <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              2. Kategori Usaha, Produksi & Pembina
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Kategori Usaha *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Industri Olahan Pangan"
                  value={formData.kategoriUsaha}
                  onChange={(e) => setFormData({ ...formData, kategoriUsaha: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Sub Kategori Usaha</label>
                <input
                  type="text"
                  placeholder="Contoh: Kopi & Teh Olahan"
                  value={formData.subKategoriUsaha}
                  onChange={(e) => setFormData({ ...formData, subKategoriUsaha: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Hasil Produksi *</label>
                <input
                  type="text"
                  required
                  placeholder="Komoditas produk utama"
                  value={formData.hasilProduksi}
                  onChange={(e) => setFormData({ ...formData, hasilProduksi: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Instansi Pembina *</label>
                <input
                  type="text"
                  required
                  placeholder="KPPBC, Disperindag, Dinas Koperasi..."
                  value={formData.instansiPembina}
                  onChange={(e) => setFormData({ ...formData, instansiPembina: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Klasterisasi & Fasilitas */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
            <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              3. Klasterisasi, Fasilitas & Target DJBC
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Klasterisasi UMKM *</label>
                <select
                  value={formData.klasterisasiUmkm}
                  onChange={(e) => setFormData({ ...formData, klasterisasiUmkm: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none"
                >
                  <option value="Potensi Ekspor">Potensi Ekspor</option>
                  <option value="Siap Ekspor">Siap Ekspor</option>
                  <option value="Telah Ekspor">Telah Ekspor</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Status Ekspor *</label>
                <select
                  value={formData.statusEkspor}
                  onChange={(e) => setFormData({ ...formData, statusEkspor: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none"
                >
                  <option value="Rutin Ekspor">Rutin Ekspor</option>
                  <option value="Pernah Ekspor">Pernah Ekspor</option>
                  <option value="Belum Pernah Ekspor">Belum Pernah Ekspor</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Status Fasilitas Kepabeanan *</label>
                <select
                  value={formData.statusFasilitasKepabeanan}
                  onChange={(e) => setFormData({ ...formData, statusFasilitasKepabeanan: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none"
                >
                  <option value="KITE IKM">KITE IKM</option>
                  <option value="Gudang Berikat">Gudang Berikat</option>
                  <option value="Pusat Logistik Berikat">Pusat Logistik Berikat</option>
                  <option value="Non-Fasilitas (Reguler)">Non-Fasilitas (Reguler)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Target Binaan Oleh DJBC *</label>
                <input
                  type="text"
                  required
                  placeholder="Target kemandirian ekspor"
                  value={formData.targetBinaanDjbc}
                  onChange={(e) => setFormData({ ...formData, targetBinaanDjbc: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Diagnosa Kendala Usaha */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
            <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              4. Diagnosa Kendala Usaha
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Kendala Utama *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Legalitas & Sertifikasi, Pemasaran..."
                  value={formData.kendalaUtama}
                  onChange={(e) => setFormData({ ...formData, kendalaUtama: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Kendala Lainnya</label>
                <input
                  type="text"
                  placeholder="Logistik kontainer, fluktuasi kurs, dll."
                  value={formData.kendalaLainnya}
                  onChange={(e) => setFormData({ ...formData, kendalaLainnya: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-medium mb-1">Uraian Kendala *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Penjelasan detail kendala yang dialami UMKM..."
                  value={formData.uraianKendala}
                  onChange={(e) => setFormData({ ...formData, uraianKendala: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Asistensi & Progress Tindak Lanjut */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
            <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              5. Asistensi, Tindak Lanjut & Sinergi
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Jenis Asistensi *</label>
                <input
                  type="text"
                  required
                  placeholder="Klinik Ekspor Kepabeanan, Bimtek KITE, dll."
                  value={formData.jenisAsistensi}
                  onChange={(e) => setFormData({ ...formData, jenisAsistensi: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Progress Tindak Lanjut *</label>
                <select
                  value={formData.progressTindakLanjut}
                  onChange={(e) => setFormData({ ...formData, progressTindakLanjut: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none"
                >
                  <option value="Kendala Teratasi">Kendala Teratasi</option>
                  <option value="Dalam Proses">Dalam Proses</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-medium mb-1">Penjelasan Kegiatan Asistensi *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Aktivitas bimbingan, koordinasi, atau konsultasi kepabeanan yang diberikan..."
                  value={formData.penjelasanKegiatanAsistensi}
                  onChange={(e) => setFormData({ ...formData, penjelasanKegiatanAsistensi: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-medium mb-1">Penjelasan ProgressTindak Lanjut</label>
                <textarea
                  rows={2}
                  placeholder="Uraian tindak lanjut atau status penyelesaian..."
                  value={formData.penjelasanProgressTindakLanjut}
                  onChange={(e) => setFormData({ ...formData, penjelasanProgressTindakLanjut: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Bentuk Sinergi yang Telah Dilakukan</label>
                <input
                  type="text"
                  placeholder="Sinergi dengan BI, LPEI, Kemenperin, Pemda..."
                  value={formData.bentukSinergi}
                  onChange={(e) => setFormData({ ...formData, bentukSinergi: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Hasil Pemberdayaan dan Tindak Lanjut</label>
                <input
                  type="text"
                  placeholder="Realisasi ekspor kontainer, izin terbit, MoU..."
                  value={formData.hasilPemberdayaan}
                  onChange={(e) => setFormData({ ...formData, hasilPemberdayaan: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 6: Metrik Ekspor & Administrasi */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
            <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              6. Metrik Ekspor & Administrasi Informasi
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Nilai Ekspor (FOB) Tahun Sebelumnya (IDR)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.nilaiEksporSebelumnyaIdr}
                  onChange={(e) => setFormData({ ...formData, nilaiEksporSebelumnyaIdr: Number(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Nilai Ekspor (FOB) Tahun Berjalan (IDR)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.nilaiEksporBerjalanIdr}
                  onChange={(e) => setFormData({ ...formData, nilaiEksporBerjalanIdr: Number(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Tanggal Ekspor Tahun Berjalan</label>
                <input
                  type="date"
                  value={formData.tanggalEksporBerjalan}
                  onChange={(e) => setFormData({ ...formData, tanggalEksporBerjalan: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Negara Tujuan Ekspor Tahun Berjalan</label>
                <input
                  type="text"
                  placeholder="Jepang, Amerika Serikat, Singapura..."
                  value={formData.negaraTujuanEkspor}
                  onChange={(e) => setFormData({ ...formData, negaraTujuanEkspor: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Status Data dan Informasi *</label>
                <select
                  value={formData.statusDataInformasi}
                  onChange={(e) => setFormData({ ...formData, statusDataInformasi: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none"
                >
                  <option value="Terverifikasi & Aktif">Terverifikasi & Aktif</option>
                  <option value="Terverifikasi & Valid">Terverifikasi & Valid</option>
                  <option value="Dalam Pembaruan Triwulanan">Dalam Pembaruan Triwulanan</option>
                  <option value="Draft Verifikasi Kanwil">Draft Verifikasi Kanwil</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Keterangan</label>
                <input
                  type="text"
                  placeholder="Catatan tambahan asistensi..."
                  value={formData.keterangan}
                  onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingLog(null);
              }}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-white bg-blue-700 hover:bg-blue-800 font-semibold rounded-lg shadow-xs transition-colors"
            >
              {editingLog ? 'Simpan Perubahan Asistensi' : 'Simpan Data Asistensi'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Detail View Lengkap 28 Kolom */}
      {viewingLog && (
        <Modal
          isOpen={true}
          onClose={() => setViewingLog(null)}
          title={`Rincian Asistensi: ${viewingLog.namaUmkm || viewingLog.umkmNama}`}
          subtitle={`Kantor Wilayah: ${viewingLog.kantorWilayah || viewingLog.kanwil}`}
          maxWidth="3xl"
        >
          <div className="space-y-4 text-xs">
            {/* Header Card */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-slate-500 block text-[11px]">Nama UMKM:</span>
                <span className="font-bold text-slate-900 text-sm">{viewingLog.namaUmkm || viewingLog.umkmNama}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Nama Pemilik / Gender:</span>
                <span className="font-semibold text-slate-900">{viewingLog.namaPemilik || '-'} ({viewingLog.jenisKelamin || '-'})</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Klasterisasi UMKM:</span>
                <span className="font-semibold text-blue-700">{viewingLog.klasterisasiUmkm || '-'}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500 block text-[11px]">Sertifikat UMKM:</span>
                <span className="font-mono text-slate-800">{viewingLog.sertifikatUmkm || '-'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Fasilitas Kepabeanan:</span>
                <span className="font-semibold text-emerald-700">{viewingLog.statusFasilitasKepabeanan || '-'}</span>
              </div>
            </div>

            {/* Produksi & Target */}
            <div className="border-t pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <h5 className="font-bold text-slate-800 mb-1">Produksi & Kategori Usaha</h5>
                <p className="text-slate-900 font-semibold">{viewingLog.hasilProduksi || '-'}</p>
                <p className="text-slate-500 text-[11px] mt-0.5">{viewingLog.kategoriUsaha || '-'} · {viewingLog.subKategoriUsaha || '-'}</p>
                <p className="text-slate-600 text-[11px] mt-1">Pembina: {viewingLog.instansiPembina || '-'}</p>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <h5 className="font-bold text-slate-800 mb-1">Status Ekspor & Target DJBC</h5>
                <p className="text-slate-900 font-medium">Status: <strong>{viewingLog.statusEkspor || '-'}</strong></p>
                <p className="text-slate-700 text-[11px] mt-1">Target: {viewingLog.targetBinaanDjbc || '-'}</p>
                <p className="text-slate-500 text-[11px] mt-1">Negara Tujuan: <strong>{viewingLog.negaraTujuanEkspor || '-'}</strong></p>
              </div>
            </div>

            {/* Diagnosa Kendala & Asistensi */}
            <div className="border-t pt-3 space-y-3">
              <div className="bg-rose-50/70 p-3.5 rounded-lg border border-rose-200/80">
                <div className="flex items-center gap-1.5 text-rose-800 font-bold mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Diagnosa Kendala ({viewingLog.kendalaUtama || '-'})</span>
                </div>
                <p className="text-slate-800 leading-relaxed font-medium">{viewingLog.uraianKendala || '-'}</p>
                {viewingLog.kendalaLainnya && (
                  <p className="text-rose-700 text-[11px] mt-1">Kendala Lain: {viewingLog.kendalaLainnya}</p>
                )}
              </div>

              <div className="bg-blue-50/60 p-3.5 rounded-lg border border-blue-200/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-blue-900">Jenis Asistensi: {viewingLog.jenisAsistensi || '-'}</span>
                  <span className="font-semibold px-2 py-0.5 rounded text-[10px] bg-white text-blue-700 border border-blue-200">
                    Progress: {viewingLog.progressTindakLanjut || viewingLog.statusProgres || '-'}
                  </span>
                </div>
                <p className="text-slate-800 leading-relaxed">{viewingLog.penjelasanKegiatanAsistensi || viewingLog.penjelasanAktivitas || '-'}</p>
                <p className="text-slate-600 text-[11px] mt-2 pt-2 border-t border-blue-200/50">
                  <strong>Tindak Lanjut:</strong> {viewingLog.penjelasanProgressTindakLanjut || viewingLog.tindakLanjut || '-'}
                </p>
              </div>
            </div>

            {/* Sinergi & Hasil Pemberdayaan */}
            <div className="border-t pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Bentuk Sinergi yang Telah Dilakukan:</span>
                <span className="text-slate-900 font-medium">{viewingLog.bentukSinergi || viewingLog.mitraSinergi || '-'}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Hasil Pemberdayaan dan Tindak Lanjut:</span>
                <span className="text-slate-900 font-medium">{viewingLog.hasilPemberdayaan || '-'}</span>
              </div>
            </div>

            {/* Nilai Ekspor IDR */}
            <div className="border-t pt-3 bg-emerald-50/60 p-3.5 rounded-lg border border-emerald-200/80 grid grid-cols-2 gap-3">
              <div>
                <span className="text-emerald-800 block text-[11px]">Nilai Ekspor (FOB) Tahun Sebelumnya:</span>
                <span className="font-mono font-bold text-slate-800 text-sm">
                  {viewingLog.nilaiEksporSebelumnyaIdr
                    ? `Rp ${viewingLog.nilaiEksporSebelumnyaIdr.toLocaleString('id-ID')}`
                    : 'Rp 0'}
                </span>
              </div>
              <div>
                <span className="text-emerald-800 block text-[11px]">Nilai Ekspor (FOB) Tahun Berjalan:</span>
                <span className="font-mono font-bold text-emerald-900 text-sm">
                  {viewingLog.nilaiEksporBerjalanIdr
                    ? `Rp ${viewingLog.nilaiEksporBerjalanIdr.toLocaleString('id-ID')}`
                    : 'Rp 0'}
                </span>
                <span className="text-[10px] text-emerald-700 block mt-0.5">
                  Tanggal Ekspor: {viewingLog.tanggalEksporBerjalan || '-'}
                </span>
              </div>
            </div>

            <div className="border-t pt-3 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                Status Data: {viewingLog.statusDataInformasi || 'Terverifikasi'} · {viewingLog.keterangan ? `Catatan: ${viewingLog.keterangan}` : ''}
              </span>
              <button
                onClick={() => setViewingLog(null)}
                className="px-4 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && canEdit && (
        <Modal
          isOpen={true}
          onClose={() => setDeletingId(null)}
          title="Konfirmasi Hapus Data Asistensi"
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus data asistensi ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-3 py-1.5 text-slate-600 hover:text-slate-900"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  deleteAsistensiLog(deletingId);
                  setDeletingId(null);
                }}
                className="px-4 py-1.5 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700 transition-colors"
              >
                Hapus Permanen
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
