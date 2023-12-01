import { TagChip } from './TagChip';

export interface ITagsProps {
  tags: [string, string][];
  fullName?: string;
}

export function Tags({ tags, fullName }: ITagsProps) {
  return (
    <span className="flex flex-wrap gap-1">
      {tags.map(([key, value]) => (
        <TagChip
          key={`${key}:${value}`}
          tagKey={key}
          tagValue={value}
          fullName={fullName}
        />
      ))}
    </span>
  );
}
