import {
  Breadcrumb as FlowbiteBreadcrumb,
  BreadcrumbItem,
} from "flowbite-react";
import last from "lodash-es/last";
import Link from "next/link";
import { useMemo } from "react";
import { HiHome } from "react-icons/hi";

export interface IBreadcrumbProps {
  prefix: string;
}

export function Breadcrumb({ prefix }: IBreadcrumbProps) {
  const breadcrumbElements = useMemo(
    () => getBreadcrumbElements(prefix),
    [prefix]
  );

  return (
    <FlowbiteBreadcrumb>
      {breadcrumbElements.map((be, i) => (
        <BreadcrumbItem key={be.prefix} icon={i == 0 ? HiHome : undefined}>
          <Link href={`/contents/${encodeURI(be.prefix)}`}>
            {be.name || "Root"}
          </Link>
        </BreadcrumbItem>
      ))}
    </FlowbiteBreadcrumb>
  );
}

function getBreadcrumbElements(prefix: string): BreadcrumbElement[] {
  const components = prefix
    // get the prefix components
    .split("/");
  const tempBreadcrumbElements = components
    // ignore the last, empty component
    .filter((_, i) => i != components.length - 1)
    // create temporary breadcrumb elements by accumulating prefix elements
    .reduce(
      (
        prev: {
          prefix: string[];
          name: string;
        }[],
        curr
      ) =>
        prev.concat({
          prefix: last(prev)!.prefix.concat(curr),
          name: curr,
        }),
      [
        {
          prefix: [],
          name: "",
        },
      ]
    );
  return (
    tempBreadcrumbElements
      // produce normalized prefix forms
      .map((be) => ({
        prefix: be.prefix.join("/") + "/",
        name: be.name,
      }))
  );
}

interface BreadcrumbElement {
  prefix: string;
  name: string;
}
