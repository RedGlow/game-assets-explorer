import { difference, groupBy, mapValues } from 'lodash-es';

import { Prisma } from '@prisma/client';

import { getter } from '../getter';
import prisma from '../prisma';

function checkNoDirectories(...fullNames: string[]) {
  const dirs = fullNames.filter((e) => e.endsWith("/"));
  if (dirs.length > 0) {
    throw new Error(
      `tag operations cannot be performed on directories like: ${dirs.join(
        ", "
      )}`
    );
  }
}

export async function tagFile(fullName: string, key: string, value: string) {
  checkNoDirectories(fullName);
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
  checkNoDirectories(...fullNames);
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
  checkNoDirectories(fullName);
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
  checkNoDirectories(...fullNames);
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
  // Return a promise with all the files included by the hasTags and contains criteria.
  const getIncludedFiles = async () =>
    (
      await prisma.taggedFile.findMany({
        where: {
          AND: hasTags
            .map(
              ([k, v]) =>
                ({
                  tagKey: k,
                  tagValue: v === "*" ? undefined : v,
                } as Prisma.TaggedFileWhereInput)
            )
            .concat(
              contains
                ? ({
                    fileFullName: {
                      contains,
                      mode: "insensitive",
                    },
                  } as Prisma.TaggedFileWhereInput)
                : []
            ),
        },
        distinct: ["fileFullName"],
        select: {
          fileFullName: true,
        },
      })
    ).map((v) => v.fileFullName);

  // returna promise with all the files excluded by the hasntTags criteria
  const getExcludedFiles = async (betweenFilenames: string[] = []) =>
    hasntTags.length == 0
      ? []
      : (
          await prisma.taggedFile.findMany({
            where: {
              AND: hasntTags
                .map(
                  ([k, v]) =>
                    ({
                      tagKey: k,
                      tagValue: v === "*" ? undefined : v,
                    } as Prisma.TaggedFileWhereInput)
                )
                .concat(
                  betweenFilenames.length > 0
                    ? [
                        {
                          fileFullName: {
                            in: betweenFilenames,
                          },
                        },
                      ]
                    : []
                ),
            },
            distinct: ["fileFullName"],
            select: {
              fileFullName: true,
            },
          })
        ).map((v) => v.fileFullName);

  // get all files but the ones specified
  const getAllBut = (fullnames: string[]) =>
    prisma.taggedFile
      .findMany({
        where: {
          fileFullName: {
            notIn: fullnames,
          },
        },
      })
      .then((files) => files.map((files) => files.fileFullName));

  // the system is different according to whether we have or have not exclusion criteria
  if (hasTags.length == 0 && !contains) {
    // we only have an exclusion list: take the excluded files, and obtain a list without them
    const excludedResults = await getExcludedFiles();
    return getAllBut(excludedResults);
  } else {
    // we have an inclusion list: take the included files and remove the excluded files
    const includedResults = await getIncludedFiles();
    const excludedResults = await getExcludedFiles(includedResults);
    return difference(includedResults, excludedResults);
  }
}
