"use client";
import { Button, Label, Modal, ModalBody, ModalHeader, TextInput } from 'flowbite-react';
import { ChangeEvent, forwardRef, KeyboardEvent, useCallback, useRef, useState } from 'react';
import { HiOutlineTag } from 'react-icons/hi';

import { onAddTag } from './on-add-tag';
import { onDeleteTag } from './on-delete-tag';

export function TagSingleEntry({
  existingTags,
  fileFullName,
}: {
  fileFullName: string;
  existingTags: { [tagKey: string]: string[] };
}) {
  const [isModalOpened, setModalOpened] = useState(false);
  const [tagKey, setTagKey] = useState("");
  const [tagValue, setTagValue] = useState("");

  const openModal = useCallback(() => setModalOpened(true), []);
  const closeModal = useCallback(() => setModalOpened(false), []);

  const isSubmitEnabled = !!tagKey && !!tagValue;

  const firstElementRef = useRef<HTMLInputElement>(null);

  const [updating, setUpdating] = useState(false);

  const onButtonClick = useCallback(() => {
    setUpdating(true);
    onAddTag(fileFullName, tagKey, tagValue)
      .then(closeModal)
      .catch(console.error)
      .finally(() => setUpdating(false));
  }, [closeModal, fileFullName, tagKey, tagValue]);

  return (
    <>
      <HiOutlineTag onClick={openModal} className="mr-2" />
      <Modal
        dismissible
        show={isModalOpened}
        onClose={closeModal}
        initialFocus={firstElementRef}
      >
        <ModalHeader>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Add a tag
          </h3>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            <FormElement
              id="tag-key"
              ref={firstElementRef}
              label="Key"
              value={tagKey}
              onChange={setTagKey}
              suggestions={Object.getOwnPropertyNames(existingTags)}
            />
            <FormElement
              id="tag-value"
              label="Value"
              value={tagValue}
              onChange={setTagValue}
              suggestions={existingTags[tagKey] || []}
            />
            <div className="w-full">
              <Button
                disabled={!isSubmitEnabled}
                isProcessing={updating}
                onClick={onButtonClick}
              >
                {updating ? "Adding..." : "Add"}
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

interface IFormElementProps {
  id: string;
  label: string;
  value: string;
  onChange(newValue: string): void;
  suggestions: string[];
}

const FormElement = forwardRef<HTMLInputElement, IFormElementProps>(
  function FormElement({ id, label, value, onChange, suggestions }, ref) {
    const textInputOnChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value),
      [onChange]
    );

    const [suggestionsOpened, setSuggestionsOpened] = useState(false);
    const onFocus = useCallback(() => {
      setSuggestionsOpened(true);
      setSelectedSuggestionsIndex(-1);
    }, []);
    const onBlur = useCallback(() => setSuggestionsOpened(false), []);

    const measureRef = useRef<HTMLDivElement>(null);
    const width = measureRef.current?.getBoundingClientRect().width || 0;

    const [selectedSuggestionsIndex, setSelectedSuggestionsIndex] =
      useState(-1);

    const onKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        // ArrowDown, ArrowUp, Enter
        console.log(e.code);
        switch (e.code) {
          case "ArrowDown":
            setSelectedSuggestionsIndex(
              selectedSuggestionsIndex == -1
                ? 0
                : (selectedSuggestionsIndex + 1) % suggestions.length
            );
            break;
          case "ArrowUp": {
            if (selectedSuggestionsIndex == -1) {
              setSelectedSuggestionsIndex(suggestions.length - 1);
            } else {
              let newIndex = selectedSuggestionsIndex - 1;
              if (newIndex < 0) {
                newIndex += suggestions.length;
              }
              setSelectedSuggestionsIndex(newIndex);
            }
            break;
          }
          case "Enter":
            if (selectedSuggestionsIndex != -1) {
              onChange(suggestions[selectedSuggestionsIndex]);
              setSuggestionsOpened(false);
            }
        }
      },
      [onChange, selectedSuggestionsIndex, suggestions]
    );

    return (
      <div>
        <div className="mb-2 block" ref={measureRef}>
          <Label htmlFor={id} value={label} />
        </div>
        <TextInput
          id={id}
          ref={ref}
          placeholder=""
          value={value}
          onChange={textInputOnChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          autoComplete="off"
          autoCorrect="false"
          required
        />
        <ul
          style={{ width }}
          className={`absolute bg-white z-10 rounded-md border-gray-300 border-2 ${
            !suggestionsOpened ? "hidden" : ""
          }`}
        >
          {suggestions.length > 0 ? (
            suggestions.map((s, i) => (
              <li
                key={s}
                className={`p-2 ${
                  i == selectedSuggestionsIndex && " bg-slate-100"
                }`}
              >
                {s}
              </li>
            ))
          ) : (
            <li className="text-gray-400 p-2">no suggestions</li>
          )}
        </ul>
      </div>
    );
  }
);
