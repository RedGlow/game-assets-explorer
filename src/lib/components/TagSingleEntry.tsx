"use client";

import { useCallback, useMemo, useState } from 'react';
import { HiOutlineTag } from 'react-icons/hi';

import { AddTagModal } from './AddTagModal';

export function TagSingleEntry({
  existingTags,
  fileFullName,
  tags,
}: {
  fileFullName: string;
  existingTags: { [tagKey: string]: string[] };
  tags: [string, string][];
}) {
  const [isModalOpened, setModalOpened] = useState(false);

  const openModal = useCallback(() => setModalOpened(true), []);
  const closeModal = useCallback(() => setModalOpened(false), []);

  const fullnames = useMemo(() => [fileFullName], [fileFullName]);

  return (
    <>
      <HiOutlineTag onClick={openModal} className="mr-2" />
      <AddTagModal
        closeModal={closeModal}
        isModalOpened={isModalOpened}
        existingTags={existingTags}
        fullnames={fullnames}
        currentTags={tags}
      />
    </>
  );
}
