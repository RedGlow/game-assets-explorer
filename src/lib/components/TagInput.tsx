import { Label, TextInput } from 'flowbite-react';
import {
    ChangeEvent, ForwardedRef, forwardRef, KeyboardEvent, RefObject, useCallback,
    useImperativeHandle, useRef, useState
} from 'react';

export interface ITagInputProps {
  id?: string;
  tagKey: string;
  setTagKey(newTagKey: string): void;
  tagValue: string;
  setTagValue(newTagValue: string): void;
  existingTags: { [tagKey: string]: string[] };
  allowAnyValue?: boolean;
  confirm?(): void;
}

export const TagInput = forwardRef<HTMLInputElement, ITagInputProps>(
  function TagInput(
    {
      id,
      tagKey,
      setTagKey,
      tagValue,
      setTagValue,
      existingTags,
      allowAnyValue,
      confirm,
    },
    ref
  ) {
    const tagKeySuggestions = existingTags
      ? Object.getOwnPropertyNames(existingTags)
      : [];

    const tagValueSuggestions = (existingTags[tagKey] || []).concat(
      allowAnyValue ? ["*"] : []
    );

    const tagValueRef = useRef<HTMLInputElement>(null);

    const onActualConfirm = useCallback(() => {
      if (!!tagKey && !!tagValue && confirm) {
        confirm();
      }
    }, [confirm, tagKey, tagValue]);

    return (
      <div className="flex gap-4 w-full">
        <FormElement
          id={`${id ? id + "-" : ""}tag-key`}
          ref={ref}
          label="Key"
          value={tagKey}
          onChange={setTagKey}
          suggestions={tagKeySuggestions}
          tabOn=":"
          tabFocus={tagValueRef}
        />
        <FormElement
          ref={tagValueRef}
          id={`${id ? id + "-" : ""}tag-value`}
          label="Value"
          sublabel={allowAnyValue ? "An * means any value" : ""}
          value={tagValue}
          onChange={setTagValue}
          suggestions={tagValueSuggestions}
          onEnter={onActualConfirm}
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
  tabOn?: string;
  tabFocus?: RefObject<HTMLInputElement>;
  onEnter?(): void;
}

const FormElement = forwardRef<HTMLInputElement, IFormElementProps>(
  function FormElement(
    {
      id,
      label,
      sublabel,
      value,
      onChange,
      suggestions,
      tabOn,
      tabFocus,
      onEnter,
    },
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
    // const suggestionsOpened = true;
    const [selectedSuggestionsIndex, setSelectedSuggestionsIndex] =
      useState(-1);
    const { onBlur, onFocus } = useFormElementSuggestions(
      setSuggestionsOpened,
      setSelectedSuggestionsIndex
    );

    const { measureRef, width } = useInputWidth();

    const chooseSuggestion = useCallback(
      (index: number) => {
        onChange(suggestions[index]);
        setSuggestionsOpened(false);
      },
      [onChange, suggestions]
    );

    const onKeyDown = useKeyDown(
      selectedSuggestionsIndex,
      setSelectedSuggestionsIndex,
      suggestions,
      chooseSuggestion,
      tabOn,
      tabFocus,
      onEnter
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
                <Suggestion
                  key={s}
                  label={s}
                  index={i}
                  selectedSuggestionsIndex={selectedSuggestionsIndex}
                  chooseSuggestion={chooseSuggestion}
                />
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

function Suggestion({
  label,
  index,
  selectedSuggestionsIndex,
  chooseSuggestion,
}: {
  label: string;
  index: number;
  selectedSuggestionsIndex: number;
  chooseSuggestion: (index: number) => void;
}) {
  const onClick = useCallback(() => {
    console.log("click sugg n. " + index);
    chooseSuggestion(index);
  }, [chooseSuggestion, index]);

  return (
    <li className={index == selectedSuggestionsIndex ? "bg-slate-100" : ""}>
      <button
        tabIndex={-1}
        onClick={onClick}
        className="p-2 w-full text-left hover:bg-slate-100 h-full"
      >
        {label}
      </button>
    </li>
  );
}

function useKeyDown(
  selectedSuggestionsIndex: number,
  setSelectedSuggestionsIndex: (newValue: number) => void,
  suggestions: string[],
  chooseSuggestion: (index: number) => void,
  tabOn?: string,
  tabFocus?: RefObject<HTMLInputElement>,
  confirm?: () => void
) {
  return useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      switch (e.code) {
        case "Semicolon":
          if (tabOn && tabFocus && tabFocus.current) {
            tabFocus.current.focus();
            e.preventDefault();
          }
          break;
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
            chooseSuggestion(selectedSuggestionsIndex);
          } else if (confirm) {
            confirm();
          }
      }
    },
    [
      chooseSuggestion,
      confirm,
      selectedSuggestionsIndex,
      setSelectedSuggestionsIndex,
      suggestions.length,
      tabFocus,
      tabOn,
    ]
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
    () => setTimeout(() => setSuggestionsOpened(false), 100),
    [setSuggestionsOpened]
  );

  return { onFocus, onBlur };
}
