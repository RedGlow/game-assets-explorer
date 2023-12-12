"use client";
import { Alert, Button, Label, TextInput } from 'flowbite-react';
import { ChangeEvent, useCallback, useState } from 'react';
import { HiInformationCircle, HiOutlineSearch } from 'react-icons/hi';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';

import { IContentsEntry } from '@/lib/components/contents.types';
import { Entries } from '@/lib/components/Entries';
import { ITags } from '@/lib/db';
import { useBoolean } from '@/lib/use-boolean';

import { TagSelector } from './TagSelector';

import type { ISearchBody } from "../api/search/route";
const queryClient = new QueryClient();

interface ISearchFormClientProps {
  existingTags: {
    [x: string]: string[];
  };
}

export function SearchFormClient(props: ISearchFormClientProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <InnerSearchFormClient {...props} />
    </QueryClientProvider>
  );
}

function InnerSearchFormClient({ existingTags }: ISearchFormClientProps) {
  const [includedTags, setIncludedTags] = useState<[string, string][]>([]);
  const [excludedTags, setExcludedTags] = useState<[string, string][]>([]);

  const [contains, setContains] = useState("");
  const onContainsChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => setContains(ev.target.value),
    []
  );

  const [currentPage, setCurrentPage] = useState(0);
  const [searchRequested, { setTrue: startSearch }] = useBoolean(false);

  const { isError, isSuccess, isFetching, data, error } = useQuery(
    [
      "search-results",
      currentPage,
      includedTags,
      excludedTags,
      contains,
      searchRequested,
    ],
    () =>
      fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page: currentPage,
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
            return {
              tags: result,
              entries: Object.keys(result).map(
                (fullName) =>
                  ({
                    fullName,
                    kind: "file",
                    size: 0,
                  } as IContentsEntry)
              ),
              totalPages: Math.ceil(count / pageSize),
            };
          }
        ),
    {
      keepPreviousData: true,
      enabled: searchRequested,
    }
  );

  const onPageChange = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber - 1);
  }, []);

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
              onClick={useCallback(() => startSearch(), [startSearch])}
              isProcessing={isFetching}
            >
              Search
            </Button>
          </div>
        </div>
      </div>
      {isSuccess && (
        <div className="my-12">
          <Entries
            entries={data.entries}
            existingTags={existingTags}
            tags={data.tags}
            navigationInfo={{
              kind: "pagination-info",
              onPageChange,
              currentPage,
              totalPages: data.totalPages,
            }}
            disabledNavigation={isFetching}
            editDisabled
            showPath
          />
        </div>
      )}
      {isError && (
        <Alert color="failure" icon={HiInformationCircle}>
          <p className="font-semibold">Error</p>
          {error instanceof Error ? (
            <p>{error.stack}</p>
          ) : (
            <pre>{JSON.stringify(error)}</pre>
          )}
        </Alert>
      )}
    </div>
  );
}
