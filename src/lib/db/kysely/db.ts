import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

import { DB } from './types'; // this is the Database interface we defined earlier

let db: Kysely<DB> | undefined;

export function getDB() {
  if (db == undefined) {
    db = new Kysely<DB>({
      dialect: new PostgresDialect({
        pool: new Pool({
          connectionString: process.env.DATABASE_URL,
        }),
      }),
    });
  }
  return db;
}