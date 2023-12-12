import { getExistingTags } from '@/lib/db';

import { SearchFormClient } from './SearchFormClient';

export default async function SearchForm() {
  const existingTags = await getExistingTags();
  return <SearchFormClient existingTags={existingTags} />;
}
