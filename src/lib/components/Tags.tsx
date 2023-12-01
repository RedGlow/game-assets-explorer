import { TagChip } from '@/lib/components/TagChip';

export interface ITagsProps {
  tags: [string, string][];
  fullName?: string;
  onDelete?(fullName: string, tagKey: string, tagValue: string): Promise<void> | null;
}

export function Tags({ tags, fullName, onDelete }: ITagsProps) {
  return (
    <span className="flex flex-wrap gap-1">
      {tags.sort(tagSorter).map(([key, value]) => (
        <TagChip
          key={`${key}:${value}`}
          tagKey={key}
          tagValue={value}
          fullName={fullName}
          onDelete={onDelete}
        />
      ))}
    </span>
  );
}

function tagSorter(a: [string, string], b: [string, string]): number {
  const c = a[0].localeCompare(b[0]);
  return c !== 0 ? c : a[1].localeCompare(b[1]);
}
