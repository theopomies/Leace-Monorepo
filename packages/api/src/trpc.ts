import { initTRPC, TRPCError } from "@trpc/server";
import { type Context } from "./context";
import superjson from "superjson";
import { Roles } from "@leace/db";
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

const isAuthed = (roles?: Roles[]) =>
  t.middleware(({ ctx, next }) => {
    if (!ctx.session) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not authenticated",
      });
    }

    if (roles && !roles.includes(ctx.session.user.role)) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not authorized",
      });
    }

    return next({
      ctx: {
        session: ctx.session,
      },
    });
  });

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = (roles?: Roles[]) =>
  t.procedure.use(isAuthed(roles));
