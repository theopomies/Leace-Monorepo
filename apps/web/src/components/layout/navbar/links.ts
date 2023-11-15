import { Role } from "@prisma/client";

export function getLinks(userId: string): {
  href: string;
  label: string;
  roles: Role[];
  icon: string;
}[] {
  return [
    {
      href: "/",
      label: "Home",
      roles: [Role.OWNER, Role.AGENCY, Role.TENANT, Role.ADMIN],
      icon: "/home",
    },
    {
      href: `/dashboard`,
      label: "Dashboard",
      roles: [Role.AGENCY, Role.OWNER],
      icon: "/dashboard",
    },
    {
      href: `/users/${userId}/matches`,
      label: "Matches",
      roles: [Role.OWNER, Role.AGENCY, Role.TENANT],
      icon: "/chat",
    },
    {
      href: `/users/${userId}`,
      label: "Profile",
      roles: [Role.OWNER, Role.AGENCY, Role.TENANT],
      icon: "/avatar",
    },
    {
      href: `/users/${userId}/posts`,
      label: "My Posts",
      roles: [Role.OWNER, Role.AGENCY],
      icon: "/write",
    },
    {
      href: "/moderation/reports",
      label: "Moderation",
      roles: [Role.ADMIN, Role.MODERATOR],
      icon: "/mace",
    },
    {
      href: "/certification",
      label: "Certification",
      roles: [Role.ADMIN, Role.MODERATOR],
      icon: "/check",
    },
    {
      href: "/support",
      label: "Support",
      roles: [Role.ADMIN],
      icon: "/support",
    },
    {
      href: "/premium",
      label: "Premium",
      roles: [Role.TENANT],
      icon: "/crown",
    },
  ];
}
