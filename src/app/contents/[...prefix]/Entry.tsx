import last from 'lodash-es/last';
import { HiOutlineDocument } from 'react-icons/hi';

import { getExtension } from '@/lib/get-extension';
import { ITags } from '@/lib/tags';

import { AudioPreview } from './AudioPreview';
import { IContentsEntry } from './contents.types';
import { Download } from './Download';
import { ImagePreview } from './ImagePreview';
import { Tags } from './Tags';
import { TagSingleEntry } from './TagSingleEntry';

const audioExtensions = ["ogg", "mp3", "wav"];
const imageExtensions = ["gif", "png", "jpg", "jpeg"];

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
  const extension = getExtension(entry.fullName);
  const isAudio =
    extension !== undefined && audioExtensions.indexOf(extension) >= 0;
  const isImage =
    extension !== undefined && imageExtensions.indexOf(extension) >= 0;

  return (
    <>
      <Download fullname={entry.fullName} />
      <span className="mr-2">
        {isAudio ? (
          <AudioPreview fullname={entry.fullName} />
        ) : isImage ? (
          <ImagePreview fullname={entry.fullName} />
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
