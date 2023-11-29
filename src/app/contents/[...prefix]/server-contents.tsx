import { revalidatePath } from 'next/cache';

import { getEntries } from '@/lib/s3';
import { getTags, tagFile } from '@/lib/tags';
import { ListObjectsV2CommandOutput } from '@aws-sdk/client-s3';

import { Contents } from './contents';
import { IContentsEntry, IServerContentsProps } from './contents.types';

function listObjectsToEntries(
  entries: ListObjectsV2CommandOutput
): IContentsEntry[] {
  const dirEntries: IContentsEntry[] = (entries.CommonPrefixes || []).map(
    (cp) => ({
      kind: "directory",
      fullName: cp.Prefix || "",
    })
  );
  const fileEntries: IContentsEntry[] = (entries.Contents || [])
    .filter((c) => c.Size !== undefined && c.Size !== 0)
    .map((c) => ({
      kind: "file",
      fullName: c.Key || "",
      size: c.Size || 0,
    }));
  return dirEntries.concat(fileEntries);
}

async function setTag(fullName: string, tag: string) {
  "use server";

  await tagFile(fullName, "type", tag);

  revalidatePath("/contents");

  return Promise.resolve();
}

export async function ServerContents({ prefix }: IServerContentsProps) {
  const listObjects = await getEntries(prefix);
  const entries = listObjectsToEntries(listObjects);
  const tags = await getTags(entries.map((entry) => entry.fullName));
  return (
    <main>
      <Contents entries={entries} prefix={prefix} tags={tags} setTag={setTag} />
      {/* <pre>{JSON.stringify(listObjects, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(entries, null, 2)}</pre> */}
    </main>
  );
}
