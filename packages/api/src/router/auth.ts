import { Roles } from "@leace/db";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure([
    Roles.USER,
    Roles.ADMIN,
    Roles.MODERATOR,
  ]).query(() => {
    // testing type validation of overridden next-auth Session in @leace/auth package
    return "you can see this secret message!";
  }),
});
