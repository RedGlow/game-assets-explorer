import last from 'lodash-es/last';
import { HiOutlineDocument } from 'react-icons/hi';

import { ITags } from '@/lib/tags';

import { AudioPreview } from './AudioPreview';
import { IContentsEntry } from './contents.types';
import { Download } from './Download';
import { Tags } from './Tags';
import { TagSingleEntry } from './TagSingleEntry';

const audioExtensions = ["ogg", "mp3", "wav"];

export function Entry({
  entry,
  existingTags,
  tags,
}: {
  entry: IContentsEntry;
  existingTags: {
    [x: string]: string[];
  };
  tags: ITags;
}) {
  const extension = last(entry.fullName.split("."));
  const isAudio =
    extension !== undefined && audioExtensions.indexOf(extension) >= 0;

  return (
    <>
      <Download fullname={entry.fullName} />
      <span className="mr-2">
        {isAudio ? (
          <AudioPreview fullname={entry.fullName} />
        ) : (
          <HiOutlineDocument />
        )}
      </span>
      <TagSingleEntry
        existingTags={existingTags}
        fileFullName={entry.fullName}
      />
      {getName(entry.fullName)}
      <Tags
        fullName={entry.fullName}
        tags={getTagsString(tags, entry.fullName)}
      />
    </>
  );
}

const getLastPart = <T extends unknown>(name: T[], skip: number) =>
  name[name.length - 1 - skip];

const getName = (fullName: string, skip: number = 0) =>
  getLastPart(fullName.split("/"), skip);

const getTagsString = (tags: ITags, fullName: string) =>
  fullName in tags ? tags[fullName] : [];
