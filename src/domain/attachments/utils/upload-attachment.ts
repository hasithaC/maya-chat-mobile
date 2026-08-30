import * as FileSystem from 'expo-file-system';
import {attachmentsApi} from '../api/attachments.api';
import type {UploadAttachmentResult} from '../types/attachments.types';

// Uploads a local file directly to the presigned S3 url (raw binary PUT
// body, no multipart wrapper) and returns the permanent object url to store
// on the message's attachment.
export async function uploadAttachment(
  localUri: string,
  contentType: string,
  conversationId: number,
  fileName: string,
): Promise<UploadAttachmentResult> {
  const info = await FileSystem.getInfoAsync(localUri, {size: true});
  const fileSize = info.exists ? (info.size ?? 0) : 0;
  if (fileSize <= 0) {
    return {success: false, url: '', error: 'Could not read local file size'};
  }

  const presign = await attachmentsApi.presignUpload({
    conversationId,
    fileName,
    fileType: contentType,
    fileSize,
  });
  if (!presign.success) {
    return {success: false, url: '', error: presign.error};
  }

  try {
    const result = await FileSystem.uploadAsync(presign.uploadUrl, localUri, {
      httpMethod: 'PUT',
      uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
      headers: {'Content-Type': contentType},
    });

    if (result.status < 200 || result.status >= 300) {
      return {success: false, url: '', error: `Upload failed with status ${result.status}`};
    }

    return {success: true, url: presign.fileUrl};
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to upload file';
    return {success: false, url: '', error: message};
  }
}
