import { SelectQueryBuilder } from 'kysely';

import { getDB } from './kysely/db';
import { DB } from './kysely/types';

export async function search(
  page: number,
  pageSize: number,
  hasTags: [string, string][],
  hasntTags: [string, string][],
  contains?: string
) {
  return await getDB()
    .transaction()
    .execute(async (transaction) => {
      // prepare the query (alwith with a subquery related to the hasntTags, possibly
      // returning nothing in case there are no hasntTags)
      const createQuery = () =>
        transaction
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
          .selectFrom("TaggedFile");

      const addWhere = <T>(
        q: SelectQueryBuilder<
          DB & {
            ExcludedTaggedFiles: {
              fileFullName: string;
            };
          },
          "TaggedFile",
          T
        >
      ) => {
        // filter the requested tags
        for (const [k, v] of hasTags) {
          q = q.where("tagKey", "=", k);
          if (v !== "*") {
            q = q.where("tagValue", "=", v);
          }
        }
        // filter the requested part of the name
        if (contains) {
          q = q.where("fileFullName", "ilike", `%${contains}%`);
        }
        // filter away the tags that must not be present:
        q = q.where((eb) =>
          eb(
            "fileFullName",
            "not in",
            eb.selectFrom("ExcludedTaggedFiles").select("fileFullName")
          )
        );
        // return
        return q;
      };
      // execute and return
      const resultsPromise = addWhere(createQuery().select("fileFullName"))
        .orderBy("fileFullName asc")
        .distinct()
        .offset(page * pageSize)
        .limit(pageSize)
        .execute();
      const countPromise = addWhere(
        createQuery().select((eb) => eb.fn.countAll().as("count"))
      )
        .distinct()
        .executeTakeFirstOrThrow();
      // const countPromise = Promise.resolve({ count: 100 });
      const [results, { count }] = await Promise.all([
        resultsPromise,
        countPromise,
      ]);

      // const result = await query.distinct().execute();
      // const filenames = results.map((row) => row.fileFullName);
      // return [filenames, count as number] as const;
      return [results.map((row) => row.fileFullName), count] as const;
    });
}
