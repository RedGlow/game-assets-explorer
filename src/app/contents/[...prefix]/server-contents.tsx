import { getExistingTags, getTags } from '@/lib/db';
import { getEntries } from '@/lib/s3';
import { ListObjectsV2CommandOutput } from '@aws-sdk/client-s3';

import { IContentsEntry, IServerContentsProps } from '../../../lib/components/contents.types';
import { Entries } from '../../../lib/components/Entries';
import { Breadcrumb } from './Breadcrumb';

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

export async function ServerContents({
  prefix,
}: IServerContentsProps) {
  const listObjects = await getEntries(prefix);
  const entries = listObjectsToEntries(listObjects);
  const tags = await getTags(entries.map((entry) => entry.fullName));
  const existingTags = await getExistingTags();

  return (
    <main>
      <div>
        <Breadcrumb prefix={prefix} />
      </div>
      <Entries entries={entries} tags={tags} existingTags={existingTags} />
    </main>
  );
}
