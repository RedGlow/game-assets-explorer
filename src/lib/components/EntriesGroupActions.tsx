import { Button, Modal } from 'flowbite-react';
import flatten from 'lodash-es/flatten';
import uniqBy from 'lodash-es/uniqBy';
import { useCallback, useMemo } from 'react';
import { HiTag } from 'react-icons/hi';
import { IoIosRemoveCircle } from 'react-icons/io';

import { onDeleteTags } from '@/lib/actions/on-delete-tag';
import { ITags } from '@/lib/db';
import { useBoolean } from '@/lib/use-boolean';

import { AddTagModal } from './AddTagModal';
import { SelectedEntries } from './Entry';

export interface IEntriesGroupActionsProps {
  selectedEntries: SelectedEntries;
  existingTags: { [tagKey: string]: string[] };
  tags: ITags;
}

export function EntriesGroupActions({
  selectedEntries,
  existingTags,
  tags,
}: IEntriesGroupActionsProps) {
  const [groupTagOpened, { setTrue: onGroupTag, setFalse: closeGroupTag }] =
    useBoolean(false);

  const fullNames = useMemo(
    () => Object.keys(selectedEntries).filter((key) => selectedEntries[key]),
    [selectedEntries]
  );

  const allTags = useMemo(
    () =>
      uniqBy(
        flatten(fullNames.map((fullname) => tags[fullname] || [])),
        ([k, v]) => `${k}:${v}`
      ),
    [fullNames, tags]
  );

  return (
    <div className="flex gap-2">
      <Button size="xs" onClick={onGroupTag} disabled={fullNames.length === 0}>
        <HiTag className="mr-1" />
        Group tag
      </Button>
      <AddTagModal
        closeModal={closeGroupTag}
        isModalOpened={groupTagOpened}
        existingTags={existingTags}
        fullnames={fullNames}
        currentTags={allTags}
      />

      <ClearTagsButton fullNames={fullNames} />
    </div>
  );
}

function ClearTagsButton({ fullNames }: { fullNames: string[] }) {
  const [opened, { setTrue: openModal, setFalse: closeModal }] =
    useBoolean(false);
  const [working, { setTrue: startWorking, setFalse: stopWorking }] =
    useBoolean(false);

  const onClearTags = useCallback(() => {
    startWorking();
    onDeleteTags(fullNames)
      .then(closeModal)
      .catch(console.error)
      .finally(stopWorking);
  }, [closeModal, fullNames, startWorking, stopWorking]);

  return (
    <>
      <Button size="xs" onClick={openModal} disabled={fullNames.length === 0}>
        <IoIosRemoveCircle className="mr-2" />
        Clear tags
      </Button>
      <Modal show={opened} dismissible={!working} onClose={closeModal}>
        <Modal.Header>Clear tags</Modal.Header>
        <Modal.Body>
          <div className="mt-4 mb-8">
            Are you sure you want to remove tags from {fullNames.length}{" "}
            entries?
          </div>
          <div className="flex justify-center gap-4">
            <Button
              color="failure"
              onClick={onClearTags}
              isProcessing={working}
            >
              Clear the tags
            </Button>
            <Button color="gray" onClick={closeModal} disabled={working}>
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
