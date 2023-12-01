import groupBy from 'lodash-es/groupBy';
import mapValues from 'lodash-es/mapValues';

import { Prisma } from '@prisma/client';

import { getter } from '../getter';
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

export async function tagFiles(
  fullNames: string[],
  key: string,
  value: string
) {
  await prisma.taggedFile.createMany({
    data: fullNames.map((fullName) => ({
      fileFullName: fullName,
      tagKey: key,
      tagValue: value,
    })),
    skipDuplicates: true,
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
  const grouped = groupBy(results, getter("fileFullName"));
  const result = mapValues(grouped, (rows) =>
    rows.map((row) => [row.tagKey, row.tagValue] as [string, string])
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

export async function removeTags(fullNames: string[]) {
  await prisma.taggedFile.deleteMany({
    where: {
      fileFullName: {
        in: fullNames,
      },
    },
  });
}

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

export async function search(
  hasTags: [string, string][],
  hasntTags: [string, string][],
  contains?: string
) {
  const results = await prisma.taggedFile.findMany({
    where: {
      AND: hasntTags
        .map(
          ([k, v]) =>
            ({
              NOT: {
                tagKey: k,
                tagValue: v === "*" ? undefined : v,
              },
            } as Prisma.TaggedFileWhereInput)
        )
        .concat(
          hasTags.map(
            ([k, v]) =>
              ({
                tagKey: k,
                tagValue: v === "*" ? undefined : v,
              } as Prisma.TaggedFileWhereInput)
          )
        )
        .concat(
          contains
            ? ({
                fileFullName: {
                  contains,
                },
              } as Prisma.TaggedFileWhereInput)
            : []
        ),
    },
    distinct: ["fileFullName"],
    select: {
      fileFullName: true,
    },
  });
  return results.map((result) => result.fileFullName);
}
