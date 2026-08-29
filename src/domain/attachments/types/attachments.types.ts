export interface PresignDownloadSuccess {
  success: true;
  downloadUrl: string;
  expiresIn: number;
}

export interface PresignDownloadFailure {
  success: false;
  downloadUrl: '';
  expiresIn: 0;
  error: string;
}

export type PresignDownloadResult = PresignDownloadSuccess | PresignDownloadFailure;

export interface DownloadAttachmentSuccess {
  success: true;
  localUri: string;
}

export interface DownloadAttachmentFailure {
  success: false;
  localUri: '';
  error: string;
}

export type DownloadAttachmentResult = DownloadAttachmentSuccess | DownloadAttachmentFailure;
