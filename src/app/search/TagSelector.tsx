import { TextInput } from 'flowbite-react';

export interface ITagSelectorProps {
  id: string;
  existingTags: {
    [x: string]: string[];
  };
}

export function TagSelector({ existingTags, id }: ITagSelectorProps) {
  return <TextInput id={id} />;
}
