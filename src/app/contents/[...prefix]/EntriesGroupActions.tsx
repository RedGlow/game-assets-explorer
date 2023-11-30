import { Button, Modal } from 'flowbite-react';
import { useMemo } from 'react';

import { useBoolean } from '@/lib/use-boolean';

import { AddTagModal } from './AddTagModal';
import { SelectedEntries } from './Entry';

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

  const actualEntries = useMemo(
    () => Object.keys(selectedEntries).filter((key) => selectedEntries[key]),
    [selectedEntries]
  );

  return (
    <div className="flex gap-2">
      <Button
        size="xs"
        onClick={onGroupTag}
        disabled={actualEntries.length === 0}
      >
        Group tag
      </Button>
      <AddTagModal
        closeModal={closeGroupTag}
        isModalOpened={groupTagOpened}
        existingTags={existingTags}
        fullnames={actualEntries}
      />
    </div>
  );
}
