import { Role } from "@prisma/client";
import { useClerk } from "@clerk/clerk-react";
import Link from "next/link";
import { trpc } from "../../../utils/trpc";
import { getLinks } from "./links";

export interface NavBarProps {
  userId: string;
}

export function NavBar({ userId }: NavBarProps) {
  const links = getLinks(userId);
  const { data: me } = trpc.user.getUserById.useQuery({ userId });
  const { signOut } = useClerk();
  const handleLink = ({
    href,
    label,
    roles,
    hidePremium = false,
  }: {
    href: string;
    label: string;
    roles: Role[];
    hidePremium?: boolean;
  }) => {
    if (me) {
      if (
        ((hidePremium && !me.isPremium) || !hidePremium) &&
        me.role &&
        roles.includes(me.role)
      ) {
        return (
          <li key={label}>
            <Link
              href={href}
              className="flex h-12 transform flex-row items-center text-gray-500 transition-transform duration-200 ease-in hover:translate-x-2 hover:text-gray-800"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center text-lg text-gray-400"></span>
              <span className="text-sm font-medium">{label}</span>
              {label === "Notifications" && (
                <span className="ml-auto mr-6 rounded-full bg-red-100 px-3 py-px text-sm text-red-500">
                  5
                </span>
              )}
            </Link>
          </li>
        );
      }
    }
  };

  return (
    <div className="flex w-56 flex-col overflow-hidden bg-white">
      <div className="flex h-20 items-center justify-center shadow-md">
        <h1 className="text-3xl uppercase text-indigo-500">Leace</h1>
      </div>
      <ul className="flex flex-col py-4">
        {links.map((link) => handleLink(link))}
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
