import { Button } from 'flowbite-react';

export interface IEntriesGroupActionsProps {
  toggleAll(): void;
}

export function EntriesGroupActions({ toggleAll }: IEntriesGroupActionsProps) {
  return (
    <div>
      <Button size="xs" onClick={toggleAll}>
        Toggle all
      </Button>
    </div>
  );
}
