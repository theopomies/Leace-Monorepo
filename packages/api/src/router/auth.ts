import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../trpc";

export const authRouter = router({
  getSession: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.auth || !ctx.auth.userId) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }

    let ban = await ctx.prisma.ban.findFirst({
      where: {
        userId: ctx.auth.userId,
      },
      orderBy: {
        until: "desc",
      },
    });

    ban = ban && ban.until > new Date() ? ban : null;

    return { auth: ctx.auth, userId: ctx.auth.userId, role: ctx.role, ban };
  }),
});
