import { Breadcrumb } from './[...prefix]/Breadcrumb';

export default function ContentsPrefixLoading() {
  return (
    <main>
      <div>
        <Breadcrumb />
      </div>
      <p className="mt-2">Loading...</p>
    </main>
  );
}
