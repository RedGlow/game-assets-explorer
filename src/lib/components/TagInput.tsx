import { Label, TextInput } from 'flowbite-react';
import {
    ChangeEvent, ForwardedRef, forwardRef, KeyboardEvent, useCallback, useImperativeHandle, useRef,
    useState
} from 'react';

export interface ITagInputProps {
  id?: string;
  tagKey: string;
  setTagKey(newTagKey: string): void;
  tagValue: string;
  setTagValue(newTagValue: string): void;
  existingTags: { [tagKey: string]: string[] };
  allowAnyValue?: boolean;
}

export const TagInput = forwardRef<HTMLInputElement, ITagInputProps>(
  function TagInput(
    {
      id,
      tagKey,
      setTagKey,
      setTagValue,
      tagValue,
      existingTags,
      allowAnyValue,
    },
    ref
  ) {
    const tagKeySuggestions = existingTags
      ? Object.getOwnPropertyNames(existingTags)
      : [];

    const tagValueSuggestions = (existingTags[tagKey] || []).concat(
      allowAnyValue ? "*" : ""
    );

    return (
      <div className="flex gap-4 w-full">
        <FormElement
          id={`${id ? id + "-" : ""}tag-key`}
          ref={ref}
          label="Key"
          value={tagKey}
          onChange={setTagKey}
          suggestions={tagKeySuggestions}
        />
        <FormElement
          id={`${id ? id + "-" : ""}tag-value`}
          label="Value"
          sublabel={allowAnyValue ? "An * means any value" : ""}
          value={tagValue}
          onChange={setTagValue}
          suggestions={tagValueSuggestions}
        />
      </div>
    );
  }
);

interface IFormElementProps {
  id: string;
  label: string;
  sublabel?: string;
  value: string;
  onChange(newValue: string): void;
  suggestions: string[];
}

const FormElement = forwardRef<HTMLInputElement, IFormElementProps>(
  function FormElement(
    { id, label, sublabel, value, onChange, suggestions },
    ref: ForwardedRef<HTMLInputElement>
  ) {
    // forward the input element to the outside, while keeping a ref to the input element ourselves
    // see: https://stackoverflow.com/a/77055616/909280
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current!, []);

    // call change callback when text changes
    const textInputOnChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value),
      [onChange]
    );

    // whether suggestions should be opened and at what index
    const [suggestionsOpened, setSuggestionsOpened] = useState(false);
    const [selectedSuggestionsIndex, setSelectedSuggestionsIndex] =
      useState(-1);
    const { onBlur, onFocus } = useFormElementSuggestions(
      setSuggestionsOpened,
      setSelectedSuggestionsIndex
    );

    const { measureRef, width } = useInputWidth();

    const onKeyDown = useKeyDown(
      selectedSuggestionsIndex,
      setSelectedSuggestionsIndex,
      setSuggestionsOpened,
      suggestions,
      onChange
    );

    const ulRef = useRef<HTMLUListElement>(null);

    const openSuggestionsOnTop =
      inputRef.current &&
      ulRef.current &&
      inputRef.current.getBoundingClientRect().bottom +
        ulRef.current.getBoundingClientRect().height >
        window.innerHeight;

    return (
      <div className="flex-1">
        <div className="mb-2 block" ref={measureRef}>
          <Label htmlFor={id} value={label} />
        </div>
        <TextInput
          id={id}
          ref={inputRef}
          placeholder={sublabel}
          value={value}
          onChange={textInputOnChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          autoComplete="off"
          autoCorrect="false"
          required
        />
        <div
          className={`absolute z-10 ${
            !suggestionsOpened ? "overflow-hidden h-0" : ""
          }`}
          style={
            openSuggestionsOnTop
              ? { marginTop: -inputRef.current.getBoundingClientRect().height }
              : {}
          }
        >
          <ul
            ref={ulRef}
            style={{ width }}
            className={`bg-white rounded-md border-gray-300 border-2 absolute ${
              openSuggestionsOnTop ? "bottom-0" : ""
            }`}
          >
            {suggestions.length > 0 ? (
              suggestions.map((s, i) => (
                <li
                  key={s}
                  className={`p-2 ${
                    i == selectedSuggestionsIndex ? " bg-slate-100" : ""
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
      </div>
    );
  }
);

function useKeyDown(
  selectedSuggestionsIndex: number,
  setSelectedSuggestionsIndex: (newValue: number) => void,
  setSuggestionsOpened: (newValue: boolean) => void,
  suggestions: string[],
  onChange: (newValue: string) => void
) {
  return useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
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
}

function useInputWidth() {
  const measureRef = useRef<HTMLDivElement>(null);
  const width = measureRef.current?.getBoundingClientRect().width || 0;
  return { measureRef, width };
}

function useFormElementSuggestions(
  setSuggestionsOpened: (value: boolean) => void,
  setSelectedSuggestionsIndex: (index: number) => void
) {
  const onFocus = useCallback(() => {
    setSuggestionsOpened(true);
    setSelectedSuggestionsIndex(-1);
  }, [setSelectedSuggestionsIndex, setSuggestionsOpened]);

  const onBlur = useCallback(
    () => setSuggestionsOpened(false),
    [setSuggestionsOpened]
  );

  return { onFocus, onBlur };
}
