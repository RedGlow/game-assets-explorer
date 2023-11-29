import { getEntries } from '@/lib/s3';
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

function getParentPrefix(prefix: string) {
  const splitPrefix = prefix.split("/");
  splitPrefix.pop();
  splitPrefix.pop();
  return splitPrefix.join("/") + "/";
}

export async function ServerContents({ prefix }: IServerContentsProps) {
  const listObjects = await getEntries(prefix);
  const entries = listObjectsToEntries(listObjects);
  const parentPrefix = getParentPrefix(prefix);
  return (
    <main>
      <Contents entries={entries} parentPrefix={parentPrefix} />
      <pre>{JSON.stringify(listObjects, null, 2)}</pre>
      <pre>{JSON.stringify(entries, null, 2)}</pre>
    </main>
  );
}
