"use client";
import { Button, Label, TextInput } from 'flowbite-react';
import { ChangeEvent, useCallback, useState } from 'react';
import { HiOutlineSearch } from 'react-icons/hi';

import { ITags } from '@/lib/tags';

import { IContentsEntry } from '../contents/[...prefix]/contents.types';
import { Entries } from '../contents/[...prefix]/Entries';
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

  const onSearch = useCallback(() => {
    fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hasTags: includedTags,
        hasntTags: excludedTags,
        contains,
      } as ISearchBody),
    })
      .then((resp) => resp.json())
      .then((result: ITags) => {
        console.log(result);
        setTags(result);
        setEntries(
          Object.keys(result).map((fullName) => ({
            fullName,
            kind: "file",
            size: 0,
          }))
        );
      })
      .catch(console.error);
  }, [contains, excludedTags, includedTags]);

  return (
    <div>
      <form>
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
            <Button onClick={onSearch}>Search</Button>
          </div>
        </div>
      </form>
      {entries.length > 0 && (
        <div className="my-12">
          <Entries
            entries={entries}
            existingTags={existingTags}
            tags={tags}
            editDisabled
          />
        </div>
      )}
    </div>
  );
}
