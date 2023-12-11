import { groupBy, mapValues } from 'lodash-es';

import { getter } from '../getter';
import { getDB } from './kysely/db';
// import prisma from "./prisma";
import { ITags } from './types';

export async function getTags(fullNames: string[]): Promise<ITags> {
  const results2 = await getDB()
    .selectFrom("TaggedFile")
    .where("fileFullName", "in", fullNames)
    .selectAll()
    .execute();
  const grouped2 = groupBy(results2, getter("fileFullName"));
  const result2 = mapValues(grouped2, (rows) =>
    rows.map((row) => [row.tagKey, row.tagValue] as [string, string])
  );
  return result2;
}
