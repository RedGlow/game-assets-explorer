"use client";

import Link from 'next/link';

import { ITags } from '@/lib/tags';

import { IContentsEntry, IContentsProps } from './contents.types';

const getLastPart = <T extends unknown>(name: T[], skip: number) =>
  name[name.length - 1 - skip];
const getName = (fullName: string, skip: number = 0) =>
  getLastPart(fullName.split("/"), skip);

interface BreadcrumbElement {
  prefix: string;
  name: string;
}

function getBreadcrumbElements(prefix: string): BreadcrumbElement[] {
  const components = prefix
    // get the prefix components
    .split("/");
  const tempBreadcrumbElements = components
    // ignore the last, empty component
    .filter((_, i) => i != components.length - 1)
    // create temporary breadcrumb elements by accumulating prefix elements
    .reduce(
      (
        prev: {
          prefix: string[];
          name: string;
        }[],
        curr
      ) =>
        prev.concat({
          prefix: getLastPart(prev, 0).prefix.concat(curr),
          name: curr,
        }),
      [
        {
          prefix: [],
          name: "",
        },
      ]
    );
  return (
    tempBreadcrumbElements
      // remove the first element (the empty seed) and the last element (the current directory)
      .filter((_, i) => i != 0 && i != tempBreadcrumbElements.length - 1)
      // produce normalized prefix forms
      .map((be) => ({
        prefix: be.prefix.join("/") + "/",
        name: be.name,
      }))
  );
}

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
  const getEntries = (kind: IContentsEntry["kind"]) =>
    entries
      .filter((e) => e.kind == kind)
      .sort((d1, d2) => d1.fullName.localeCompare(d2.fullName));

  const dirEntries = getEntries("directory");
  const fileEntries = getEntries("file");

  return (
    <>
      <div>
        <ul className="flex gap-4 mb-4">
          {getBreadcrumbElements(prefix).map((be) => (
            <li key={be.prefix}>
              <Link href={`/contents/${encodeURI(be.prefix)}`}>{be.name}</Link>
            </li>
          ))}
        </ul>
      </div>
      <ul>
        {dirEntries.map((dirEntry) => (
          <li key={dirEntry.fullName}>
            <Link href={`/contents/${encodeURI(dirEntry.fullName)}`}>
              DIR: {getName(dirEntry.fullName, 1)}
            </Link>
          </li>
        ))}
        {fileEntries.map((fileEntry) => (
          <li key={fileEntry.fullName}>
            FILE: {getName(fileEntry.fullName)} [[[{" "}
            {getTagsString(tags, fileEntry.fullName)} ]]]
            <button onClick={() => setTag(fileEntry.fullName, "sfx")}>
              set as sfx
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
