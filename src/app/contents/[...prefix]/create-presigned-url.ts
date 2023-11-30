"use server"
import { getSignedDownloadUrl } from '@/lib/s3';

export async function createPresignedUrl(fullname: string) {
  const result = await getSignedDownloadUrl(fullname);
  return result;
}

