import { S3Client } from '@aws-sdk/client-s3';
import { fromEnv } from '@aws-sdk/credential-providers';

let s3Client: S3Client | undefined = undefined;

export function getS3Client() {
  s3Client ??= new S3Client({
    region: "us-east-1",
    endpoint: process.env.AWS_API_URL, //apiUrl,
    credentials: fromEnv(),
  });
  return s3Client;
}
