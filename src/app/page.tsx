import { ServerContents } from '@/app/contents/server-contents';

export default async function Home() {
  return (
    <main>
      <ServerContents prefix="Kenney/" />
    </main>
  );
}
