import { groupBy, mapValues } from 'lodash-es';

import { getter } from '../getter';
import { getDB } from './kysely/db';
import { ITags } from './types';

export async function getTags(fullNames: string[]): Promise<ITags> {
  if (fullNames.length == 0) {
    return {};
  }
  const results = await getDB()
    .selectFrom("TaggedFile")
    .where("fileFullName", "in", fullNames)
    .selectAll()
    .execute();
  const grouped = groupBy(results, getter("fileFullName"));
  const result = mapValues(grouped, (rows) =>
    rows.map((row) => [row.tagKey, row.tagValue] as [string, string])
  );
  return result;
}
