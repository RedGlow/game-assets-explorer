"use client";

import Link from 'next/link';

import { IContentsEntry, IContentsProps } from './contents.types';

const getLastPart = <T extends unknown>(name: T[], skip: number) =>
  name[name.length - 1 - skip];
const getName = (fullName: string, skip: number = 0) =>
  getLastPart(fullName.split("/"), skip);

export function Contents({ parentPrefix, entries }: IContentsProps) {
  const getEntries = (kind: IContentsEntry["kind"]) =>
    entries
      .filter((e) => e.kind == kind)
      .sort((d1, d2) => d1.fullName.localeCompare(d2.fullName));

  const dirEntries = getEntries("directory");
  const fileEntries = getEntries("file");

  return (
    <ul>
      <li>
        <Link href={`/contents?prefix=${encodeURIComponent(parentPrefix)}`}>
          ..
        </Link>
      </li>
      {dirEntries.map((dirEntry) => (
        <li key={dirEntry.fullName}>
          <Link
            href={`/contents?prefix=${encodeURIComponent(dirEntry.fullName)}`}
          >
            DIR: {getName(dirEntry.fullName, 1)}
          </Link>
        </li>
      ))}
      {fileEntries.map((fileEntry) => (
        <li key={fileEntry.fullName}>FILE: {getName(fileEntry.fullName)}</li>
      ))}
    </ul>
  );
}
