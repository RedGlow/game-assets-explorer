import { groupBy, mapValues } from 'lodash-es';

import { getter } from '../getter';
import prisma from './prisma';
import { ITags } from './types';

export async function getTags(fullNames: string[]): Promise<ITags> {
  // query prisma
  const results = await prisma.taggedFile.findMany({
    where: {
      fileFullName: {
        in: fullNames,
      },
    },
  });
  // group the rows first by fullname, then by tag key
  const grouped = groupBy(results, getter("fileFullName"));
  const result = mapValues(grouped, (rows) =>
    rows.map((row) => [row.tagKey, row.tagValue] as [string, string])
  );
  // return the result
  return result;
}
