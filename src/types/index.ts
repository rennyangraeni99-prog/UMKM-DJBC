export type UserRole = 'superadmin' | 'operator_kanwil' | 'viewer';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  kanwilAssignment?: string;
  email: string;
  avatarText: string;
}

export type StatusUMKM = 'Masih Beroperasi' | 'Sudah Tidak Beroperasi' | 'Tanpa Keterangan';
export type StatusOperasional = StatusUMKM;

export type KlasterUMKM = 'Potensi Ekspor' | 'Siap Ekspor' | 'Telah Ekspor' | 'Tanpa Keterangan';
export type KlasterEkspor = KlasterUMKM;

export type BinaanStatus = 'Binaan DJBC' | 'Bukan Binaan DJBC' | 'Tanpa Keterangan';
export type KeteranganBinaan = 'Tetap' | 'Tambahan';
export type StatusKITE = 'Aktif' | 'Pembekuan' | 'Pencabutan' | '-';

export type JenisAsistensi = 
  | 'Klinik Ekspor Kepabeanan'
  | 'Business Matching Global'
  | 'Sosialisasi Fasilitas KITE IKM'
  | 'Asistensi Sertifikasi Mutu/Halal/HACCP'
  | 'Coaching Packaging & Logistik Kontainer'
  | 'Pelatihan Eksportir Baru (Pusdiklat)';

export type KategoriKendala = 'Finansial' | 'Pemasaran' | 'Produksi' | 'Legalitas';

export type StatusAsistensi = 'Dalam Proses' | 'Selesai' | 'Kendala Teratasi';

export type FasilitasKepabeanan = 'KITE IKM' | 'Gudang Berikat' | 'Pusat Logistik Berikat' | 'Non-Fasilitas (Reguler)';

export type TargetKelayakan = 'Mandiri' | 'Pihak Ketiga (Agregator)';

export type StatusLaporanKanwil = 'Terverifikasi' | 'Sudah Dilaporkan' | 'Belum Dilaporkan' | 'Terlambat';

export interface PICContact {
  nama: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  noHpWa: string;
  email: string;
  jabatan: string;
}

export interface UMKMEntity {
  id: string;
  satkerKode: string;
  satkerNama: string;
  namaUmkm: string;
  nibNpwp: string;
  provinsi: string;
  kotaKabupaten: string;
  pic: PICContact;
  kbli: string;
  kbliDeskripsi: string;
  komoditasUtama: string;
  statusOperasional: StatusUMKM;
  klasterEkspor: KlasterUMKM;
  umkmBinaan: BinaanStatus;
  keterangan: KeteranganBinaan;
  statusKite?: StatusKITE;
  alamatUsaha?: string;
  kanwilPembina: string;
  satkerPelaksana: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLogAsistensi {
  id: string;
  sertifikatUmkm: string; // 1. Sertifikat UMKM
  kantorWilayah: string; // 2. Kantor Wilayah
  namaUmkm: string; // 3. Nama UMKM
  namaPemilik: string; // 4. Nama Pemilik
  jenisKelamin: 'Laki-laki' | 'Perempuan'; // 5. Jenis Kelamin
  kategoriUsaha: string; // 6. Kategori Usaha
  subKategoriUsaha: string; // 7. Sub Kategori Usaha
  hasilProduksi: string; // 8. Hasil Produksi
  instansiPembina: string; // 9. Instansi Pembina
  klasterisasiUmkm: string; // 10. Klasterisasi UMKM
  statusEkspor: string; // 11. Status Ekspor
  statusFasilitasKepabeanan: string; // 12. Status Fasilitas Kepabeanan
  targetBinaanDjbc: string; // 13. Target Binaan Oleh DJBC
  kendalaUtama: string; // 14. Kendala Utama
  kendalaLainnya: string; // 15. Kendala Lainnya
  uraianKendala: string; // 16. Uraian Kendala
  jenisAsistensi: string; // 17. Jenis Asistensi
  penjelasanKegiatanAsistensi: string; // 18. Penjelasan Kegiatan Asistensi
  progressTindakLanjut: string; // 19. Progress Tindak Lanjut
  penjelasanProgressTindakLanjut: string; // 20. Penjelasan ProgressTindak Lanjut
  bentukSinergi: string; // 21. Bentuk Sinergi yang Telah Dilakukan
  hasilPemberdayaan: string; // 22. Hasil Pemberdayaan dan Tindak Lanjut
  nilaiEksporSebelumnyaIdr: number; // 23. Nilai Ekspor (FOB) Tahun Sebelumnya (dalam rupiah)
  nilaiEksporBerjalanIdr: number; // 24. Nilai Ekspor (FOB) Tahun Berjalan (dalam rupiah)
  tanggalEksporBerjalan: string; // 25. Tanggal Ekspor Tahun Berjalan
  negaraTujuanEkspor: string; // 26. Negara Tujuan Ekspor Tahun Berjalan
  statusDataInformasi: string; // 27. Status Data dan Informasi
  keterangan: string; // 28. Keterangan

  // Compatibility fields for dashboard metrics
  umkmId?: string;
  umkmNama?: string;
  kanwil?: string;
  tanggalKegiatan?: string;
  kategoriKendala?: KategoriKendala;
  statusProgres?: StatusAsistensi;
  penjelasanAktivitas?: string;
  tindakLanjut?: string;
  mitraSinergi?: string;
  petugasPendamping?: string;
  createdAt?: string;
}

export interface MetricEkspor {
  id: string;
  umkmId: string;
  umkmNama: string;
  kanwil: string;
  komoditas: string;
  fobTahunSebelumnyaUsd: number;
  fobTahunBerjalanUsd: number;
  fobTahunSebelumnyaIdr: number;
  fobTahunBerjalanIdr: number;
  tanggalEksporTerakhir: string;
  negaraTujuan: string[];
  fasilitasKepabeanan: FasilitasKepabeanan;
  targetKelayakan: TargetKelayakan;
  volumeKontainer: string;
  noPebTerakhir?: string;
  catatanTarget: string;
}

export interface PelaporanTriwulanKanwil {
  id: string;
  kanwilNama: string;
  wilayahKode: string;
  tahun: number;
  kuartal: 'TW I' | 'TW II' | 'TW III' | 'TW IV';
  status: StatusLaporanKanwil;
  nomorNotaDinas: string;
  tanggalPenyerahan: string;
  jumlahUmkmBinaan: number;
  jumlahUmkmEkspor: number;
  totalNilaiFobUsd: number;
  catatanReviuPusat: string;
  diverifikasiOleh?: string;
  dokumenLampiranUrl?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: string;
  module: string;
  details: string;
}
