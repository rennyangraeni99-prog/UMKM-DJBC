import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { PelaporanTriwulanKanwil, StatusLaporanKanwil } from '../../types';
import { KANWIL_LIST } from '../../data/mockData';
import { Modal } from '../common/Modal';
import {
  ClipboardCheck,
  Send,
  Eye,
  Check
} from 'lucide-react';

export const PelaporanKanwilModule: React.FC = () => {
  const {
    pelaporanList,
    submitLaporanKanwil,
    verifikasiLaporan,
    currentUser,
    selectedKanwilFilter,
    setSelectedKanwilFilter
  } = useApp();

  const [selectedYear, setSelectedYear] = useState<number>(2026);

  // Modals
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [verifyingReport, setVerifyingReport] = useState<PelaporanTriwulanKanwil | null>(null);
  const [viewingReport, setViewingReport] = useState<PelaporanTriwulanKanwil | null>(null);
  const [catatanVerifikasi, setCatatanVerifikasi] = useState('');

  // Submit Form State
  const defaultKanwil = currentUser.role === 'operator_kanwil' && currentUser.kanwilAssignment
    ? currentUser.kanwilAssignment
    : KANWIL_LIST[0];

  const [formData, setFormData] = useState({
    kanwilNama: defaultKanwil,
    wilayahKode: 'KW-01',
    tahun: 2026,
    kuartal: 'TW IV' as 'TW I' | 'TW II' | 'TW III' | 'TW IV',
    status: 'Sudah Dilaporkan' as StatusLaporanKanwil,
    nomorNotaDinas: 'ND-580/WBC.11/2026',
    tanggalPenyerahan: new Date().toISOString().substring(0, 10),
    jumlahUmkmBinaan: 45,
    jumlahUmkmEkspor: 18,
    totalNilaiFobUsd: 0,
    catatanReviuPusat: 'Menunggu reviu dan verifikasi data oleh Tim Evaluasi Kantor Pusat.'
  });

  const isSuperadmin = currentUser.role === 'superadmin';
  const isOperator = currentUser.role === 'operator_kanwil';

  // Kanwil matrix computation
  const quarters: Array<'TW I' | 'TW II' | 'TW III' | 'TW IV'> = ['TW I', 'TW II', 'TW III', 'TW IV'];

  // Matrix lookup: Kanwil -> Quarter -> Report
  const matrixData = useMemo(() => {
    const list = KANWIL_LIST.filter((k) => {
      if (currentUser.role === 'operator_kanwil' && currentUser.kanwilAssignment) {
        return k === currentUser.kanwilAssignment;
      }
      if (selectedKanwilFilter !== 'Semua Kanwil') {
        return k === selectedKanwilFilter;
      }
      return true;
    });

    return list.map((kanwil) => {
      const qReports: Record<string, PelaporanTriwulanKanwil | undefined> = {};
      quarters.forEach((q) => {
        const found = pelaporanList.find((p) => p.kanwilNama === kanwil && p.kuartal === q && p.tahun === selectedYear);
        qReports[q] = found;
      });
      return {
        kanwil,
        qReports
      };
    });
  }, [pelaporanList, currentUser, selectedKanwilFilter, selectedYear]);

  // Overall compliance stats
  const complianceStats = useMemo(() => {
    const relevantReports = pelaporanList.filter((p) => p.tahun === selectedYear);
    const terverifikasi = relevantReports.filter((p) => p.status === 'Terverifikasi').length;
    const sudahLapor = relevantReports.filter((p) => p.status === 'Sudah Dilaporkan').length;
    const terlambat = relevantReports.filter((p) => p.status === 'Terlambat').length;
    const belumLapor = relevantReports.filter((p) => p.status === 'Belum Dilaporkan').length;

    return { terverifikasi, sudahLapor, terlambat, belumLapor, total: relevantReports.length };
  }, [pelaporanList, selectedYear]);

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nomorNotaDinas || !formData.tanggalPenyerahan) {
      alert('Mohon isi Nomor Nota Dinas dan Tanggal Penyerahan Laporan.');
      return;
    }

    submitLaporanKanwil({
      ...formData,
      status: 'Sudah Dilaporkan'
    });
    setIsSubmitModalOpen(false);
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyingReport) {
      verifikasiLaporan(verifyingReport.id, catatanVerifikasi);
      setVerifyingReport(null);
      setCatatanVerifikasi('');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Bar: Kemenkeu Blue & Gold Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#191e4a] border border-[#2b3577] rounded-3xl text-white shadow-xl">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2.5">
            <span>KEPATUHAN KANWIL</span>
            <span className="text-xs font-bold text-slate-950 bg-amber-400 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              TW I - TW IV
            </span>
          </h2>
          <p className="text-xs text-blue-200 mt-1">
            Matriks checklist verifikasi pelaporan berkala per Kantor Wilayah dan penatausahaan Nota Dinas (ND).
          </p>
        </div>

        {(isSuperadmin || isOperator) && (
          <button
            onClick={() => {
              setFormData({
                kanwilNama: currentUser.kanwilAssignment || KANWIL_LIST[0],
                wilayahKode: 'KW-BC',
                tahun: 2026,
                kuartal: 'TW IV',
                status: 'Sudah Dilaporkan',
                nomorNotaDinas: 'ND-590/WBC/2026',
                tanggalPenyerahan: new Date().toISOString().substring(0, 10),
                jumlahUmkmBinaan: 42,
                jumlahUmkmEkspor: 16,
                totalNilaiFobUsd: 0,
                catatanReviuPusat: 'Menunggu reviu kelengkapan berkas Kantor Pusat.'
              });
              setIsSubmitModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all shadow-md active:scale-95"
          >
            <Send className="w-4 h-4 stroke-[3]" />
            Submit Nota Dinas Laporan
          </button>
        )}
      </div>

      {/* Compliance Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Terverifikasi Pusat
          </span>
          <div className="mt-1.5 text-2xl font-bold font-mono text-emerald-700 tabular-nums">
            {complianceStats.terverifikasi}
          </div>
          <span className="text-[11px] text-slate-500">Berkas lengkap</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Sudah Dilaporkan (Antrean)
          </span>
          <div className="mt-1.5 text-2xl font-bold font-mono text-blue-700 tabular-nums">
            {complianceStats.sudahLapor}
          </div>
          <span className="text-[11px] text-slate-500">Menunggu verifikasi pusat</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Terlambat / Koreksi
          </span>
          <div className="mt-1.5 text-2xl font-bold font-mono text-rose-600 tabular-nums">
            {complianceStats.terlambat}
          </div>
          <span className="text-[11px] text-slate-500">Lewat batas tenggat</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Belum Dilaporkan
          </span>
          <div className="mt-1.5 text-2xl font-bold font-mono text-slate-400 tabular-nums">
            {complianceStats.belumLapor}
          </div>
          <span className="text-[11px] text-slate-500">Kuartal berjalan</span>
        </div>
      </div>

      {/* Year & Kanwil Filter */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-700">Tahun Anggaran:</span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono font-medium focus:outline-none"
          >
            <option value={2026}>Tahun 2026</option>
            <option value={2025}>Tahun 2025</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500">Filter Kanwil:</span>
          <select
            value={selectedKanwilFilter}
            onChange={(e) => setSelectedKanwilFilter(e.target.value)}
            disabled={currentUser.role === 'operator_kanwil'}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none"
          >
            <option value="Semua Kanwil">Seluruh Kanwil DJBC (Nasional)</option>
            {KANWIL_LIST.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Matrix Checklist Table (TW I - TW IV per Kanwil) */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-blue-700" />
            Matrix Kepatuhan Pelaporan Triwulan per Kantor Wilayah (Tahun {selectedYear})
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
              <tr>
                <th className="py-3 px-4 w-1/4">Kantor Wilayah Pembina</th>
                {quarters.map((q) => (
                  <th key={q} className="py-3 px-4 text-center">
                    {q} (Kuartal)
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {matrixData.map((row) => (
                <tr key={row.kanwil} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    <div className="truncate max-w-[280px]" title={row.kanwil}>
                      {row.kanwil}
                    </div>
                  </td>

                  {quarters.map((q) => {
                    const report = row.qReports[q];
                    if (!report || report.status === 'Belum Dilaporkan') {
                      return (
                        <td key={q} className="py-3 px-4 text-center">
                          <span className="text-[11px] text-slate-400 font-medium">
                            ○ Belum Ada
                          </span>
                        </td>
                      );
                    }

                    return (
                      <td key={q} className="py-3 px-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <button
                            onClick={() => setViewingReport(report)}
                            className="font-semibold text-xs hover:underline cursor-pointer"
                          >
                            {report.status === 'Terverifikasi' && (
                              <span className="text-emerald-700">✓ Terverifikasi</span>
                            )}
                            {report.status === 'Sudah Dilaporkan' && (
                              <span className="text-blue-700">● Dilaporkan</span>
                            )}
                            {report.status === 'Terlambat' && (
                              <span className="text-rose-600">✕ Terlambat</span>
                            )}
                          </button>
                          <span className="text-[10px] text-slate-500 font-mono tabular-nums mt-0.5">
                            {report.nomorNotaDinas}
                          </span>

                          {/* Quick verify button for Superadmin */}
                          {isSuperadmin && report.status === 'Sudah Dilaporkan' && (
                            <button
                              onClick={() => {
                                setVerifyingReport(report);
                                setCatatanVerifikasi(report.catatanReviuPusat || 'Data laporan telah diverifikasi sesuai rekonsiliasi data asistensi.');
                              }}
                              className="mt-1 px-2 py-0.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-[10px] font-medium transition-colors"
                            >
                              Verifikasi
                            </button>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Submit Nota Dinas (Tanpa Nilai FOB) */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Pengajuan Nota Dinas & Laporan Triwulan Kanwil"
        subtitle="Perekaman nomor nota dinas pembina dan realisasi UMKM ekspor."
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmitReport} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Kantor Wilayah Pembina *</label>
              <select
                value={formData.kanwilNama}
                onChange={(e) => setFormData({ ...formData, kanwilNama: e.target.value })}
                disabled={currentUser.role === 'operator_kanwil'}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              >
                {KANWIL_LIST.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Periode Kuartal (Triwulan) *</label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={formData.kuartal}
                  onChange={(e) => setFormData({ ...formData, kuartal: e.target.value as 'TW I' | 'TW II' | 'TW III' | 'TW IV' })}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                >
                  <option value="TW I">TW I</option>
                  <option value="TW II">TW II</option>
                  <option value="TW III">TW III</option>
                  <option value="TW IV">TW IV</option>
                </select>
                <input
                  type="number"
                  value={formData.tahun}
                  onChange={(e) => setFormData({ ...formData, tahun: Number(e.target.value) })}
                  className="px-3 py-2 border border-slate-200 rounded-lg font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Nomor Nota Dinas (ND) *</label>
              <input
                type="text"
                required
                placeholder="Contoh: ND-412/WBC.11/2026"
                value={formData.nomorNotaDinas}
                onChange={(e) => setFormData({ ...formData, nomorNotaDinas: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Tanggal Penyerahan Dokumen *</label>
              <input
                type="date"
                required
                value={formData.tanggalPenyerahan}
                onChange={(e) => setFormData({ ...formData, tanggalPenyerahan: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>
          </div>

          {/* Metric Stats of Report (Tanpa Nilai FOB) */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
            <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Ringkasan Kinerja Kuartal
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Total UMKM Binaan</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.jumlahUmkmBinaan}
                  onChange={(e) => setFormData({ ...formData, jumlahUmkmBinaan: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">UMKM Berhasil Ekspor</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.jumlahUmkmEkspor}
                  onChange={(e) => setFormData({ ...formData, jumlahUmkmEkspor: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Catatan Pengantar Satker / Kanwil</label>
            <textarea
              rows={2}
              value={formData.catatanReviuPusat}
              onChange={(e) => setFormData({ ...formData, catatanReviuPusat: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(false)}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-white bg-blue-700 hover:bg-blue-800 font-semibold rounded-lg shadow-xs transition-colors"
            >
              Kirim Nota Dinas
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Verifikasi Superadmin (Tanpa Nilai FOB) */}
      {verifyingReport && (
        <Modal
          isOpen={true}
          onClose={() => setVerifyingReport(null)}
          title={`Verifikasi Dokumen Laporan: ${verifyingReport.nomorNotaDinas}`}
          subtitle={`${verifyingReport.kanwilNama} · Kuartal ${verifyingReport.kuartal} ${verifyingReport.tahun}`}
          maxWidth="lg"
        >
          <form onSubmit={handleVerifySubmit} className="space-y-4 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Tanggal Pengajuan:</span>
                <span className="font-mono text-slate-900">{verifyingReport.tanggalPenyerahan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">UMKM Terlibat:</span>
                <span className="font-mono text-slate-900">{verifyingReport.jumlahUmkmEkspor} dari {verifyingReport.jumlahUmkmBinaan} UMKM</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Catatan Reviu Evaluasi Kantor Pusat (Direktorat Fasilitas Kepabeanan) *
              </label>
              <textarea
                rows={3}
                required
                value={catatanVerifikasi}
                onChange={(e) => setCatatanVerifikasi(e.target.value)}
                placeholder="Tuliskan catatan verifikasi, rekomendasi tindak lanjut, atau catatan kepatuhan..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setVerifyingReport(null)}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 rounded-lg"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-white bg-emerald-700 hover:bg-emerald-800 font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                Setujui & Verifikasi Laporan
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Detail View Laporan (Tanpa Nilai FOB) */}
      {viewingReport && (
        <Modal
          isOpen={true}
          onClose={() => setViewingReport(null)}
          title={`Detail Pelaporan Kanwil: ${viewingReport.kanwilNama}`}
          subtitle={`Nota Dinas: ${viewingReport.nomorNotaDinas} · Periode ${viewingReport.kuartal} ${viewingReport.tahun}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-500 block text-[11px]">Status Kepatuhan:</span>
                <span className="font-bold text-sm text-slate-900">{viewingReport.status}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Tanggal Penyerahan:</span>
                <span className="font-mono text-slate-800">{viewingReport.tanggalPenyerahan}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Total UMKM Diekspor:</span>
                <span className="font-semibold text-slate-900">{viewingReport.jumlahUmkmEkspor} Usaha</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Total UMKM Binaan:</span>
                <span className="font-semibold text-slate-900">{viewingReport.jumlahUmkmBinaan} Usaha</span>
              </div>
            </div>

            <div className="border-t pt-3">
              <h5 className="font-bold text-slate-800 mb-1">Catatan Reviu Kantor Pusat</h5>
              <p className="text-slate-700 leading-relaxed bg-white p-3 border border-slate-200 rounded-lg">
                {viewingReport.catatanReviuPusat || 'Belum ada catatan evaluasi khusus.'}
              </p>
              {viewingReport.diverifikasiOleh && (
                <p className="text-[11px] text-slate-500 mt-1.5 font-medium">
                  Diverifikasi secara digital oleh: {viewingReport.diverifikasiOleh}
                </p>
              )}
            </div>

            <div className="border-t pt-3 flex justify-end">
              <button
                onClick={() => setViewingReport(null)}
                className="px-4 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium"
              >
                Tutup
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
