import { Role } from "@prisma/client";

export const links: {
  href: string;
  label: string;
  roles: Role[];
  hidePremium?: boolean;
}[] = [
  {
    href: "/",
    label: "Home",
    roles: [Role.OWNER, Role.AGENCY, Role.TENANT, Role.ADMIN],
  },
  {
    href: "#",
    label: "Dashboard",
    roles: [Role.OWNER, Role.AGENCY],
  },
  {
    href: "/users/me/matches",
    label: "Matches",
    roles: [Role.OWNER, Role.AGENCY, Role.TENANT],
  },
  {
    href: "/users/me",
    label: "Profile",
    roles: [Role.OWNER, Role.AGENCY, Role.TENANT],
  },
  {
    href: "/users/me/posts",
    label: "My Post",
    roles: [Role.OWNER, Role.AGENCY],
  },
  {
    href: "/posts/create",
    label: "Add Post",
    roles: [Role.OWNER, Role.AGENCY],
  },
  {
    href: "#",
    label: "Notifications",
    roles: [Role.OWNER, Role.AGENCY, Role.TENANT],
  },
  {
    href: "/moderation",
    label: "Moderation",
    roles: [Role.ADMIN],
  },
  {
    href: "/support",
    label: "Support",
    roles: [Role.ADMIN],
  },
  {
    href: "/premium",
    label: "Premium",
    roles: [Role.OWNER, Role.AGENCY, Role.TENANT],
    hidePremium: true,
  },
];
