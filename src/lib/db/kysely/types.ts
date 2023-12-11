import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type PresignedDownloadUrls = {
    fullname: string;
    expiration: Timestamp;
    url: string;
};
export type TaggedFile = {
    tagKey: string;
    tagValue: string;
    fileFullName: string;
};
export type DB = {
    PresignedDownloadUrls: PresignedDownloadUrls;
    TaggedFile: TaggedFile;
};
