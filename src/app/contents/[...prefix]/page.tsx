import { ServerContents } from './server-contents';

export default async function Home({
  params,
}: {
  params: { prefix: string[] };
}) {
  const prefix = params.prefix.map((x) => decodeURI(x)).join("/") + "/";
  console.log("prefix=" + prefix);
  return <ServerContents prefix={prefix} />;
}
