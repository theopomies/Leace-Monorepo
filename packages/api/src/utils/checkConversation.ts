import { Conversation, Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { Context } from "../context";

interface checkConversationProps {
  ctx: Context;
  conversation: Conversation | null;
}

export const checkConversation = async ({
  ctx,
  conversation,
}: checkConversationProps) => {
  if (!conversation) throw new TRPCError({ code: "NOT_FOUND" });
  if (!conversation.relationId && !conversation.supportRelationId)
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

  if (conversation.relationId) {
    const relationship = await ctx.prisma.relationship.findUnique({
      where: { id: conversation.relationId },
    });
    if (!relationship) throw new TRPCError({ code: "NOT_FOUND" });
    if (ctx.role == Role.OWNER || ctx.role == Role.AGENCY) {
      const post = await ctx.prisma.post.findUnique({
        where: { id: relationship.postId },
      });
      if (!post) throw new TRPCError({ code: "NOT_FOUND" });
      if (post.createdById != ctx.auth.userId)
        throw new TRPCError({ code: "FORBIDDEN" });
    }
    if (ctx.role == Role.TENANT) {
      if (relationship.userId != ctx.auth.userId)
        throw new TRPCError({ code: "FORBIDDEN" });
    }
  }

  if (conversation.supportRelationId) {
    const supportRelationship = await ctx.prisma.supportRelationship.findUnique(
      {
        where: { id: conversation.supportRelationId },
      },
    );
    if (!supportRelationship) throw new TRPCError({ code: "NOT_FOUND" });

    if (ctx.role == Role.ADMIN || ctx.role == Role.MODERATOR) {
      if (supportRelationship.supportId != ctx.auth.userId)
        throw new TRPCError({ code: "FORBIDDEN" });
    } else {
      if (supportRelationship.userId != ctx.auth.userId)
        throw new TRPCError({ code: "FORBIDDEN" });
    }
  }

  return conversation;
};
