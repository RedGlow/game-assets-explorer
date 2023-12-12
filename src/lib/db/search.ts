import type { Prisma } from "@prisma/client";
import { difference } from 'lodash-es';

import { getDB } from './kysely/db';
import prisma from './prisma';

export async function search(
  hasTags: [string, string][],
  hasntTags: [string, string][],
  contains?: string
) {
  console.log(
    "search: hasTags",
    hasTags,
    "hasntTags",
    hasntTags,
    "contains",
    contains
  );
  // prepare the query (alwith with a subquery related to the hasntTags, possibly
  // returning nothing in case there are no hasntTags)
  let query = getDB()
    .with("ExcludedTaggedFiles", (db) =>
      db
        .selectFrom("TaggedFile")
        .where((eb) =>
          eb.or(
            [eb(eb.val("0"), "!=", "0")].concat(
              hasntTags.map(([k, v]) => {
                let cond = eb("tagKey", "=", k);
                return v !== "*"
                  ? eb.and([cond, eb("tagValue", "=", v)])
                  : cond;
              })
            )
          )
        )
        .select("fileFullName")
    )
    .selectFrom("TaggedFile")
    .select("fileFullName");
  // filter the requested tags
  for (const [k, v] of hasTags) {
    query = query.where("tagKey", "=", k);
    if (v !== "*") {
      query = query.where("tagValue", "=", v);
    }
  }
  // filter the requested part of the name
  if (contains) {
    query = query.where("fileFullName", "ilike", `%${contains}%`);
  }
  // filter away the tags that must not be present:
  query = query.where((eb) =>
    eb(
      "fileFullName",
      "not in",
      eb.selectFrom("ExcludedTaggedFiles").select("fileFullName")
    )
  );
  // execute and return
  const result = await query.distinct().execute();
  const filenames = result.map((row) => row.fileFullName);
  console.log("search results are #", filenames.length);
  return filenames;
}

export async function searchOld(
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
