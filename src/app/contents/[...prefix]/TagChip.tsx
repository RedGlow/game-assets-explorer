"use client";
import { Badge } from 'flowbite-react';
import { useCallback, useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { HiOutlineX } from 'react-icons/hi';

import { onDeleteTag } from './on-delete-tag';

const colorNames = [
  "indigo",
  "purple",
  "pink",
  "blue",
  "cyan",
  "dark",
  "light",
  "green",
  "lime",
  "red",
  "teal",
  "yellow",
];

function hashCode(s: string) {
  var hash = 0,
    i,
    chr;
  if (s.length === 0) return hash;
  for (i = 0; i < s.length; i++) {
    chr = s.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

const getColor = (tagKey: string) =>
  colorNames[hashCode(tagKey) % colorNames.length];

interface ITagChipProps {
  tagKey: string;
  tagValue: string;
  fullName: string;
}

export function TagChip({ tagKey, tagValue, fullName }: ITagChipProps) {
  const [processing, setProcessing] = useState(false);

  const onClick = useCallback(() => {
    setProcessing(true);
    onDeleteTag(fullName, tagKey, tagValue)
      .catch(console.error)
      .finally(() => setProcessing(false));
  }, [fullName, tagKey, tagValue]);

  return (
    <Badge key={`${tagKey}-${tagValue}`} color={getColor(tagKey)}>
      <div className="flex items-center gap-2">
        {tagKey}: {tagValue}
        {!processing ? (
          <HiOutlineX onClick={onClick} />
        ) : (
          <AiOutlineLoading className="animate-spin" />
        )}
      </div>
    </Badge>
  );
}
