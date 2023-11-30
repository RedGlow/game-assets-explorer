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
  [fullName: string]: [string, string][];
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
    (rows) => rows.map((row) => [row.tagKey, row.tagValue] as [string, string])
  );
  // return the result
  return result;
}

export async function removeTag(
  fullName: string,
  tagKey: string,
  tagValue: string
) {
  await prisma.taggedFile.delete({
    where: {
      tagKey_tagValue_fileFullName: {
        fileFullName: fullName,
        tagKey,
        tagValue,
      },
    },
  });
}
