import {
    GetObjectCommand, ListBucketsCommand, ListObjectsV2Command, S3Client
} from '@aws-sdk/client-s3';
import { fromEnv } from '@aws-sdk/credential-providers'; // ES6 import
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import prisma from '../prisma';

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

export async function getEntries(prefix = "/") {
  const command = new ListObjectsV2Command({
    Bucket: process.env.AWS_BUCKET_NAME,
    Delimiter: "/",
    MaxKeys: 800,
    Prefix: prefix,
  });
  const client = getS3Client();
  const output = await client.send(command);
  return output;
}

export async function getSignedDownloadUrl(
  fullname: string,
  expiresIn: number = 3600
) {
  // first check (and possibly clean) the presigned urls cache
  const currDate = new Date();
  const presignedDownloadUrl = await prisma.presignedDownloadUrls.findUnique({
    where: {
      fullname,
    },
  });
  if (presignedDownloadUrl !== null && presignedDownloadUrl !== undefined) {
    const url = presignedDownloadUrl.url;
    const expireDate = presignedDownloadUrl.expiration;
    console.log(`found cache entry with date ${expireDate} and url ${url}`);
    if (currDate < expireDate) {
      console.log("url entry found!");
      return url;
    } else {
      console.log("url entry expired, clean up cache");
      await prisma.presignedDownloadUrls.delete({
        where: {
          fullname,
        },
      });
    }
  } else {
    console.log("url entry not found");
  }

  // no cached url, or expired url: create a new one
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fullname,
  });
  const client = getS3Client();
  const signedUrl = await getSignedUrl(client, command, {
    expiresIn,
  });

  // save in cache
  const expireDate = new Date(currDate.getTime() + 1000 * expiresIn);
  await prisma.presignedDownloadUrls.create({
    data: {
      fullname,
      expiration: expireDate,
      url: signedUrl,
    },
  });
  console.log(
    `caching ${fullname} expires at ${expireDate} and is ${signedUrl}`
  );

  // return result
  return signedUrl;
}
