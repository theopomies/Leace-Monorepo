import { PostType, ReportReason, Role } from "@prisma/client";

type Enum<T extends string> = Record<T, T>;

export const Type: Enum<PostType> = {
  RENTED: "RENTED",
  TO_BE_RENTED: "TO_BE_RENTED",
};

export type Type = PostType;

export const Reason: Enum<ReportReason> = {
  SPAM: "SPAM",
  INAPPROPRIATE: "INAPPROPRIATE",
  SCAM: "SCAM",
  OTHER: "OTHER",
};

export type Reason = ReportReason;

export const Roles: Enum<Role> = {
  TENANT: "TENANT",
  OWNER: "OWNER",
  AGENCY: "AGENCY",
  MODERATOR: "MODERATOR",
  ADMIN: "ADMIN",
};

type AllowedRole = "TENANT" | "OWNER" | "AGENCY";

export const UserRole: { [key in AllowedRole]: key } = {
  TENANT: "TENANT",
  OWNER: "OWNER",
  AGENCY: "AGENCY",
};

type UserRole = Record<AllowedRole, AllowedRole>;

export const UserRoles: UserRole = {
  TENANT: "TENANT",
  OWNER: "OWNER",
  AGENCY: "AGENCY",
};
