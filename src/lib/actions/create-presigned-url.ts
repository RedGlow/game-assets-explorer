"use server"
import { getSignedDownloadUrl } from '@/lib/get-signed-download-url';

export async function createPresignedUrl(fullname: string) {
  const result = await getSignedDownloadUrl(fullname);
  return result;
}

