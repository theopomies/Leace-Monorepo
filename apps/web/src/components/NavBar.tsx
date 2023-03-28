import { Roles } from "@prisma/client";
import { useClerk } from "@clerk/clerk-react";
import Link from "next/link";
import { trpc } from "../utils/trpc";

const links: {
  href: string;
  label: string;
  roles: Roles[];
  hidePremium?: boolean;
}[] = [
  {
    href: "/",
    label: "Home",
    roles: [Roles.OWNER, Roles.AGENCY, Roles.TENANT, Roles.ADMIN],
  },
  {
    href: "#",
    label: "Dashboard",
    roles: [Roles.OWNER, Roles.AGENCY],
  },
  {
    href: "/users/me/matches",
    label: "Matches",
    roles: [Roles.OWNER, Roles.AGENCY, Roles.TENANT],
  },
  {
    href: "/users/ProfilePage",
    label: "Profile",
    roles: [Roles.OWNER, Roles.AGENCY, Roles.TENANT],
  },
  {
    href: "/users/MyPostPage",
    label: "My Post",
    roles: [Roles.OWNER, Roles.AGENCY],
  },
  {
    href: "/users/AddPost",
    label: "Add Post",
    roles: [Roles.OWNER, Roles.AGENCY],
  },
  {
    href: "#",
    label: "Notifications",
    roles: [Roles.OWNER, Roles.AGENCY, Roles.TENANT],
  },
  {
    href: "/moderation",
    label: "Moderation",
    roles: [Roles.ADMIN],
  },
  {
    href: "/support",
    label: "Support",
    roles: [Roles.ADMIN],
  },
  {
    href: "/premium",
    label: "Premium",
    roles: [Roles.OWNER, Roles.AGENCY, Roles.TENANT],
    hidePremium: true,
  },
];

export function NavBar() {
  const { data: me } = trpc.user.getUser.useQuery();
  const { signOut } = useClerk();
  const handleLink = ({
    href,
    label,
    roles,
    hidePremium = false,
  }: {
    href: string;
    label: string;
    roles: Roles[];
    hidePremium?: boolean;
  }) => {
    if (me) {
      if (
        ((hidePremium && !me.isPremium) || !hidePremium) &&
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
