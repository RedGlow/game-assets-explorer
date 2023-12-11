import { IconType } from 'react-icons';
import { HiChevronDoubleLeft, HiChevronRight } from 'react-icons/hi';

export interface IForwardPaginationProps {
  paginationPrevious?: string;
  paginationNext?: string;
}

function ForwardPaginationButton({
  href,
  icon: Icon,
  roundedLeft,
}: {
  href?: string;
  icon: IconType;
  roundedLeft?: boolean;
}) {
  return (
    <li>
      <a
        className={
          (href ? "" : "opacity-50 cursor-normal ml-0 ") +
          `${href ? "" : "opacity-50 cursor-normal ml-0 "}rounded-${
            roundedLeft ? "l" : "r"
          }-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white inline-flex`
        }
        href={href}
      >
        <Icon />
      </a>
    </li>
  );
}

export function ForwardPagination({
  paginationPrevious,
  paginationNext,
}: IForwardPaginationProps) {
  return (
    <div className="flex overflow-x-auto sm:justify-center">
      <nav>
        <ul className="xs:mt-0 mt-2 inline-flex items-center -space-x-px">
          <ForwardPaginationButton
            href={paginationPrevious}
            icon={HiChevronDoubleLeft}
            roundedLeft
          />
          <ForwardPaginationButton
            href={paginationNext}
            icon={HiChevronRight}
          />
        </ul>
      </nav>
    </div>
  );
}
