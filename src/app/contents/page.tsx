import { ServerContents } from '@/lib/components/server-contents';

export default async function Home({
  searchParams,
}: {
  searchParams: {[key: string]: string}
  }) {
  const prefix = searchParams["prefix"]
  // const prefix = decodeURI(params.prefix.join("/"));
  console.log("prefix=" + prefix);
  return (
    <main>
      <ServerContents prefix={prefix} />
    </main>
  );
}
