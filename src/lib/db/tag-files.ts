import { checkNoDirectories } from './check-no-directories';
import { getDB } from './kysely/db';

export async function tagFiles(
  fullNames: string[],
  key: string,
  value: string
) {
  checkNoDirectories(...fullNames);
  // await prisma.taggedFile.createMany({
  //   data: fullNames.map((fullName) => ({
  //     fileFullName: fullName,
  //     tagKey: key,
  //     tagValue: value,
  //   })),
  //   skipDuplicates: true,
  // });
  await getDB()
    .insertInto("TaggedFile")
    .values(
      fullNames.map((fullName) => ({
        fileFullName: fullName,
        tagKey: key,
        tagValue: value,
      }))
    )
    .onConflict((cb) => cb.doNothing())
    .execute();
}
