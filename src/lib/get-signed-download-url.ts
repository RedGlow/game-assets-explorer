import { getPresignedUrlCacheLine, savePresignedUrlCacheLine } from './db';
import { createSignedUrl } from './s3';

export async function getSignedDownloadUrl(
  fullname: string,
  expiresIn: number = 3600
) {
  const presignedDownloadUrl = await getPresignedUrlCacheLine(fullname);
  if (presignedDownloadUrl !== undefined) {
    return presignedDownloadUrl;
  }

  const signedUrl = await createSignedUrl(fullname, expiresIn);
  await savePresignedUrlCacheLine(fullname, signedUrl, expiresIn);
  return signedUrl;
}
