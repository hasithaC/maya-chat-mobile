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

export interface PresignUploadSuccess {
  success: true;
  uploadUrl: string;
  fileUrl: string;
}

export interface PresignUploadFailure {
  success: false;
  uploadUrl: '';
  fileUrl: '';
  error: string;
}

export type PresignUploadResult = PresignUploadSuccess | PresignUploadFailure;

export interface UploadAttachmentSuccess {
  success: true;
  url: string;
}

export interface UploadAttachmentFailure {
  success: false;
  url: '';
  error: string;
}

export type UploadAttachmentResult = UploadAttachmentSuccess | UploadAttachmentFailure;
