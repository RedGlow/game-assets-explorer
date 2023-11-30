import { Button, Modal } from 'flowbite-react';
import { useMemo } from 'react';

import { useBoolean } from '@/lib/use-boolean';

import { SelectedEntries } from './Entry';

export interface IEntriesGroupActionsProps {
  toggleAll(): void;
  selectedEntries: SelectedEntries;
}

export function EntriesGroupActions({
  toggleAll,
  selectedEntries,
}: IEntriesGroupActionsProps) {
  const [groupTagOpened, { setTrue: onGroupTag, setFalse: closeGroupTag }] =
    useBoolean(false);

  const actualEntries = useMemo(
    () =>
      Object.keys(selectedEntries).filter((key) => selectedEntries[key]),
    [selectedEntries]
  );

  return (
    <div className="flex gap-2">
      <Button size="xs" onClick={toggleAll} color="gray">
        Toggle all
      </Button>
      <Button
        size="xs"
        onClick={onGroupTag}
        disabled={actualEntries.length === 0}
      >
        Group tag
      </Button>
      <Modal show={groupTagOpened} onClose={closeGroupTag} dismissible>
        stuff
      </Modal>
    </div>
  );
}
