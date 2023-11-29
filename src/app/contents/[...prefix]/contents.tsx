import { ITags } from '@/lib/tags';

import { Breadcrumb } from './Breadcrumb';
import { IContentsProps } from './contents.types';
import { Entries } from './Entries';

function getTagsString(tags: ITags, fullName: string) {
  if (fullName in tags) {
    const tagsForFile = tags[fullName];
    const parts = Object.getOwnPropertyNames(tagsForFile).map(
      (key) => `${key}=${tagsForFile[key]}`
    );
    return parts.join(", ");
  } else {
    return "";
  }
}

export function Contents({ prefix, entries, tags, setTag }: IContentsProps) {
  return (
    <>
      <div>
        <Breadcrumb prefix={prefix} />
      </div>
      <Entries entries={entries} />
    </>
  );
}
