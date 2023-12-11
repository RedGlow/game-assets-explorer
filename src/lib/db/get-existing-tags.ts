import { groupBy, mapValues } from 'lodash-es';

import { getter } from '../getter';
import { getDB } from './kysely/db';

export async function getExistingTags() {
  // get unique combinations of key-value
  const results = await getDB()
    .selectFrom("TaggedFile")
    .select(["tagKey", "tagValue"])
    .distinct()
    .execute();
  // group by key, and then for each key just map the values
  const grouped = groupBy(results, getter("tagKey"));
  const map = mapValues(grouped, (values) => values.map(getter("tagValue")));

  return map;
}
