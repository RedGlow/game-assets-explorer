import { Badge, Button } from 'flowbite-react';
import { HiOutlineX } from 'react-icons/hi';

export interface ITagsProps {
  tags: [string, string][];
}

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

export function Tags({ tags }: ITagsProps) {
  return (
    <span className="ml-4">
      {tags.map(([key, value]) => (
        <Badge key={`${key}-${value}`} color={getColor(key)}>
          <div className="flex items-center gap-1">
            {key}: {value}
            <Button pill outline size="xs" color="light">
              <HiOutlineX />
            </Button>
          </div>
        </Badge>
      ))}
    </span>
  );
}
