import { router, protectedProcedure } from "../../trpc";
import { z } from "zod";
import { Role } from "@prisma/client";

export const userModeration = router({
  getUserById: protectedProcedure([Role.ADMIN])
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findFirstOrThrow({
        where: { id: input },
        include: {
          posts: {
            select: { id: true },
          },
        },
      });
    }),
  getUser: protectedProcedure([Role.ADMIN, Role.MODERATOR])
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findUniqueOrThrow({
        where: {
          id: input.userId,
        },
        include: {
          attribute: true,
          reports: true,
        },
      });
    }),
});
