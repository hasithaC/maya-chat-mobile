import {apiClient} from '../../../core/api/api-client';
import type {PresignDownloadResult, PresignUploadResult} from '../types/attachments.types';

const ENDPOINTS = {
  PRESIGN_DOWNLOAD: '/api/v1/messages/attachments/presign-download',
  PRESIGN_UPLOAD: '/api/v1/messages/attachments/presign-upload',
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

  // Confirmed via the server's own validation errors: it wants
  // {conversationId, fileName, fileType, fileSize} — not {fileName,
  // contentType} as originally guessed. The response's field names are
  // still unconfirmed.
  presignUpload: async (data: {
    conversationId: number;
    fileName: string;
    fileType: string;
    fileSize: number;
  }): Promise<PresignUploadResult> => {
    try {
      const response = await apiClient.post<Record<string, unknown>>(
        ENDPOINTS.PRESIGN_UPLOAD,
        data,
      );
      const body = response.data;
      const uploadUrl = String(body.uploadUrl ?? body.presignedUrl ?? body.putUrl ?? '');
      if (!uploadUrl) {
        throw new Error('Presign-upload response is missing an upload url');
      }
      const fileUrl = String(
        body.fileUrl ?? body.url ?? body.objectUrl ?? uploadUrl.split('?')[0],
      );
      return {success: true, uploadUrl, fileUrl};
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get upload link';
      return {success: false, uploadUrl: '', fileUrl: '', error: message};
    }
  },
};
