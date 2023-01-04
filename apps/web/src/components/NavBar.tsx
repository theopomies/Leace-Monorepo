import { signOut } from "next-auth/react";
import Link from "next/link";

export function NavBar() {
  return (
    <div className="flex w-56 flex-col overflow-hidden bg-white">
      <div className="flex h-20 items-center justify-center shadow-md">
        <h1 className="text-3xl uppercase text-indigo-500">Leace</h1>
      </div>
      <ul className="flex flex-col py-4">
        <li>
          <Link
            href="#"
            className="flex h-12 transform flex-row items-center text-gray-500 transition-transform duration-200 ease-in hover:translate-x-2 hover:text-gray-800"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center text-lg text-gray-400"></span>
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
        </li>
        <li>
          <Link
            href="#"
            className="flex h-12 transform flex-row items-center text-gray-500 transition-transform duration-200 ease-in hover:translate-x-2 hover:text-gray-800"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center text-lg text-gray-400"></span>
            <span className="text-sm font-medium">Matches</span>
          </Link>
        </li>
        <li>
          <Link
            href="#"
            className="flex h-12 transform flex-row items-center text-gray-500 transition-transform duration-200 ease-in hover:translate-x-2 hover:text-gray-800"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center text-lg text-gray-400"></span>
            <span className="text-sm font-medium">Profile</span>
          </Link>
        </li>
        <li>
          <Link
            href="#"
            className="flex h-12 transform flex-row items-center text-gray-500 transition-transform duration-200 ease-in hover:translate-x-2 hover:text-gray-800"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center text-lg text-gray-400"></span>
            <span className="text-sm font-medium">Notifications</span>
            <span className="ml-auto mr-6 rounded-full bg-red-100 px-3 py-px text-sm text-red-500">
              5
            </span>
          </Link>
        </li>
        <li>
          <Link
            href="#"
            onClick={() => signOut()}
            className="flex h-12 transform flex-row items-center text-gray-500 transition-transform duration-200 ease-in hover:translate-x-2 hover:text-gray-800"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center text-lg text-gray-400"></span>
            <span className="text-sm font-medium">Logout</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
