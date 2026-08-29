import {apiClient} from '../../../core/api/api-client';
import type {PresignDownloadResult} from '../types/attachments.types';

const ENDPOINTS = {
  PRESIGN_DOWNLOAD: '/api/v1/messages/attachments/presign-download',
};

const S3_KEY_PATTERN = /^https?:\/\/[^/]+\/(.+)$/;

function extractS3Key(url: string): string {
  const match = url.match(S3_KEY_PATTERN);
  return match ? match[1] : url;
}

export const attachmentsApi = {
  // Never throws — private S3 objects need a fresh presigned URL on every
  // access, and callers (image bubbles, voice notes) render inline, so a
  // rejected promise would need try/catch scattered through every call site.
  presignDownload: async (url: string): Promise<PresignDownloadResult> => {
    try {
      const s3Key = extractS3Key(url);
      const response = await apiClient.post<{downloadUrl: string; expiresIn: number}>(
        ENDPOINTS.PRESIGN_DOWNLOAD,
        {s3Key},
      );
      return {
        success: true,
        downloadUrl: response.data.downloadUrl,
        expiresIn: response.data.expiresIn,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get download link';
      return {success: false, downloadUrl: '', expiresIn: 0, error: message};
    }
  },
};
