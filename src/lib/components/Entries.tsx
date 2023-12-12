"use client";
import { Checkbox, Pagination, Table } from 'flowbite-react';
import fromPairs from 'lodash-es/fromPairs';
import Link from 'next/link';
import { ChangeEvent, useCallback, useState } from 'react';
import { HiFolder } from 'react-icons/hi';

import { ITags } from '@/lib/db';
import { getExtension } from '@/lib/get-extension';

import { IContentsEntry } from './contents.types';
import { EntriesGroupActions } from './EntriesGroupActions';
import { SortButton, SortBy } from './EntriesSorting';
import { Entry, SelectedEntries } from './Entry';
import { ForwardPagination } from './ForwardPagination';

export interface INavigationEntry {
  url: string;
  label: string;
}

export interface ForwardOnlyNavigationInfo {
  kind: "forward-only-navigation";
  paginationPrevious?: string;
  paginationNext?: string;
}

export interface PaginationInfo {
  kind: "pagination-info";
  currentPage: number;
  totalPages: number;
  onPageChange(newPageNumber: number): void;
}

export interface IEntriesClient {
  entries: IContentsEntry[];
  existingTags: {
    [x: string]: string[];
  };
  tags: ITags;
  editDisabled?: boolean;
  showPath?: boolean;
  navigationInfo: ForwardOnlyNavigationInfo | PaginationInfo;
  disabledNavigation?: boolean;
}

export function Entries({
  entries,
  existingTags,
  tags,
  editDisabled,
  showPath,
  navigationInfo,
  disabledNavigation,
}: IEntriesClient) {
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

  const [selectedEntries, setSelectedEntries] = useState<SelectedEntries>({});

  // used for group operations with shift+click
  const [lastSelectionOperationIndex, setLastSelectionOperationIndex] =
    useState(-1);

  const setEntrySelection = useCallback(
    (fullname: string, isSelected: boolean, isGroupOperation: boolean) => {
      if (isGroupOperation && lastSelectionOperationIndex !== -1) {
        var newIndex = fileEntries.findIndex((e) => e.fullName === fullname);
        setSelectedEntries((currOld) => {
          const curr = { ...currOld };
          for (
            var i = lastSelectionOperationIndex;
            i != newIndex;
            i += newIndex > lastSelectionOperationIndex ? 1 : -1
          ) {
            const entry = fileEntries[i];
            curr[entry.fullName] = true;
          }
          curr[fileEntries[newIndex].fullName] = true;
          return curr;
        });
      } else {
        setSelectedEntries((curr) => ({
          ...curr,
          [fullname]: isSelected,
        }));
        const idx = fileEntries.findIndex((e) => e.fullName === fullname);
        setLastSelectionOperationIndex(idx);
      }
    },
    [fileEntries, lastSelectionOperationIndex]
  );

  const onToggleAllCheckboxClicked = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSelectedEntries(
        e.target.checked
          ? fromPairs(
              entries
                .filter((e) => e.kind === "file")
                .map((e) => [e.fullName, true])
            )
          : {}
      );
      setLastSelectionOperationIndex(-1);
    },
    [entries]
  );

  return (
    <>
      {!editDisabled && (
        <div className="flex gap-16 items-center mt-2 mb-2">
          <EntriesGroupActions
            selectedEntries={selectedEntries}
            existingTags={existingTags}
            tags={tags}
          />
        </div>
      )}
      <Table className="w-full">
        <Table.Head>
          {!editDisabled && (
            <Table.HeadCell className="px-2 py-4 w-4">
              <Checkbox onChange={onToggleAllCheckboxClicked} />
            </Table.HeadCell>
          )}
          <Table.HeadCell className="px-2 py-4 w-20" />
          {showPath && <Table.HeadCell>path</Table.HeadCell>}
          <Table.HeadCell className="pl-2">
            <div className="flex items-center gap-2">
              name{" "}
              <SortButton
                label=""
                value="name"
                currentSortBy={sortBy}
                setSortBy={setSortBy}
                ascending={nameAscending}
                setAscending={setNameAscending}
              />
              and extension{" "}
              <SortButton
                label=""
                value="extension"
                currentSortBy={sortBy}
                setSortBy={setSortBy}
                ascending={extensionAscending}
                setAscending={setExtensionAscending}
              />
            </div>
          </Table.HeadCell>
          <Table.HeadCell>tags</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {dirEntries.map((entry) => (
            <Table.Row key={entry.fullName}>
              <Table.Cell className="p-4 w-16" />
              <Table.Cell className="px-0 py-4 w-20" />
              <Table.Cell className="pl-2">
                <div className="flex items-center gap-2">
                  <HiFolder />
                  <Link
                    className="w-full text-left"
                    href={`/contents/${encodeURI(entry.fullName)}`}
                  >
                    {getName(entry.fullName, 1)}
                  </Link>
                </div>
              </Table.Cell>
              <Table.Cell />
            </Table.Row>
          ))}
          {fileEntries.map((entry) => (
            <Entry
              key={entry.fullName}
              entry={entry}
              existingTags={existingTags}
              tags={tags}
              selectedEntries={selectedEntries}
              setEntrySelection={setEntrySelection}
              editDisabled={editDisabled}
              showPath={showPath}
            />
          ))}
        </Table.Body>
      </Table>
      {navigationInfo.kind === "forward-only-navigation" && (
        <ForwardPagination
          paginationPrevious={navigationInfo.paginationPrevious}
          paginationNext={navigationInfo.paginationNext}
        />
      )}
      {navigationInfo.kind === "pagination-info" && (
        <div className="flex justify-center mt-4">
          <Pagination
            currentPage={navigationInfo.currentPage + 1}
            totalPages={navigationInfo.totalPages}
            onPageChange={navigationInfo.onPageChange}
            showIcons
          />
        </div>
      )}
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
