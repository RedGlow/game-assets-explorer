import { checkNoDirectories } from './check-no-directories';
import prisma from './prisma';

export async function tagFiles(
  fullNames: string[],
  key: string,
  value: string
) {
  checkNoDirectories(...fullNames);
  await prisma.taggedFile.createMany({
    data: fullNames.map((fullName) => ({
      fileFullName: fullName,
      tagKey: key,
      tagValue: value,
    })),
    skipDuplicates: true,
  });
}
