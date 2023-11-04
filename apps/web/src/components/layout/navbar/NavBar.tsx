/* eslint-disable @next/next/no-img-element */
import { Role } from "@prisma/client";
import { useClerk } from "@clerk/clerk-react";
import Link from "next/link";
import { trpc } from "../../../utils/trpc";
import { getLinks } from "./links";
import { UserImage } from "../../shared/user/UserImage";

export interface NavBarProps {
  userId: string;
  activePage: string;
}

export function NavBar({ userId, activePage }: NavBarProps) {
  const links = getLinks(userId);
  const { data: me } = trpc.user.getUserById.useQuery({ userId });
  const { signOut } = useClerk();
  const handleLink = ({
    href,
    label,
    roles,
    icon,
  }: {
    href: string;
    label: string;
    roles: Role[];
    icon: string;
  }) => {
    if (me) {
      if (me.role && roles.includes(me.role)) {
        return (
          <li key={label}>
            <Link
              href={href}
              className={`flex h-12 transform flex-row items-center text-gray-500 transition-transform duration-200 ease-in hover:translate-x-2 ${
                activePage === label
                  ? "border-l-4 border-l-indigo-500 bg-indigo-500 bg-opacity-10 text-indigo-500 hover:text-indigo-500"
                  : "text-gray-500"
              }`}
            >
              <span className="flex items-center justify-center gap-5 pl-10 text-sm font-medium">
                <img
                  src={
                    activePage === label
                      ? `/navbar${icon}-hover.png`
                      : `/navbar${icon}.png`
                  }
                  referrerPolicy="no-referrer"
                  alt="image"
                  className="w-[30px]"
                />
                {label}
              </span>
            </Link>
          </li>
        );
      }
    }
  };

  return (
    <div className="flex w-72 flex-shrink-0 flex-col overflow-hidden bg-white">
      <div className="flex items-end gap-5 py-16 pl-10">
        <img
          src="/logo.png"
          referrerPolicy="no-referrer"
          alt="logo"
          className="w-[30px]"
        />
        <p
          className="text-3xl leading-none tracking-wide text-indigo-500"
          style={{ fontWeight: 100 }}
        >
          Leace
        </p>
      </div>
      <ul className="flex flex-col gap-8 py-4">
        {links.map((link) => handleLink(link))}
      </ul>
      <div className="mt-auto flex h-24 w-full items-center justify-between p-5">
        {me && (
          <div className="flex h-full flex-grow">
            <UserImage user={me} />
            <div className="m-auto ml-4 w-full">
              <p>
                {me?.firstName} {me?.lastName}
              </p>
              <p className="text-sm">
                {me?.role &&
                  me.role.charAt(0).toUpperCase() +
                    me.role.slice(1).toLowerCase()}
              </p>
            </div>
          </div>
        )}
        <Link
          href="#"
          onClick={async () => {
            await signOut();
          }}
          className={`flex items-center justify-center rounded-md bg-indigo-500 py-4 px-2 ${
            !me && "w-full"
          }`}
        >
          {!me && <p className="mr-2 text-white">Logout</p>}
          <img
            src={`/navbar/logout.png`}
            referrerPolicy="no-referrer"
            alt="image"
            className="w-[18px]"
          />
        </Link>
      </div>
    </div>
  );
}
