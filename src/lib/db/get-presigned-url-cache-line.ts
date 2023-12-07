import prisma from './prisma';

export async function getPresignedUrlCacheLine(fullname: string) {
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
}