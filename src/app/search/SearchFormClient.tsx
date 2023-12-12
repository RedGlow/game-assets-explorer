"use client";
import { Button, Label, TextInput } from 'flowbite-react';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { HiOutlineSearch } from 'react-icons/hi';

import { IContentsEntry } from '@/lib/components/contents.types';
import { Entries, PaginationInfo } from '@/lib/components/Entries';
import { ITags } from '@/lib/db';
import { useBoolean } from '@/lib/use-boolean';

import { TagSelector } from './TagSelector';

import type { ISearchBody } from "../api/search/route";

export function SearchFormClient({
  existingTags,
}: {
  existingTags: {
    [x: string]: string[];
  };
}) {
  const [includedTags, setIncludedTags] = useState<[string, string][]>([]);
  const [excludedTags, setExcludedTags] = useState<[string, string][]>([]);

  const [contains, setContains] = useState("");
  const onContainsChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => setContains(ev.target.value),
    []
  );

  const [entries, setEntries] = useState<IContentsEntry[]>([]);
  const [tags, setTags] = useState<ITags>({});

  const [working, { setTrue: startWorking, setFalse: stopWorking }] =
    useBoolean(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const onSearch = useCallback(
    (requestedPage?: number) => {
      startWorking();
      fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page: requestedPage ?? currentPage,
          hasTags: includedTags,
          hasntTags: excludedTags,
          contains,
        } satisfies ISearchBody),
      })
        .then((resp) => resp.json())
        .then(
          ({
            result,
            count,
            pageSize,
          }: {
            result: ITags;
            count: number;
            pageSize: number;
          }) => {
            console.log(result, count, pageSize);
            setTags(result);
            setEntries(
              Object.keys(result).map((fullName) => ({
                fullName,
                kind: "file",
                size: 0,
              }))
            );
            setTotalPages(Math.ceil(count / pageSize));
            setCurrentPage(requestedPage ?? 0);
          }
        )
        .catch(console.error)
        .finally(stopWorking);
    },
    [
      contains,
      currentPage,
      excludedTags,
      includedTags,
      startWorking,
      stopWorking,
    ]
  );

  const onPageChange = useCallback(
    (pageNumber: number) => {
      setCurrentPage(pageNumber - 1);
      onSearch(pageNumber - 1);
    },
    [onSearch]
  );

  const navigationInfo = useMemo<PaginationInfo>(
    () => ({
      kind: "pagination-info",
      onPageChange,
      currentPage,
      totalPages,
    }),
    [currentPage, onPageChange, totalPages]
  );

  return (
    <div>
      <div>
        <div className="grid grid-cols-2 gap-x-16 gap-y-4">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="filename" value="Has tags:" />
            </div>
            <TagSelector
              id="has-tags"
              existingTags={existingTags}
              tags={includedTags}
              setTags={setIncludedTags}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="filename" value="Has no tags:" />
            </div>
            <TagSelector
              id="hasnt-tags"
              existingTags={existingTags}
              tags={excludedTags}
              setTags={setExcludedTags}
            />
          </div>
          <div className="mb-2 block col-span-2">
            <div>
              <Label htmlFor="filename" value="Filename contains:" />
            </div>
            <TextInput
              id="filename"
              icon={HiOutlineSearch}
              placeholder="laser"
              value={contains}
              onChange={onContainsChange}
            />
          </div>
          <div className="col-span-2 flex justify-start">
            <Button
              onClick={useCallback(() => onSearch(), [onSearch])}
              isProcessing={working}
            >
              Search
            </Button>
          </div>
        </div>
      </div>
      {entries.length > 0 && navigationInfo !== undefined && (
        <div className="my-12">
          <Entries
            entries={entries}
            existingTags={existingTags}
            tags={tags}
            navigationInfo={navigationInfo}
            editDisabled
            showPath
          />
        </div>
      )}
    </div>
  );
}
