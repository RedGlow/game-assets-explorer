import { ListGroup, ListGroupItem } from 'flowbite-react';
import Link from 'next/link';
import { HiFolder, HiOutlineDocument } from 'react-icons/hi';

import { getExistingTags, ITags } from '@/lib/tags';

import { IContentsEntry } from './contents.types';
import { Tags } from './Tags';
import { TagSingleEntry } from './TagSingleEntry';

export interface IEntriesProps {
  entries: IContentsEntry[];
  tags: ITags;
}

const getLastPart = <T extends unknown>(name: T[], skip: number) =>
  name[name.length - 1 - skip];
const getName = (fullName: string, skip: number = 0) =>
  getLastPart(fullName.split("/"), skip);

export async function Entries({ entries, tags }: IEntriesProps) {
  const getEntries = (kind: IContentsEntry["kind"]) =>
    entries
      .filter((e) => e.kind == kind)
      .sort((d1, d2) => d1.fullName.localeCompare(d2.fullName));

  const dirEntries = getEntries("directory");
  const fileEntries = getEntries("file");

  const existingTags = await getExistingTags();

  return (
    <ListGroup>
      {dirEntries.map((entry) => (
        <ListGroupItem key={entry.fullName} icon={HiFolder}>
          <Link
            className="w-full text-left"
            href={`/contents/${encodeURI(entry.fullName)}`}
          >
            {getName(entry.fullName, 1)}
          </Link>
        </ListGroupItem>
      ))}
      {fileEntries.map((entry) => (
        <ListGroupItem key={entry.fullName} icon={HiOutlineDocument}>
          <TagSingleEntry
            existingTags={existingTags}
            fileFullName={entry.fullName}
          />
          {getName(entry.fullName)}
          <Tags
            fullName={entry.fullName}
            tags={getTagsString(tags, entry.fullName)}
          />
        </ListGroupItem>
      ))}
    </ListGroup>
  );
}

const getTagsString = (tags: ITags, fullName: string) =>
  fullName in tags ? tags[fullName] : [];
