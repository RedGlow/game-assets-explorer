import { Banner } from "flowbite-react";
import { HiX } from "react-icons/hi";
import { MdAnnouncement } from "react-icons/md";

export default async function Home() {
  return (
    <div>
      <Banner>
        <div className="flex w-full justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
          <div className="mx-auto flex items-center">
            <p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
              <MdAnnouncement className="mr-4 h-4 w-4" />
              <span className="[&_p]:inline">
                <a
                  href="/api/auth/signin"
                  className="decoration-600 dark:decoration-500 inline font-medium text-secondary-light underline decoration-solid underline-offset-2 hover:no-underline dark:text-cyan-500"
                >
                  Sign in
                </a>{" "}
                to access the contents.
              </span>
            </p>
          </div>
          <Banner.CollapseButton
            color="gray"
            className="border-0 bg-transparent text-gray-500 dark:text-gray-400"
          >
            <HiX className="h-4 w-4" />
          </Banner.CollapseButton>
        </div>
      </Banner>
    </div>
  );
}
