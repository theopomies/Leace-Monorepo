import { Role } from "@leace/db";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { type Context } from "./context";


const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export type Authorization = Role;

const checkAuthorizations = (authorizations: Authorization[]) =>
  t.middleware(async ({ ctx, next }) => {
    const isAuthenticated = ctx.auth.userId;
    if (!isAuthenticated) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not authenticated",
      });
    }

    if (!ctx.role) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User does not have role",
      });
    }

    const isAuthorized = authorizations.includes(ctx.role);

    if (!isAuthorized) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not authorized",
      });
    }

    const lastBan = await ctx.prisma.ban.findFirst({
      where: {
        userId: ctx.auth.userId,
      },
      orderBy: {
        until: "desc",
      },
    });

    if (lastBan && lastBan.until > new Date()) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are banned",
      });
    }

    return next({
      ctx: {
        auth: ctx.auth,
      },
    });
  });

const checkAuthenticated = t.middleware(({ next, ctx }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  }
  return next({
    ctx: {
      auth: ctx.auth,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = (authorizations: Authorization[]) =>
  t.procedure.use(checkAuthorizations(authorizations));
export const AuthenticatedProcedure = t.procedure.use(checkAuthenticated);
