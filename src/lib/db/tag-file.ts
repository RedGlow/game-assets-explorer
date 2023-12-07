import { checkNoDirectories } from './check-no-directories';
import prisma from './prisma';

export async function tagFile(fullName: string, key: string, value: string) {
  checkNoDirectories(fullName);
  await prisma.taggedFile.create({
    data: {
      fileFullName: fullName,
      tagKey: key,
      tagValue: value,
    },
  });
}
