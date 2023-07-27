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
      roles: [Role.AGENCY, Role.OWNER],
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
      href: `/users/${userId}/posts/create`,
      label: "Create a post",
      roles: [Role.OWNER, Role.AGENCY],
    },
    {
      href: "/moderation/reports",
      label: "Moderation",
      roles: [Role.ADMIN, Role.MODERATOR],
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
