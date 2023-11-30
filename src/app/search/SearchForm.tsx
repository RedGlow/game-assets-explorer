import { Label, TextInput } from 'flowbite-react';
import { HiOutlineSearch } from 'react-icons/hi';

import { getExistingTags } from '@/lib/tags';

import { TagSelector } from './TagSelector';

export async function SearchForm() {
  const existingTags = await getExistingTags();
  return (
    <form>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="filename" value="Filename contains:" />
          </div>
          <TextInput id="filename" icon={HiOutlineSearch} placeholder="laser" />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="filename" value="Has tags:" />
          </div>
          <TagSelector id="has-tags" existingTags={existingTags} />
        </div>
      </div>
    </form>
  );
}
