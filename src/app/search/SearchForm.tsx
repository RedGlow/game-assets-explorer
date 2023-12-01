import { getExistingTags } from '@/lib/tags';

import { SearchFormClient } from './SearchFormClient';

export async function SearchForm() {
  const existingTags = await getExistingTags();
  return <SearchFormClient existingTags={existingTags} />;
}
