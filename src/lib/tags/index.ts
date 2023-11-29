import groupBy from 'lodash-es/groupBy';
import mapValues from 'lodash-es/mapValues';

import prisma from '../prisma';

export async function tagFile(fullName: string, key: string, value: string) {
  await prisma.taggedFile.create({
    data: {
      fileFullName: fullName,
      tagKey: key,
      tagValue: value,
    },
  });
}

export interface ITags {
  [fullName: string]: {
    [tagKey: string]: string[];
  };
}

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
  const result = mapValues(
    groupBy(results, (row) => row.fileFullName),
    (rows) =>
      mapValues(
        groupBy(rows, (row) => row.tagKey),
        (rows) => rows.map((row) => row.tagValue)
      )
  );
  // return the result
  return result;
}
