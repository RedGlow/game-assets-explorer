import { checkNoDirectories } from './check-no-directories';
import { getDB } from './kysely/db';

export async function tagFile(fullName: string, key: string, value: string) {
  checkNoDirectories(fullName);
  await getDB()
    .insertInto("TaggedFile")
    .values({
      fileFullName: fullName,
      tagKey: key,
      tagValue: value,
    })
    .execute();
}
