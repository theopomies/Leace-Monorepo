import { initTRPC, TRPCError } from "@trpc/server";
import { type Context } from "./context";
import { Roles } from "@leace/db";
import superjson from "superjson";
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

const isAuthorized = (roles?: Roles[]) =>
  t.middleware(async ({ ctx, next }) => {
    if (!ctx.auth.userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not authenticated",
      });
    }

    // role should not be null if the user follow a normal flow.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (roles && !roles.includes(ctx.role!)) {
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

const isAuthed = t.middleware(({ next, ctx }) => {
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
export const protectedProcedure = (roles?: Roles[]) =>
  t.procedure.use(isAuthorized(roles));
export const isAuthedProcedure = t.procedure.use(isAuthed);
