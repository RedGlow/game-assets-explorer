import { groupBy, mapValues } from 'lodash-es';

import { getter } from '../getter';
import prisma from './prisma';

export async function getExistingTags() {
  // get unique combinations of key-value
  const results = await prisma.taggedFile.findMany({
    select: {
      tagKey: true,
      tagValue: true,
    },
    distinct: ["tagKey", "tagValue"],
  });
  // group by key, and then for each key just map the values
  const grouped = groupBy(results, getter("tagKey"));
  const map = mapValues(grouped, (values) => values.map(getter("tagValue")));
  return map;
}
