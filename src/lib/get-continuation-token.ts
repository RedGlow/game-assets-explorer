import { PageProps } from './page-props';

export function getContinuationToken(
  searchParams: PageProps<{}>["searchParams"]
) {
  const value = searchParams["continuation-token"];
  if (value !== undefined && typeof value === "string") {
    return value;
  } else {
    return undefined;
  }
}
