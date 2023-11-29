import { ServerContents } from '@/app/contents/[...prefix]/server-contents';

export default async function Home() {
  return <ServerContents prefix="/" />;
}
