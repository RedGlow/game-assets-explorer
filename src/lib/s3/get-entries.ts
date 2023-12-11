import { ListObjectsV2Command } from '@aws-sdk/client-s3';

import { getS3Client } from './get-s3-client';

export async function getEntries(
  prefix = "/",
  continuationToken: string | undefined = undefined
) {
  const command = new ListObjectsV2Command({
    Bucket: process.env.AWS_BUCKET_NAME,
    Delimiter: "/",
    MaxKeys: 10,
    Prefix: prefix,
    ContinuationToken: continuationToken,
  });
  const client = getS3Client();
  const output = await client.send(command);
  return output;
}
