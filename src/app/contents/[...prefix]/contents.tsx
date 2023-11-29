import { ITags } from '@/lib/tags';

import { Breadcrumb } from './Breadcrumb';
import { IContentsProps } from './contents.types';
import { Entries } from './Entries';

export function Contents({ prefix, entries, tags, setTag }: IContentsProps) {
  return (
    <>
      <div>
        <Breadcrumb prefix={prefix} />
      </div>
      <Entries entries={entries} tags={tags} />
    </>
  );
}
