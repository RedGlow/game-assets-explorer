import prisma from './prisma';

export async function savePresignedUrlCacheLine(
  fullname: string,
  signedUrl: string,
  expiresIn: number
) {
  const currDate = new Date();
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
}
