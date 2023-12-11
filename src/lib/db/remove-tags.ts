import { checkNoDirectories } from './check-no-directories';
import { getDB } from './kysely/db';

export async function removeTags(fullNames: string[]) {
  checkNoDirectories(...fullNames);
  await getDB()
    .deleteFrom("TaggedFile")
    .where("fileFullName", "in", fullNames)
    .execute();
}
