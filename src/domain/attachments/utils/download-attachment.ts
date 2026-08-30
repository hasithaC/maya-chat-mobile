import * as FileSystem from 'expo-file-system';
import {attachmentsApi} from '../api/attachments.api';
import type {DownloadAttachmentResult} from '../types/attachments.types';

const CACHE_DIR = `${FileSystem.cacheDirectory}attachments/`;

function sanitizeFileName(url: string): string {
  return url.replace(/[^a-zA-Z0-9._-]/g, '_');
}

async function ensureCacheDir(): Promise<void> {
  const info = await FileSystem.getInfoAsync(CACHE_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(CACHE_DIR, {intermediates: true});
  }
}

// Caches the downloaded file on disk (keyed by a sanitized filename derived
// from the source URL) so a re-rendered bubble reuses the local copy instead
// of re-requesting a presigned URL and re-downloading unchanged attachments.
export async function downloadAttachment(url: string): Promise<DownloadAttachmentResult> {
  const localUri = `${CACHE_DIR}${sanitizeFileName(url)}`;

  const existing = await FileSystem.getInfoAsync(localUri);
  if (existing.exists) {
    return {success: true, localUri};
  }

  const presign = await attachmentsApi.presignDownload(url);
  if (!presign.success) {
    return {success: false, localUri: '', error: presign.error};
  }

  try {
    await ensureCacheDir();
    await FileSystem.downloadAsync(presign.downloadUrl, localUri);
    return {success: true, localUri};
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to download file';
    return {success: false, localUri: '', error: message};
  }
}
