import {
    ListBucketsCommand, ListObjectsV2Command, PutObjectTaggingCommand, S3Client
} from '@aws-sdk/client-s3';
import { fromEnv } from '@aws-sdk/credential-providers'; // ES6 import

let s3Client: S3Client | undefined = undefined;

function getS3Client() {
  s3Client ??= new S3Client({
    region: "us-east-1",
    endpoint: process.env.AWS_API_URL, //apiUrl,
    credentials: fromEnv(),
  });
  return s3Client;
}

export async function listBuckets() {
  var lbc = new ListBucketsCommand({});
  const commandOutput = await getS3Client().send(lbc);
  return commandOutput.Buckets;
}

export async function getEntries(prefix = "Kenney/") {
  const command = new ListObjectsV2Command({
    Bucket: process.env.AWS_BUCKET_NAME,
    Delimiter: "/",
    MaxKeys: 20,
    Prefix: prefix,
  });
  const client = getS3Client();
  const output = await client.send(command);
  return output;
}
