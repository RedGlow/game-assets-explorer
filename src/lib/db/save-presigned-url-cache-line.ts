import { getDB } from './kysely/db';

export async function savePresignedUrlCacheLine(
  fullname: string,
  signedUrl: string,
  expiresIn: number
) {
  const currDate = new Date();
  const expireDate = new Date(currDate.getTime() + 1000 * expiresIn);
  getDB()
    .insertInto("PresignedDownloadUrls")
    .values({
      fullname,
      expiration: expireDate,
      url: signedUrl,
    })
    .execute();
  console.log(
    `caching ${fullname} expires at ${expireDate} and is ${signedUrl}`
  );
}
