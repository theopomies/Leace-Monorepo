import Link from "next/link";
import React from "react";

const ModNavBar = () => {
  return (
    <div>
      <nav className="bg-gray-50 dark:bg-gray-700">
        <div className="mx-auto max-w-screen-xl px-4 py-3 md:px-6">
          <div className="flex items-center">
            <ul className="mt-0 mr-6 flex flex-row space-x-8 text-sm font-medium">
              <li>
                <Link
                  href="/moderation/moderation"
                  className="text-gray-900 hover:underline dark:text-white"
                  aria-current="page"
                >
                  Modération
                </Link>
              </li>
              <li>
                <Link
                  href="/moderation/admin"
                  className="text-gray-900 hover:underline dark:text-white"
                >
                  Administation
                </Link>
              </li>
              <li>
                <Link
                  href="/moderation/support"
                  className="text-gray-900 hover:underline dark:text-white"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default ModNavBar;
