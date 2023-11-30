import { TextInput } from 'flowbite-react';

export interface ITagSelectorProps {
  id: string;
  existingTags: {
    [x: string]: string[];
  };
}

export function TagSelector({ existingTags, id }: ITagSelectorProps) {
  console.log("existing tags:", existingTags);
  return <TextInput id={id} />;
}
