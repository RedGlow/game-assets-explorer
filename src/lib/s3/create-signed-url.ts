import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { getS3Client } from './get-s3-client';

export async function createSignedUrl(fullname: string, expiresIn: number) {
  // no cached url, or expired url: create a new one
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fullname,
  });
  const client = getS3Client();
  const signedUrl = await getSignedUrl(client, command, {
    expiresIn,
  });
  return signedUrl;
}
