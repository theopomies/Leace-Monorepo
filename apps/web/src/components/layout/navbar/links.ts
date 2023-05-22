import { Role } from "@prisma/client";

export function getLinks(userId: string): {
  href: string;
  label: string;
  roles: Role[];
}[] {
  return [
    {
      href: "/",
      label: "Home",
      roles: [Role.OWNER, Role.AGENCY, Role.TENANT, Role.ADMIN],
    },
    {
      href: `/dashboard`,
      label: "Dashboard",
      roles: [Role.AGENCY],
    },
    {
      href: `/users/${userId}/matches`,
      label: "Matches",
      roles: [Role.OWNER, Role.AGENCY, Role.TENANT],
    },
    {
      href: `/users/${userId}`,
      label: "Profile",
      roles: [Role.OWNER, Role.AGENCY, Role.TENANT],
    },
    {
      href: `/users/${userId}/posts`,
      label: "My Posts",
      roles: [Role.OWNER, Role.AGENCY],
    },
    {
      href: "/posts/create",
      label: "Create a post",
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
    },
  ];
}
