import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../trpc";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    if (!ctx.auth || !ctx.auth.userId) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
    return { auth: ctx.auth, userId: ctx.auth.userId, role: ctx.role };
  }),
});
