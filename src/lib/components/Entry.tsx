import { Checkbox, Table } from 'flowbite-react';
import Link from 'next/link';
import { ChangeEvent, useCallback } from 'react';
import { HiOutlineDocument } from 'react-icons/hi';

import { onDeleteTag } from '@/lib/actions/on-delete-tag';
import { Tags } from '@/lib/components/Tags';
import { ITags } from '@/lib/db';
import { getExtension } from '@/lib/get-extension';

import { AudioPreview } from './AudioPreview';
import { IContentsEntry } from './contents.types';
import { Download } from './Download';
import { ImagePreview } from './ImagePreview';
import { TagSingleEntry } from './TagSingleEntry';

const audioExtensions = ["ogg", "mp3", "wav"];
const imageExtensions = ["gif", "png", "jpg", "jpeg"];

export type SelectedEntries = {
  [fullname: string]: boolean;
};

export interface IEntryProps {
  entry: IContentsEntry;
  existingTags: {
    [x: string]: string[];
  };
  tags: ITags;
  selectedEntries: SelectedEntries;
  setEntrySelection(
    fullname: string,
    isSelected: boolean,
    isGroupOperation: boolean
  ): void;
  editDisabled?: boolean;
  showPath?: boolean;
}

export function Entry({
  entry,
  existingTags,
  tags,
  selectedEntries,
  setEntrySelection,
  editDisabled,
  showPath,
}: IEntryProps) {
  const extension = getExtension(entry.fullName);
  const isAudio =
    extension !== undefined && audioExtensions.indexOf(extension) >= 0;
  const isImage =
    extension !== undefined && imageExtensions.indexOf(extension) >= 0;

  const onSelectionChanged = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const isShiftPressed = (ev.nativeEvent as any).shiftKey as boolean;
      setEntrySelection(entry.fullName, ev.target.checked, isShiftPressed);
    },
    [entry.fullName, setEntrySelection]
  );

  return (
    <Table.Row>
      {!editDisabled && (
        <Table.Cell className="px-2 py-4 w-4">
          <Checkbox
            id={`selected-${entry.fullName}`}
            checked={
              entry.fullName in selectedEntries &&
              selectedEntries[entry.fullName]
            }
            onChange={onSelectionChanged}
            className="mr-2"
          />
        </Table.Cell>
      )}
      <Table.Cell className="px-2 py-4 w-20">
        <div className="flex items-center justify-end gap-2">
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
          {!editDisabled && (
            <TagSingleEntry
              existingTags={existingTags}
              fileFullName={entry.fullName}
              tags={tags[entry.fullName] || []}
            />
          )}
        </div>
      </Table.Cell>
      {showPath && (
        <Table.Cell className="pl-2">
          <div className="flex items-center gap-2">
            <Link href={`/contents${getPath(entry.fullName)}`} target="_blank">
              {getPath(entry.fullName)}
            </Link>
          </div>
        </Table.Cell>
      )}
      <Table.Cell className="pl-2">
        <div className="flex items-center gap-2">{getName(entry.fullName)}</div>
      </Table.Cell>
      <Table.Cell>
        <Tags
          fullName={entry.fullName}
          tags={getTagsString(tags, entry.fullName)}
          onDelete={editDisabled ? undefined : onDeleteTag}
        />
      </Table.Cell>
    </Table.Row>
  );
}

const getLastPart = <T extends unknown>(name: T[], skip: number) =>
  name[name.length - 1 - skip];

const getName = (fullName: string, skip: number = 0) =>
  getLastPart(fullName.split("/"), skip);

const getPath = (fullName: string) => {
  const parts = fullName.split("/").filter((x) => x);
  parts.pop();
  return "/" + parts.join("/") + "/";
};

const getTagsString = (tags: ITags, fullName: string) =>
  fullName in tags ? tags[fullName] : [];
