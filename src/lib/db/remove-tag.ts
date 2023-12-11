import { checkNoDirectories } from './check-no-directories';
import { getDB } from './kysely/db';
import prisma from './prisma';

export async function removeTag(
  fullName: string,
  tagKey: string,
  tagValue: string
) {
  checkNoDirectories(fullName);
  await prisma.taggedFile.delete({
    where: {
      tagKey_tagValue_fileFullName: {
        fileFullName: fullName,
        tagKey,
        tagValue,
      },
    },
  });
  await getDB
}
