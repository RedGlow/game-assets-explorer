import { getContinuationToken } from '@/lib/get-continuation-token';
import { PageProps } from '@/lib/page-props';

import { ServerContents } from './server-contents';

export default async function Home({
  params,
  searchParams,
}: PageProps<{ prefix: string[] }>) {
  const continuationToken = getContinuationToken(searchParams);
  const prefix = params.prefix.map((x) => decodeURI(x)).join("/") + "/";
  return (
    <ServerContents prefix={prefix} continuationToken={continuationToken} />
  );
}
