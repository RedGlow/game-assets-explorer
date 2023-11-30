"use client";
import { ListGroup } from 'flowbite-react';
import Link from 'next/link';
import { useState } from 'react';
import { HiFolder } from 'react-icons/hi';

import { getExtension } from '@/lib/get-extension';
import { ITags } from '@/lib/tags';

import { IContentsEntry } from './contents.types';
import { EntriesSorting, SortBy } from './EntriesSorting';
import { Entry } from './Entry';

export interface IEntriesClient {
  entries: IContentsEntry[];
  existingTags: {
    [x: string]: string[];
  };
  tags: ITags;
}

export function Entries({ entries, existingTags, tags }: IEntriesClient) {
  const [nameAscending, setNameAscending] = useState(true);
  const [extensionAscending, setExtensionAscending] = useState(true);
  const [sortBy, setSortBy] = useState<SortBy>("name");

  const getEntries = (
    kind: IContentsEntry["kind"],
    forceName: boolean = false
  ) =>
    entries
      .filter((e) => e.kind == kind)
      .sort(
        forceName
          ? getComparerer("name", true, false)
          : getComparerer(sortBy, nameAscending, extensionAscending)
      );

  const dirEntries = getEntries("directory", true);
  const fileEntries = getEntries("file");

  return (
    <>
      <EntriesSorting
        nameAscending={nameAscending}
        setNameAscending={setNameAscending}
        extensionAscending={extensionAscending}
        setExtensionAscending={setExtensionAscending}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <ListGroup>
        {dirEntries.map((entry) => (
          <ListGroup.Item key={entry.fullName} icon={HiFolder}>
            <Link
              className="w-full text-left"
              href={`/contents/${encodeURI(entry.fullName)}`}
            >
              {getName(entry.fullName, 1)}
            </Link>
          </ListGroup.Item>
        ))}
        {fileEntries.map((entry) => (
          <ListGroup.Item key={entry.fullName}>
            <Entry entry={entry} existingTags={existingTags} tags={tags} />
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
}

const getLastPart = <T extends unknown>(name: T[], skip: number) =>
  name[name.length - 1 - skip];

const getName = (fullName: string, skip: number = 0) =>
  getLastPart(fullName.split("/"), skip);

function getComparerer(
  sortBy: SortBy,
  nameAscending: boolean,
  extensionAscending: boolean
) {
  return function comparer(a: IContentsEntry, b: IContentsEntry): number {
    switch (sortBy) {
      case "name":
        return a.fullName.localeCompare(b.fullName) * (nameAscending ? 1 : -1);
      case "extension": {
        const aExt = getExtension(a.fullName) || "";
        const bExt = getExtension(b.fullName) || "";
        return aExt?.localeCompare(bExt) * (extensionAscending ? 1 : -1);
      }
      default:
        throw new Error(`unknown sort by ${sortBy}`);
    }
  };
}
