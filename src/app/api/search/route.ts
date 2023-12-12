import { getTags, search } from '@/lib/db';

export interface ISearchBody {
  hasTags: [string, string][];
  hasntTags: [string, string][];
  contains?: string;
}

export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  const body: ISearchBody = await request.json();
  console.log("search request body is:", body);

  const fullnames = await search(body.hasTags, body.hasntTags, body.contains);
  const results = await getTags(fullnames);

  return Response.json(results);
}
