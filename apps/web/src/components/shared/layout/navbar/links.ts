import { Roles } from "@prisma/client";

export const links: {
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
    href: "/users/me",
    label: "Profile",
    roles: [Roles.OWNER, Roles.AGENCY, Roles.TENANT],
  },
  {
    href: "/users/me/posts",
    label: "My Post",
    roles: [Roles.OWNER, Roles.AGENCY],
  },
  {
    href: "/posts/create",
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
