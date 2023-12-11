import { getDB } from './kysely/db';

export async function getPresignedUrlCacheLine(fullname: string) {
  const currDate = new Date();
  const presignedDownloadUrl = await getDB()
    .selectFrom("PresignedDownloadUrls")
    .where("fullname", "=", fullname)
    .select(["url", "expiration"])
    .limit(2)
    .executeTakeFirst();
  if (presignedDownloadUrl !== null && presignedDownloadUrl !== undefined) {
    const url = presignedDownloadUrl.url;
    const expireDate = presignedDownloadUrl.expiration;
    console.log(`found cache entry with date ${expireDate} and url ${url}`);
    if (currDate < expireDate) {
      console.log("url entry found!");
      return url;
    } else {
      console.log("url entry expired, clean up cache");
      await getDB()
        .deleteFrom("PresignedDownloadUrls")
        .where("fullname", "=", fullname)
        .execute();
    }
  } else {
    console.log("url entry not found");
  }
}
