import { Button, Modal } from 'flowbite-react';
import { ElementType, useCallback, useMemo, useRef } from 'react';

import { useBoolean } from '@/lib/use-boolean';

import { AddTagModal } from './AddTagModal';
import { SelectedEntries } from './Entry';
import { onDeleteTags } from './on-delete-tag';

export interface IEntriesGroupActionsProps {
  selectedEntries: SelectedEntries;
  existingTags: { [tagKey: string]: string[] };
}

export function EntriesGroupActions({
  selectedEntries,
  existingTags,
}: IEntriesGroupActionsProps) {
  const [groupTagOpened, { setTrue: onGroupTag, setFalse: closeGroupTag }] =
    useBoolean(false);

  const fullNames = useMemo(
    () => Object.keys(selectedEntries).filter((key) => selectedEntries[key]),
    [selectedEntries]
  );

  return (
    <div className="flex gap-2">
      <Button size="xs" onClick={onGroupTag} disabled={fullNames.length === 0}>
        Group tag
      </Button>
      <AddTagModal
        closeModal={closeGroupTag}
        isModalOpened={groupTagOpened}
        existingTags={existingTags}
        fullnames={fullNames}
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
