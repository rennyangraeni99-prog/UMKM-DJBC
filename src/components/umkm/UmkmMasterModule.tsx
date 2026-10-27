import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UMKMEntity,
  StatusUMKM,
  KlasterUMKM,
  BinaanStatus,
  KeteranganBinaan
} from '../../types';
import { KANWIL_LIST } from '../../data/mockData';
import { Modal } from '../common/Modal';
import {
  Plus,
  Search,
  Download,
  Building2,
  Lock,
  Edit2,
  Trash2,
  Eye,
  Filter,
  RotateCcw,
  HardDrive
} from 'lucide-react';

export const UmkmMasterModule: React.FC = () => {
  const {
    umkmList,
    addUmkm,
    updateUmkm,
    deleteUmkm,
    currentUser,
    selectedKanwilFilter,
    setSelectedKanwilFilter,
    setActiveTab
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');
  const [selectedKlaster, setSelectedKlaster] = useState<string>('Semua');
  const [selectedBinaan, setSelectedBinaan] = useState<string>('Semua');
  const [selectedKeterangan, setSelectedKeterangan] = useState<string>('Semua');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUmkm, setEditingUmkm] = useState<UMKMEntity | null>(null);
  const [viewingUmkm, setViewingUmkm] = useState<UMKMEntity | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    satkerKode: '080100',
    satkerNama: 'KPPBC TMP B Sidoarjo',
    namaUmkm: '',
    nibNpwp: '',
    provinsi: '',
    kotaKabupaten: '',
    kbli: '10792',
    kbliDeskripsi: 'Industri Pengolahan Kopi',
    komoditasUtama: '',
    statusOperasional: 'Masih Beroperasi' as StatusUMKM,
    klasterEkspor: 'Siap Ekspor' as KlasterUMKM,
    umkmBinaan: 'Binaan DJBC' as BinaanStatus,
    keterangan: 'Tetap' as KeteranganBinaan,
    alamatUsaha: '',
    kanwilPembina: currentUser.role === 'operator_kanwil' && currentUser.kanwilAssignment ? currentUser.kanwilAssignment : 'Kanwil DJBC Jawa Timur I',
    satkerPelaksana: 'KPPBC TMP B Sidoarjo',
    pic: {
      nama: '',
      jenisKelamin: 'Laki-laki' as 'Laki-laki' | 'Perempuan',
      noHpWa: '',
      email: '',
      jabatan: 'Penanggung Jawab Usaha'
    }
  });

  // Strict Rule: Hanya Superadmin yang dapat mengedit database
  const canEdit = currentUser.role === 'superadmin';

  // Filtered List
  const filteredList = useMemo(() => {
    return umkmList.filter((item) => {
      // Kanwil filter
      if (currentUser.role === 'operator_kanwil' && currentUser.kanwilAssignment) {
        if (item.kanwilPembina !== currentUser.kanwilAssignment) return false;
      } else if (selectedKanwilFilter !== 'Semua Kanwil') {
        if (item.kanwilPembina !== selectedKanwilFilter) return false;
      }

      // Status UMKM filter
      if (selectedStatus !== 'Semua' && item.statusOperasional !== selectedStatus) {
        return false;
      }

      // Klaster UMKM filter
      if (selectedKlaster !== 'Semua' && item.klasterEkspor !== selectedKlaster) {
        return false;
      }

      // Binaan filter
      if (selectedBinaan !== 'Semua' && item.umkmBinaan !== selectedBinaan) {
        return false;
      }

      // Keterangan filter
      if (selectedKeterangan !== 'Semua' && item.keterangan !== selectedKeterangan) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.namaUmkm.toLowerCase().includes(q);
        const matchNib = item.nibNpwp.toLowerCase().includes(q);
        const matchCommodity = item.komoditasUtama.toLowerCase().includes(q);
        const matchPic = item.pic.nama.toLowerCase().includes(q);
        const matchCity = item.kotaKabupaten.toLowerCase().includes(q);
        const matchSatker = item.satkerNama?.toLowerCase().includes(q) || item.satkerKode?.toLowerCase().includes(q);
        return matchName || matchNib || matchCommodity || matchPic || matchCity || matchSatker;
      }

      return true;
    });
  }, [
    umkmList,
    currentUser,
    selectedKanwilFilter,
    selectedStatus,
    selectedKlaster,
    selectedBinaan,
    selectedKeterangan,
    searchQuery
  ]);

  // Reset form
  const resetForm = () => {
    setFormData({
      satkerKode: '080100',
      satkerNama: 'KPPBC TMP B Sidoarjo',
      namaUmkm: '',
      nibNpwp: '',
      provinsi: '',
      kotaKabupaten: '',
      kbli: '10792',
      kbliDeskripsi: 'Industri Pengolahan Kopi',
      komoditasUtama: '',
      statusOperasional: 'Masih Beroperasi',
      klasterEkspor: 'Siap Ekspor',
      umkmBinaan: 'Binaan DJBC',
      keterangan: 'Tetap',
      alamatUsaha: '',
      kanwilPembina: currentUser.role === 'operator_kanwil' && currentUser.kanwilAssignment ? currentUser.kanwilAssignment : 'Kanwil DJBC Jawa Timur I',
      satkerPelaksana: 'KPPBC TMP B Sidoarjo',
      pic: {
        nama: '',
        jenisKelamin: 'Laki-laki',
        noHpWa: '',
        email: '',
        jabatan: 'Penanggung Jawab Usaha'
      }
    });
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (umkm: UMKMEntity) => {
    setEditingUmkm(umkm);
    setFormData({
      satkerKode: umkm.satkerKode || '080100',
      satkerNama: umkm.satkerNama || 'KPPBC TMP B Sidoarjo',
      namaUmkm: umkm.namaUmkm,
      nibNpwp: umkm.nibNpwp,
      provinsi: umkm.provinsi,
      kotaKabupaten: umkm.kotaKabupaten,
      kbli: umkm.kbli,
      kbliDeskripsi: umkm.kbliDeskripsi,
      komoditasUtama: umkm.komoditasUtama,
      statusOperasional: (umkm.statusOperasional as StatusUMKM) || 'Masih Beroperasi',
      klasterEkspor: (umkm.klasterEkspor as KlasterUMKM) || 'Siap Ekspor',
      umkmBinaan: (umkm.umkmBinaan as BinaanStatus) || 'Binaan DJBC',
      keterangan: (umkm.keterangan as KeteranganBinaan) || 'Tetap',
      alamatUsaha: umkm.alamatUsaha || '',
      kanwilPembina: umkm.kanwilPembina || 'Kanwil DJBC Jawa Timur I',
      satkerPelaksana: umkm.satkerPelaksana || 'KPPBC TMP B Sidoarjo',
      pic: { ...umkm.pic }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) {
      alert('Akses ditolak: Hanya Superadmin yang berwenang memodifikasi Database UMKM Binaan DJBC.');
      return;
    }

    if (!formData.namaUmkm || !formData.komoditasUtama || !formData.pic.nama) {
      alert('Mohon lengkapi Nama UMKM, Komoditas Utama, dan Nama PIC.');
      return;
    }

    if (editingUmkm) {
      updateUmkm(editingUmkm.id, formData);
      setEditingUmkm(null);
    } else {
      addUmkm(formData);
      setIsAddModalOpen(false);
    }
  };

  // Export CSV dengan komponen kolom sesuai instruksi resmi
  const handleExportCsv = () => {
    const headers = [
      'No.,Satker_Kode,Satker_Nama,UMKM_Nama,UMKM_ID,UMKM_Provinsi,UMKM_Kota,UMKM_PIC_Nama,Jenis Kelamin,UMKM_PIC_HP,UMKM_PIC_Surel,UMKM_Bidang_Usaha_KBLI,UMKM_Produksi,UMKM_Status,UMKM_Klasterisasi_Ekspor,UMKM_Binaan,UMKM_Keterangan'
    ];
    const rows = filteredList.map((u, idx) =>
      [
        `"${idx + 1}"`,
        `"${u.satkerKode || '-'}"`,
        `"${u.satkerNama || '-'}"`,
        `"${u.namaUmkm}"`,
        `"${u.nibNpwp}"`,
        `"${u.provinsi}"`,
        `"${u.kotaKabupaten}"`,
        `"${u.pic.nama}"`,
        `"${u.pic.jenisKelamin}"`,
        `"${u.pic.noHpWa}"`,
        `"${u.pic.email}"`,
        `"${u.kbli} - ${u.kbliDeskripsi}"`,
        `"${u.komoditasUtama}"`,
        `"${u.statusOperasional}"`,
        `"${u.klasterEkspor}"`,
        `"${u.umkmBinaan || 'Binaan DJBC'}"`,
        `"${u.keterangan || 'Tetap'}"`
      ].join(',')
    );

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Database_UMKM_Binaan_DJBC_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isFilterActive =
    searchQuery ||
    selectedStatus !== 'Semua' ||
    selectedKlaster !== 'Semua' ||
    selectedBinaan !== 'Semua' ||
    selectedKeterangan !== 'Semua';

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedStatus('Semua');
    setSelectedKlaster('Semua');
    setSelectedBinaan('Semua');
    setSelectedKeterangan('Semua');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Bar: Kemenkeu Blue & Gold Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#191e4a] border border-[#2b3577] rounded-3xl text-white shadow-xl">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2.5">
            <span>DATABASE UMKM BINAAN DJBC</span>
            <span className="text-xs font-bold text-slate-950 bg-amber-400 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {filteredList.length} Entitas
            </span>
          </h2>
          <p className="text-xs text-blue-200 mt-1">
            Basis data profil business entity, PIC, bidang usaha KBLI, status operasional, dan klasterisasi ekspor.
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
            Ekspor CSV
          </button>

          {canEdit && (
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Tambah Data UMKM
            </button>
          )}
        </div>
      </div>

      {/* RBAC Notice: Hanya Superadmin yang dapat mengedit */}
      {!canEdit && (
        <div className="flex items-center gap-2 p-3 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-600">
          <Lock className="w-4 h-4 text-slate-500 shrink-0" />
          <span>
            Mode Pratinjau Terbatas ({currentUser.roleTitle}): <strong>Hanya Superadmin</strong> yang memiliki wewenang untuk menambah, mengubah, atau menghapus entri pada Database UMKM Binaan DJBC.
          </span>
        </div>
      )}

      {/* Filter and Search Bar with Exact Dropdown Options from Reference */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
        {/* Row 1: Primary Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama UMKM, NIB, Satker, PIC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>

          {/* Kanwil Pembina */}
          <div>
            <select
              value={selectedKanwilFilter}
              onChange={(e) => setSelectedKanwilFilter(e.target.value)}
              disabled={currentUser.role === 'operator_kanwil'}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            >
              <option value="Semua Kanwil">Semua Kanwil Pembina</option>
              {KANWIL_LIST.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>

          {/* Status UMKM Dropdown (Exact Image Reference) */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            >
              <option value="Semua">Status UMKM (Semua)</option>
              <option value="Masih Beroperasi">1. Masih Beroperasi</option>
              <option value="Sudah Tidak Beroperasi">2. Sudah Tidak Beroperasi</option>
              <option value="Tanpa Keterangan">3. Tanpa Keterangan</option>
            </select>
          </div>

          {/* Klaster UMKM Dropdown (Exact Image Reference) */}
          <div>
            <select
              value={selectedKlaster}
              onChange={(e) => setSelectedKlaster(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            >
              <option value="Semua">Klaster UMKM (Semua)</option>
              <option value="Potensi Ekspor">1. Potensi Ekspor</option>
              <option value="Siap Ekspor">2. Siap Ekspor</option>
              <option value="Telah Ekspor">3. Telah Ekspor</option>
              <option value="Tanpa Keterangan">4. Tanpa Keterangan</option>
            </select>
          </div>
        </div>

        {/* Row 2: Secondary Dropdowns (Binaan & Keterangan) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
          {/* Binaan Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium shrink-0">Binaan:</span>
            <select
              value={selectedBinaan}
              onChange={(e) => setSelectedBinaan(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            >
              <option value="Semua">Semua Binaan</option>
              <option value="Binaan DJBC">1. Binaan DJBC</option>
              <option value="Bukan Binaan DJBC">2. Bukan Binaan DJBC</option>
              <option value="Tanpa Keterangan">3. Tanpa Keterangan</option>
            </select>
          </div>

          {/* Keterangan Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium shrink-0">Keterangan:</span>
            <select
              value={selectedKeterangan}
              onChange={(e) => setSelectedKeterangan(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            >
              <option value="Semua">Semua Keterangan</option>
              <option value="Tetap">1. Tetap</option>
              <option value="Tambahan">2. Tambahan</option>
            </select>
          </div>
        </div>

        {/* Clean inline metadata counter & reset */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Menampilkan <strong className="text-slate-800 font-mono tabular-nums">{filteredList.length}</strong> dari {umkmList.length} entri Database</span>
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

      {/* 2. Structured Table with exact 17 columns requested */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-3.5 text-center">No.</th>
                <th className="py-3 px-3.5">Satker_Kode</th>
                <th className="py-3 px-3.5">Satker_Nama</th>
                <th className="py-3 px-3.5">UMKM_Nama</th>
                <th className="py-3 px-3.5">UMKM_ID</th>
                <th className="py-3 px-3.5">UMKM_Provinsi</th>
                <th className="py-3 px-3.5">UMKM_Kota</th>
                <th className="py-3 px-3.5">UMKM_PIC_Nama</th>
                <th className="py-3 px-3.5">Jenis Kelamin</th>
                <th className="py-3 px-3.5">UMKM_PIC_HP</th>
                <th className="py-3 px-3.5">UMKM_PIC_Surel</th>
                <th className="py-3 px-3.5">UMKM_Bidang_Usaha_KBLI</th>
                <th className="py-3 px-3.5">UMKM_Produksi</th>
                <th className="py-3 px-3.5">UMKM_Status</th>
                <th className="py-3 px-3.5">UMKM_Klasterisasi_Ekspor</th>
                <th className="py-3 px-3.5">UMKM_Binaan</th>
                <th className="py-3 px-3.5">UMKM_Keterangan</th>
                <th className="py-3 px-3.5 text-right sticky right-0 bg-slate-50 shadow-xs">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={18} className="py-12 text-center text-slate-400">
                    <Building2 className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-medium text-slate-600">Tidak ada data UMKM yang cocok dengan filter.</p>
                  </td>
                </tr>
              ) : (
                filteredList.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* No. */}
                    <td className="py-3 px-3.5 text-center font-mono font-medium text-slate-500 tabular-nums">
                      {idx + 1}
                    </td>

                    {/* Satker_Kode */}
                    <td className="py-3 px-3.5 font-mono text-slate-700 tabular-nums">
                      {item.satkerKode || '080100'}
                    </td>

                    {/* Satker_Nama */}
                    <td className="py-3 px-3.5 text-slate-800 font-medium">
                      {item.satkerNama || item.satkerPelaksana || 'KPPBC TMP Sidoarjo'}
                    </td>

                    {/* UMKM_Nama */}
                    <td className="py-3 px-3.5 font-semibold text-slate-900">
                      {item.namaUmkm}
                    </td>

                    {/* UMKM_ID */}
                    <td className="py-3 px-3.5 font-mono text-slate-600 tabular-nums">
                      {item.nibNpwp}
                    </td>

                    {/* UMKM_Provinsi */}
                    <td className="py-3 px-3.5 text-slate-800">
                      {item.provinsi}
                    </td>

                    {/* UMKM_Kota */}
                    <td className="py-3 px-3.5 text-slate-800">
                      {item.kotaKabupaten}
                    </td>

                    {/* UMKM_PIC_Nama */}
                    <td className="py-3 px-3.5 text-slate-900 font-medium">
                      {item.pic.nama}
                    </td>

                    {/* Jenis Kelamin */}
                    <td className="py-3 px-3.5 text-slate-700">
                      {item.pic.jenisKelamin}
                    </td>

                    {/* UMKM_PIC_HP */}
                    <td className="py-3 px-3.5 font-mono text-slate-700 tabular-nums">
                      {item.pic.noHpWa}
                    </td>

                    {/* UMKM_PIC_Surel */}
                    <td className="py-3 px-3.5 text-slate-600">
                      {item.pic.email}
                    </td>

                    {/* UMKM_Bidang_Usaha_KBLI */}
                    <td className="py-3 px-3.5 max-w-xs truncate text-slate-800" title={`${item.kbli} - ${item.kbliDeskripsi}`}>
                      <span className="font-mono text-slate-600">{item.kbli}</span> - {item.kbliDeskripsi}
                    </td>

                    {/* UMKM_Produksi */}
                    <td className="py-3 px-3.5 font-medium text-slate-900 max-w-xs truncate" title={item.komoditasUtama}>
                      {item.komoditasUtama}
                    </td>

                    {/* UMKM_Status (Dropdown Item 1) */}
                    <td className="py-3 px-3.5">
                      {item.statusOperasional === 'Masih Beroperasi' && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Masih Beroperasi
                        </span>
                      )}
                      {item.statusOperasional === 'Sudah Tidak Beroperasi' && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                          Sudah Tidak Beroperasi
                        </span>
                      )}
                      {item.statusOperasional === 'Tanpa Keterangan' && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                          Tanpa Keterangan
                        </span>
                      )}
                    </td>

                    {/* UMKM_Klasterisasi_Ekspor (Dropdown Item 2) */}
                    <td className="py-3 px-3.5">
                      {item.klasterEkspor === 'Telah Ekspor' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          ✦ Telah Ekspor
                        </span>
                      )}
                      {item.klasterEkspor === 'Siap Ekspor' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                          ● Siap Ekspor
                        </span>
                      )}
                      {item.klasterEkspor === 'Potensi Ekspor' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          ○ Potensi Ekspor
                        </span>
                      )}
                      {item.klasterEkspor === 'Tanpa Keterangan' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          Tanpa Keterangan
                        </span>
                      )}
                    </td>

                    {/* UMKM_Binaan (Dropdown Item 3) */}
                    <td className="py-3 px-3.5 font-medium">
                      {item.umkmBinaan === 'Binaan DJBC' && (
                        <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-semibold">
                          Binaan DJBC
                        </span>
                      )}
                      {item.umkmBinaan === 'Bukan Binaan DJBC' && (
                        <span className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          Bukan Binaan DJBC
                        </span>
                      )}
                      {item.umkmBinaan === 'Tanpa Keterangan' && (
                        <span className="text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                          Tanpa Keterangan
                        </span>
                      )}
                    </td>

                    {/* UMKM_Keterangan (Dropdown Item 4) */}
                    <td className="py-3 px-3.5 font-medium">
                      {item.keterangan === 'Tetap' && (
                        <span className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          Tetap
                        </span>
                      )}
                      {item.keterangan === 'Tambahan' && (
                        <span className="text-violet-700 bg-violet-50 px-2 py-0.5 rounded border border-violet-200">
                          Tambahan
                        </span>
                      )}
                    </td>

                    {/* Aksi (Sticky right) */}
                    <td className="py-3 px-3.5 text-right sticky right-0 bg-white/95 shadow-xs">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setViewingUmkm(item)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                          title="Lihat Detail Data"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Hanya Superadmin yang dapat mengedit/menghapus */}
                        {canEdit && (
                          <>
                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                              title="Edit Data (Superadmin)"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeletingId(item.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                              title="Hapus Data (Superadmin)"
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

      {/* Modal Add / Edit UMKM (Khusus Superadmin) */}
      <Modal
        isOpen={isAddModalOpen || editingUmkm !== null}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingUmkm(null);
        }}
        title={editingUmkm ? `Edit Database UMKM: ${editingUmkm.namaUmkm}` : 'Tambah Entri Database UMKM Binaan DJBC'}
        subtitle="Formulir resmi penatausahaan profil usaha, satker pembina, dan klasifikasi ekspor."
        maxWidth="3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Section 1: Satker & Identitas Usaha */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
            <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              1. Satuan Kerja (Satker) & Identitas UMKM
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Satker_Kode *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 080100"
                  value={formData.satkerKode}
                  onChange={(e) => setFormData({ ...formData, satkerKode: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Satker_Nama *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: KPPBC TMP B Sidoarjo"
                  value={formData.satkerNama}
                  onChange={(e) => setFormData({ ...formData, satkerNama: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">UMKM_Nama *</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Usaha / Badan Usaha"
                  value={formData.namaUmkm}
                  onChange={(e) => setFormData({ ...formData, namaUmkm: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">UMKM_ID (NIB / NPWP) *</label>
                <input
                  type="text"
                  required
                  placeholder="912000xxxx / 01.xxx.xxx.x-xxx.000"
                  value={formData.nibNpwp}
                  onChange={(e) => setFormData({ ...formData, nibNpwp: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Wilayah & PIC */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
            <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              2. Wilayah Operasional & Data PIC
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">UMKM_Provinsi *</label>
                <input
                  type="text"
                  required
                  placeholder="Jawa Timur / Jawa Barat"
                  value={formData.provinsi}
                  onChange={(e) => setFormData({ ...formData, provinsi: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">UMKM_Kota *</label>
                <input
                  type="text"
                  required
                  placeholder="Kab. Bondowoso / Kota Cirebon"
                  value={formData.kotaKabupaten}
                  onChange={(e) => setFormData({ ...formData, kotaKabupaten: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">UMKM_PIC_Nama *</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Penanggung Jawab"
                  value={formData.pic.nama}
                  onChange={(e) => setFormData({ ...formData, pic: { ...formData.pic, nama: e.target.value } })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Jenis Kelamin *</label>
                <select
                  value={formData.pic.jenisKelamin}
                  onChange={(e) => setFormData({ ...formData, pic: { ...formData.pic, jenisKelamin: e.target.value as 'Laki-laki' | 'Perempuan' } })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">UMKM_PIC_HP *</label>
                <input
                  type="text"
                  required
                  placeholder="08xxxxxxxxxx"
                  value={formData.pic.noHpWa}
                  onChange={(e) => setFormData({ ...formData, pic: { ...formData.pic, noHpWa: e.target.value } })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">UMKM_PIC_Surel *</label>
                <input
                  type="email"
                  required
                  placeholder="pic@domain.com"
                  value={formData.pic.email}
                  onChange={(e) => setFormData({ ...formData, pic: { ...formData.pic, email: e.target.value } })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Bidang Usaha, Produksi & Dropdowns Resmi */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
            <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              3. Bidang Usaha, Produksi & Status Klasifikasi (Sesuai Standar DJBC)
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">UMKM_Bidang_Usaha_KBLI *</label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="KBLI (10792)"
                    value={formData.kbli}
                    onChange={(e) => setFormData({ ...formData, kbli: e.target.value })}
                    className="col-span-1 px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono text-slate-900 focus:outline-none"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Deskripsi KBLI"
                    value={formData.kbliDeskripsi}
                    onChange={(e) => setFormData({ ...formData, kbliDeskripsi: e.target.value })}
                    className="col-span-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">UMKM_Produksi *</label>
                <input
                  type="text"
                  required
                  placeholder="Komoditas utama yang dihasilkan"
                  value={formData.komoditasUtama}
                  onChange={(e) => setFormData({ ...formData, komoditasUtama: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              {/* 1. Status UMKM Dropdown */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Status UMKM (UMKM_Status) *
                </label>
                <select
                  value={formData.statusOperasional}
                  onChange={(e) => setFormData({ ...formData, statusOperasional: e.target.value as StatusUMKM })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                >
                  <option value="Masih Beroperasi">1. Masih Beroperasi</option>
                  <option value="Sudah Tidak Beroperasi">2. Sudah Tidak Beroperasi</option>
                  <option value="Tanpa Keterangan">3. Tanpa Keterangan</option>
                </select>
              </div>

              {/* 2. Klaster UMKM Dropdown */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Klaster UMKM (UMKM_Klasterisasi_Ekspor) *
                </label>
                <select
                  value={formData.klasterEkspor}
                  onChange={(e) => setFormData({ ...formData, klasterEkspor: e.target.value as KlasterUMKM })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                >
                  <option value="Potensi Ekspor">1. Potensi Ekspor</option>
                  <option value="Siap Ekspor">2. Siap Ekspor</option>
                  <option value="Telah Ekspor">3. Telah Ekspor</option>
                  <option value="Tanpa Keterangan">4. Tanpa Keterangan</option>
                </select>
              </div>

              {/* 3. Binaan Dropdown */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Binaan (UMKM_Binaan) *
                </label>
                <select
                  value={formData.umkmBinaan}
                  onChange={(e) => setFormData({ ...formData, umkmBinaan: e.target.value as BinaanStatus })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                >
                  <option value="Binaan DJBC">1. Binaan DJBC</option>
                  <option value="Bukan Binaan DJBC">2. Bukan Binaan DJBC</option>
                  <option value="Tanpa Keterangan">3. Tanpa Keterangan</option>
                </select>
              </div>

              {/* 4. Keterangan Dropdown */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Keterangan (UMKM_Keterangan) *
                </label>
                <select
                  value={formData.keterangan}
                  onChange={(e) => setFormData({ ...formData, keterangan: e.target.value as KeteranganBinaan })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                >
                  <option value="Tetap">1. Tetap</option>
                  <option value="Tambahan">2. Tambahan</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingUmkm(null);
              }}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-white bg-blue-700 hover:bg-blue-800 font-semibold rounded-lg shadow-xs transition-colors"
            >
              {editingUmkm ? 'Simpan Perubahan Data' : 'Simpan ke Database'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Detail View */}
      {viewingUmkm && (
        <Modal
          isOpen={true}
          onClose={() => setViewingUmkm(null)}
          title={`Detail Data: ${viewingUmkm.namaUmkm}`}
          subtitle={`Satker: ${viewingUmkm.satkerKode || '080100'} - ${viewingUmkm.satkerNama || viewingUmkm.satkerPelaksana}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-500 block text-[11px]">Satker Pembina:</span>
                <span className="font-semibold text-slate-900">{viewingUmkm.satkerKode || '-'} · {viewingUmkm.satkerNama || viewingUmkm.satkerPelaksana}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">UMKM_ID (NIB / NPWP):</span>
                <span className="font-mono font-semibold text-slate-900">{viewingUmkm.nibNpwp}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Wilayah:</span>
                <span className="font-medium text-slate-900">{viewingUmkm.kotaKabupaten}, {viewingUmkm.provinsi}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Status Binaan DJBC:</span>
                <span className="font-semibold text-blue-700">{viewingUmkm.umkmBinaan || 'Binaan DJBC'}</span>
              </div>
            </div>

            {/* Status & Klasifikasi Standar DJBC */}
            <div className="border-t pt-3">
              <h5 className="font-bold text-slate-800 mb-2">Klasifikasi & Status DJBC</h5>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[11px]">Status UMKM:</span>
                  <span className="font-semibold text-slate-800">{viewingUmkm.statusOperasional}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Klaster UMKM:</span>
                  <span className="font-semibold text-slate-800">{viewingUmkm.klasterEkspor}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Keterangan:</span>
                  <span className="font-semibold text-slate-800">{viewingUmkm.keterangan || 'Tetap'}</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-3">
              <h5 className="font-bold text-slate-800 mb-1">Produksi & Bidang Usaha</h5>
              <p className="text-slate-800 font-medium">UMKM_Produksi: {viewingUmkm.komoditasUtama}</p>
              <p className="text-slate-500 mt-0.5">KBLI: {viewingUmkm.kbli} - {viewingUmkm.kbliDeskripsi}</p>
            </div>

            <div className="border-t pt-3">
              <h5 className="font-bold text-slate-800 mb-2">Penanggung Jawab (PIC)</h5>
              <div className="grid grid-cols-2 gap-3 bg-white p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 text-[11px]">Nama:</span>
                  <div className="font-semibold text-slate-900">{viewingUmkm.pic.nama} ({viewingUmkm.pic.jenisKelamin})</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px]">No. WhatsApp / HP:</span>
                  <div className="font-mono text-slate-900">{viewingUmkm.pic.noHpWa}</div>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 text-[11px]">Email PIC:</span>
                  <div className="text-slate-900">{viewingUmkm.pic.email}</div>
                </div>
              </div>
            </div>

            <div className="border-t pt-3 flex justify-end">
              <button
                onClick={() => setViewingUmkm(null)}
                className="px-4 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal (Khusus Superadmin) */}
      {deletingId && canEdit && (
        <Modal
          isOpen={true}
          onClose={() => setDeletingId(null)}
          title="Konfirmasi Hapus Data UMKM"
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus entri UMKM ini dari database? Tindakan ini hanya dapat dilakukan oleh Superadmin.
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
                  deleteUmkm(deletingId);
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
