import { Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import type { Context } from "../context";

export interface getIdProps {
  ctx: Context;
  userId: string;
}

export const getId = ({ ctx, userId }: getIdProps) => {
  if (
    ctx.role != Role.MODERATOR &&
    ctx.role != Role.ADMIN &&
    ctx.auth.userId != userId
  ) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return userId;
};
