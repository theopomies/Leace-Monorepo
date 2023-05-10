import { router, protectedProcedure } from "../../trpc";
import { z } from "zod";
import { Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const imageModeration = router({
  deleteUserImage: protectedProcedure([Role.ADMIN, Role.MODERATOR])
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.userId },
      });
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      await ctx.prisma.user.update({
        where: { id: input.userId },
        data: { image: null },
      });

      await ctx.clerkClient.users.updateUser(input.userId, {
        profileImageID: "",
      });
    }),
});
