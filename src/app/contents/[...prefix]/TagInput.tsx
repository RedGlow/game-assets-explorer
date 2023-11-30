import { Label, TextInput } from 'flowbite-react';
import { ChangeEvent, forwardRef, KeyboardEvent, useCallback, useRef, useState } from 'react';

export interface ITagInputProps {
  tagKey: string;
  setTagKey(newTagKey: string): void;
  tagValue: string;
  setTagValue(newTagValue: string): void;
  existingTags: { [tagKey: string]: string[] };
}

export const TagInput = forwardRef<HTMLInputElement, ITagInputProps>(
  function TagInput(
    { tagKey, setTagKey, setTagValue, tagValue, existingTags },
    ref
  ) {
    return (
      <div className="flex gap-4 w-full">
        <FormElement
          id="tag-key"
          ref={ref}
          label="Key"
          value={tagKey}
          onChange={setTagKey}
          suggestions={
            existingTags ? Object.getOwnPropertyNames(existingTags) : []
          }
        />
        <FormElement
          id="tag-value"
          label="Value"
          value={tagValue}
          onChange={setTagValue}
          suggestions={existingTags[tagKey] || []}
        />
      </div>
    );
  }
);

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
      <div className="flex-1">
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
