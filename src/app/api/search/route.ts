import { getTags, search } from '@/lib/db';

export interface ISearchBody {
  page: number;
  hasTags: [string, string][];
  hasntTags: [string, string][];
  contains?: string;
}

export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  const body: ISearchBody = await request.json();
  console.log("search request body is:", body);

  const [fullnames, count] = await search(
    body.page,
    20,
    body.hasTags,
    body.hasntTags,
    body.contains
  );
  const result = await getTags(fullnames);

  return Response.json({ result, count, pageSize: 10 });
}
