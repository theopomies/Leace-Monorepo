import { router, protectedProcedure } from "../../trpc";
import { z } from "zod";
import { Role, RelationType } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const relationshipModeration = router({
  getMatches: protectedProcedure([Role.ADMIN, Role.MODERATOR])
    .input(z.object({ userId: z.string() }).optional())
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input ? input.userId : ctx.auth.userId },
        select: { role: true, id: true },
      });
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      if (user.role === Role.AGENCY || user.role === Role.OWNER) {
        const postIds = await ctx.prisma.post.findMany({
          where: { createdById: user.id },
          select: { id: true },
        });
        if (!postIds) throw new TRPCError({ code: "NOT_FOUND" });

        const relationship = await ctx.prisma.relationship.findMany({
          where: {
            relationType: RelationType.MATCH,
            postId: {
              in: postIds.map((postObj) => {
                return postObj.id;
              }),
            },
          },
          include: {
            post: {
              include: {
                createdBy: true,
              },
            },
            user: true,
            conversation: true,
          },
          orderBy: { updatedAt: "desc" },
        });
        if (!relationship) throw new TRPCError({ code: "NOT_FOUND" });

        return relationship;
      }
      const relationship = await ctx.prisma.relationship.findMany({
        where: {
          relationType: RelationType.MATCH,
          userId: user.id,
        },
        include: {
          post: {
            include: {
              createdBy: true,
            },
          },
          user: true,
          conversation: true,
        },
        orderBy: { updatedAt: "desc" },
      });
      if (!relationship) throw new TRPCError({ code: "NOT_FOUND" });

      return relationship;
    }),
});
