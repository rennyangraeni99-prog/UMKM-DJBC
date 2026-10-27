import { getAccessToken } from './googleDriveAuth';

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
  createdTime?: string;
  webViewLink?: string;
  webContentLink?: string;
  iconLink?: string;
  thumbnailLink?: string;
  description?: string;
  owners?: Array<{
    displayName: string;
    emailAddress: string;
    photoLink?: string;
  }>;
  category?: 'peb' | 'halal' | 'nib' | 'laporan' | 'other';
}

export interface DriveStorageInfo {
  limit?: string;
  usage?: string;
  usageInDrive?: string;
  usageInDriveTrash?: string;
  user?: {
    displayName: string;
    emailAddress: string;
    photoLink?: string;
  };
}

const DRIVE_API_URL = 'https://www.googleapis.com/drive/v3';
const UPLOAD_API_URL = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';

const getHeaders = async () => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Sesi Google Drive belum terhubung. Silakan login dengan akun Google terlebih dahulu.');
  }
  return {
    Authorization: `Bearer ${token}`
  };
};

/**
 * Mendapatkan informasi kuota penyimpanan dan profil akun Google Drive
 */
export const getDriveAbout = async (): Promise<DriveStorageInfo> => {
  const headers = await getHeaders();
  const res = await fetch(`${DRIVE_API_URL}/about?fields=user,storageQuota`, {
    headers
  });
  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Gagal memuat info Google Drive: ${res.status} - ${errorBody}`);
  }
  const data = await res.json();
  return {
    limit: data.storageQuota?.limit,
    usage: data.storageQuota?.usage,
    usageInDrive: data.storageQuota?.usageInDrive,
    usageInDriveTrash: data.storageQuota?.usageInDriveTrash,
    user: data.user
  };
};

/**
 * Menampilkan daftar file dari Google Drive
 */
export const listDriveFiles = async (params?: {
  query?: string;
  pageSize?: number;
  folderId?: string;
}): Promise<DriveFile[]> => {
  const headers = await getHeaders();
  const queryParts: string[] = ['trashed = false'];

  if (params?.folderId) {
    queryParts.push(`'${params.folderId}' in parents`);
  }

  if (params?.query && params.query.trim()) {
    const cleanQuery = params.query.trim().replace(/'/g, "\\'");
    queryParts.push(`name contains '${cleanQuery}'`);
  }

  const q = encodeURIComponent(queryParts.join(' and '));
  const fields = encodeURIComponent(
    'files(id, name, mimeType, size, modifiedTime, createdTime, webViewLink, webContentLink, iconLink, thumbnailLink, description, owners)'
  );
  const pageSize = params?.pageSize || 40;

  const res = await fetch(
    `${DRIVE_API_URL}/files?q=${q}&pageSize=${pageSize}&orderBy=modifiedTime desc&fields=${fields}`,
    { headers }
  );

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Gagal membaca file dari Google Drive: ${res.status} - ${errorBody}`);
  }

  const data = await res.json();
  return (data.files || []).map((file: any) => {
    let category: DriveFile['category'] = 'other';
    const lowerName = (file.name || '').toLowerCase();
    if (lowerName.includes('peb') || lowerName.includes('ekspor') || lowerName.includes('pabean')) {
      category = 'peb';
    } else if (lowerName.includes('halal') || lowerName.includes('bpom') || lowerName.includes('mutu')) {
      category = 'halal';
    } else if (lowerName.includes('nib') || lowerName.includes('npwp') || lowerName.includes('legalitas')) {
      category = 'nib';
    } else if (lowerName.includes('laporan') || lowerName.includes('rekap') || lowerName.includes('asistensi')) {
      category = 'laporan';
    }
    return { ...file, category };
  });
};

/**
 * Membuat folder baru di Google Drive
 */
export const createDriveFolder = async (folderName: string, parentFolderId?: string): Promise<DriveFile> => {
  const headers = await getHeaders();
  const metadata: any = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder'
  };
  if (parentFolderId) {
    metadata.parents = [parentFolderId];
  }

  const res = await fetch(`${DRIVE_API_URL}/files`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(metadata)
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gagal membuat folder Google Drive: ${err}`);
  }

  return await res.json();
};

/**
 * Mencari atau membuat folder khusus DJBC UMKM Ekspor di Google Drive
 */
export const findOrCreateDJBCFolder = async (): Promise<string> => {
  const headers = await getHeaders();
  const folderName = 'DJBC - Dokumen Ekspor UMKM';
  const q = encodeURIComponent(`mimeType = 'application/vnd.google-apps.folder' and name = '${folderName}' and trashed = false`);
  
  const searchRes = await fetch(`${DRIVE_API_URL}/files?q=${q}&fields=files(id,name)`, { headers });
  if (searchRes.ok) {
    const data = await searchRes.json();
    if (data.files && data.files.length > 0) {
      return data.files[0].id;
    }
  }

  const created = await createDriveFolder(folderName);
  return created.id;
};

/**
 * Mengunggah file ke Google Drive (Multipart Upload)
 */
export const uploadFileToDrive = async (
  file: File,
  folderId?: string,
  description?: string,
  customFileName?: string
): Promise<DriveFile> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Sesi Google Drive belum terhubung');

  const metadata: any = {
    name: customFileName || file.name,
    mimeType: file.type || 'application/octet-stream',
    description: description || 'Dokumen Asistensi Ekspor UMKM Bea Cukai'
  };

  if (folderId) {
    metadata.parents = [folderId];
  }

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const reader = new FileReader();
  const fileData = await new Promise<ArrayBuffer>((resolve, reject) => {
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });

  const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json; charset=UTF-8' });
  const fileBlob = new Blob([fileData], { type: file.type || 'application/octet-stream' });

  const multipartBody = new Blob([
    delimiter,
    'Content-Type: application/json; charset=UTF-8\r\n\r\n',
    metadataBlob,
    delimiter,
    `Content-Type: ${file.type || 'application/octet-stream'}\r\n\r\n`,
    fileBlob,
    closeDelimiter
  ]);

  const res = await fetch(UPLOAD_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': `multipart/related; boundary=${boundary}`
    },
    body: multipartBody
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gagal mengunggah file ke Google Drive: ${errorText}`);
  }

  return await res.json();
};

/**
 * Menyimpan data JSON/Laporan Rekapitulasi langsung ke Google Drive
 */
export const saveReportToDrive = async (
  fileName: string,
  content: string,
  mimeType: string = 'application/json',
  folderId?: string
): Promise<DriveFile> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Sesi Google Drive belum terhubung');

  const metadata: any = {
    name: fileName,
    mimeType: mimeType,
    description: 'Generated by Sistem Informasi Asistensi Ekspor UMKM DJBC'
  };

  if (folderId) {
    metadata.parents = [folderId];
  }

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartBody = [
    delimiter,
    'Content-Type: application/json; charset=UTF-8\r\n\r\n',
    JSON.stringify(metadata),
    delimiter,
    `Content-Type: ${mimeType}\r\n\r\n`,
    content,
    closeDelimiter
  ].join('');

  const res = await fetch(UPLOAD_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': `multipart/related; boundary=${boundary}`
    },
    body: multipartBody
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gagal menyimpan laporan ke Google Drive: ${errText}`);
  }

  return await res.json();
};

/**
 * Menghapus file dari Google Drive
 * CATATAN PENTING: Tindakan destruktif ini HARUS selalu didahului
 * dialog konfirmasi eksplisit kepada user di antarmuka UI!
 */
export const deleteDriveFile = async (fileId: string): Promise<void> => {
  const headers = await getHeaders();
  const res = await fetch(`${DRIVE_API_URL}/files/${fileId}`, {
    method: 'DELETE',
    headers
  });

  if (!res.ok && res.status !== 204 && res.status !== 404) {
    const errorText = await res.text();
    throw new Error(`Gagal menghapus file dari Google Drive: ${errorText}`);
  }
};
