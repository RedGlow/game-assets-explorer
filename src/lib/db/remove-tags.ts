import { checkNoDirectories } from './check-no-directories';
import prisma from './prisma';

export async function removeTags(fullNames: string[]) {
  checkNoDirectories(...fullNames);
  await prisma.taggedFile.deleteMany({
    where: {
      fileFullName: {
        in: fullNames,
      },
    },
  });
}
