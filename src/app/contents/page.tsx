import { getContinuationToken } from '@/lib/get-continuation-token';
import { PageProps } from '@/lib/page-props';

import { ServerContents } from './[...prefix]/server-contents';

export default async function Home({ searchParams }: PageProps<{}>) {
  const continuationToken = getContinuationToken(searchParams);
  return <ServerContents prefix="" continuationToken={continuationToken} />;
}
