"use client";
import { Button } from 'flowbite-react';
import { useCallback, useState } from 'react';
import { HiOutlinePlus } from 'react-icons/hi';

import { TagInput } from '@/lib/components/TagInput';
import { Tags } from '@/lib/components/Tags';

export interface ITagSelectorProps {
  id: string;
  existingTags: {
    [x: string]: string[];
  };
  tags: [string, string][];
  setTags(updater: (curr: [string, string][]) => [string, string][]): void;
}

export function TagSelector({
  existingTags,
  id,
  tags,
  setTags,
}: ITagSelectorProps) {
  const [tagKey, setTagKey] = useState("");
  const [tagValue, setTagValue] = useState("");

  const onClick = useCallback(
    () => setTags((currTags) => [...currTags, [tagKey, tagValue]]),
    [setTags, tagKey, tagValue]
  );

  const onDeleteTag = useCallback(
    (_: string, tagKey: string, tagValue: string): Promise<void> | null => {
      setTags((currTags) =>
        currTags.filter(([v, k]) => v != tagKey && k != tagValue)
      );
      return null;
    },
    [setTags]
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-end gap-4">
        <TagInput
          id={id}
          existingTags={existingTags}
          tagKey={tagKey}
          setTagKey={setTagKey}
          tagValue={tagValue}
          setTagValue={setTagValue}
          allowAnyValue
        />
        <Button color="gray" onClick={onClick}>
          <HiOutlinePlus />
        </Button>
      </div>
      <Tags tags={tags} onDelete={onDeleteTag} />
    </div>
  );
}
