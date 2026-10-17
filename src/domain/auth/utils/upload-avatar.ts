import * as FileSystem from 'expo-file-system';
import {authApi} from '../api/auth.api';

export type UploadAvatarResult =
  | {success: true; url: string}
  | {success: false; url: ''; error: string};

// Uploads a local profile photo directly to the presigned S3 url (raw
// binary PUT body, no multipart wrapper) and returns the permanent object
// url to send as `avatarUrl` on account creation.
export async function uploadAvatar(
  localUri: string,
  contentType: string,
  verifyToken: string,
): Promise<UploadAvatarResult> {
  const info = await FileSystem.getInfoAsync(localUri, {size: true});
  const fileSize = info.exists ? (info.size ?? 0) : 0;
  if (fileSize <= 0) {
    return {success: false, url: '', error: 'Could not read local file size'};
  }

  try {
    const presign = await authApi.presignAvatarUpload({
      verifyToken,
      fileName: `avatar-${Date.now()}.jpg`,
      fileType: contentType,
      fileSize,
    });

    const result = await FileSystem.uploadAsync(presign.uploadUrl, localUri, {
      httpMethod: 'PUT',
      uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
      headers: {'Content-Type': contentType},
    });

    if (result.status < 200 || result.status >= 300) {
      return {success: false, url: '', error: `Upload failed with status ${result.status}`};
    }

    return {success: true, url: presign.publicUrl};
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to upload avatar';
    return {success: false, url: '', error: message};
  }
}
