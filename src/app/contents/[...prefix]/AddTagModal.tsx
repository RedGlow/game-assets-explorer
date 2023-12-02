"use client";
import { Button, Modal } from 'flowbite-react';
import { useCallback, useRef, useState } from 'react';

import { onAddTags } from '@/lib/actions/on-add-tag';
import { TagInput } from '@/lib/components/TagInput';
import { Tags } from '@/lib/components/Tags';

export interface IAddTagModalProps {
  fullnames: string[];
  isModalOpened: boolean;
  closeModal(): void;
  existingTags: { [tagKey: string]: string[] };
  currentTags: [string, string][];
}

export function AddTagModal({
  isModalOpened,
  closeModal,
  existingTags,
  fullnames,
  currentTags,
}: IAddTagModalProps) {
  const firstElementRef = useRef<HTMLInputElement>(null);

  const [tagKey, setTagKey] = useState("");
  const [tagValue, setTagValue] = useState("");

  useResetContents(isModalOpened, setTagKey, setTagValue);

  const isSubmitEnabled = !!tagKey && !!tagValue;

  const [updating, setUpdating] = useState(false);

  const onButtonClick = useCallback(() => {
    setUpdating(true);
    onAddTags(fullnames, tagKey, tagValue)
      .then(() => {
        setTagKey("");
        setTagValue("");
        firstElementRef.current?.focus();
      })
      .catch(console.error)
      .finally(() => setUpdating(false));
  }, [fullnames, tagKey, tagValue]);

  return (
    <Modal
      dismissible
      show={isModalOpened}
      onClose={closeModal}
      initialFocus={firstElementRef}
      position="bottom-right"
    >
      <Modal.Header className="text-xl font-medium text-gray-900 dark:text-white">
        Add a tag
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <TagInput
            existingTags={existingTags}
            setTagKey={setTagKey}
            setTagValue={setTagValue}
            tagKey={tagKey}
            tagValue={tagValue}
            ref={firstElementRef}
          />
          <Tags tags={currentTags} />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="w-full justify-end flex gap-4">
          <Button
            disabled={!isSubmitEnabled}
            isProcessing={updating}
            onClick={onButtonClick}
          >
            {updating ? "Adding..." : "Add"}
          </Button>
          <Button disabled={updating} color="gray" onClick={closeModal}>
            Close
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

/**
 * Resets the contents of the tag key/value if the modal is opened.
 * @param isModalOpened Whether the modal should be opened now
 * @param setTagKey function to update the tag key
 * @param setTagValue function to update the tag value
 */
function useResetContents(
  isModalOpened: boolean,
  setTagKey: (newValue: string) => void,
  setTagValue: (newValue: string) => void
) {
  const previousOpened = useRef(isModalOpened);
  if (!previousOpened.current && isModalOpened) {
    setTagKey("");
    setTagValue("");
  }
  previousOpened.current = isModalOpened;
}
