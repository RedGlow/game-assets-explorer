import { ServerContents } from '@/lib/components/server-contents';

export default async function Home() {
  return (
    <main>
      <ServerContents prefix="Kenney/" />
    </main>
  );
}
