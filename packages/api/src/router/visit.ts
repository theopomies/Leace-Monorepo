import { Role } from "@leace/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const visitRouter = router({
    createVisit: protectedProcedure([Role.AGENCY, Role.OWNER]).input(z.object({
        postId: z.string(),
        userId: z.string(),
        scheduledAt: z.date(),
    })).mutation(async ({ ctx, input }) => {
        const user = await ctx.prisma.user.findUnique({
            where: { id: input.userId },
        });

        if (!user) throw new TRPCError({ code: "NOT_FOUND" });

        const post = await ctx.prisma.post.findUnique({
            where: { id: input.postId },
        });

        if (!post) throw new TRPCError({ code: "NOT_FOUND" });

        if (post.createdById != ctx.auth.userId) throw new TRPCError({ code: "FORBIDDEN" });

        const visit = await ctx.prisma.visit.create({
            data: {
                userId: input.userId,
                postId: input.postId,
                scheduledAt: new Date(input.scheduledAt),
            },
        });

        if (!visit) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }),
    acceptVisit: protectedProcedure([Role.TENANT]).input(z.object({
        visitId: z.string(),
        conversationId: z.string(),
    })).mutation(async ({ ctx, input }) => {
        const visit = await ctx.prisma.visit.findUnique({
            where: { id: input.visitId },
        });

        if (!visit) throw new TRPCError({ code: "NOT_FOUND" });

        if (visit.userId != ctx.auth.userId) throw new TRPCError({ code: "FORBIDDEN" });

        const updated = await ctx.prisma.visit.update({
            where: { id: input.visitId },
            data: { accepted: true },
        });

        if (!updated) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        const conversation = await ctx.prisma.conversation.findUnique({
            where: { id: input.conversationId },
        });

        if (!conversation) throw new TRPCError({ code: "NOT_FOUND" });

        const acceptedMessage = await ctx.prisma.message.create({
            data: {
                content: "Visit accepted for " + visit.scheduledAt.toLocaleString(),
                conversationId: conversation.id,
                senderId: ctx.auth.userId,
                informative: true,
                read: false,
            },
        });

        if (!acceptedMessage) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }),
    declineVisit: protectedProcedure([Role.TENANT]).input(z.object({
        visitId: z.string(),
        conversationId: z.string(),
    })).mutation(async ({ ctx, input }) => {
        const visit = await ctx.prisma.visit.findUnique({
            where: { id: input.visitId },
        });

        if (!visit) throw new TRPCError({ code: "NOT_FOUND" });

        if (visit.userId != ctx.auth.userId) throw new TRPCError({ code: "FORBIDDEN" });

        const deleted = await ctx.prisma.visit.delete({
            where: { id: input.visitId },
        });

        if (!deleted) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        const conversation = await ctx.prisma.conversation.findUnique({
            where: { id: input.conversationId },
        });

        if (!conversation) throw new TRPCError({ code: "NOT_FOUND" });

        const declinedMessage = await ctx.prisma.message.create({
            data: {
                content: "Visit declined for " + visit.scheduledAt.toLocaleString(),
                conversationId: conversation.id,
                senderId: ctx.auth.userId,
                informative: true,
                read: false,
            },
        });

        if (!declinedMessage) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }),
    getVisits: protectedProcedure([Role.AGENCY, Role.OWNER]).input(z.object({
        userId: z.string(),
    })).query(async ({ ctx, input }) => {
        const user = await ctx.prisma.user.findUnique({
            where: { id: input.userId },
        });

        if (!user) throw new TRPCError({ code: "NOT_FOUND" });

        if (user.id != ctx.auth.userId) throw new TRPCError({ code: "FORBIDDEN" });

        const posts = await ctx.prisma.post.findMany({
            where: { createdById: user.id },
            select: { id: true },
        });

        const visits = await ctx.prisma.visit.findMany({
            where: { postId: { in: posts.map((post) => post.id) } },
            include: {
                post: {
                    select: { title: true, attribute: true },
                },
                user: {
                    select: { firstName: true, lastName: true },
                },
            },
        });

        return visits;
    }),
    getVisit: protectedProcedure([Role.TENANT, Role.AGENCY, Role.OWNER]).input(z.object({
        userId: z.string(),
        postId: z.string(),
    })).query(async ({ ctx, input }) => {
        const user = await ctx.prisma.user.findUnique({
            where: { id: input.userId },
        });

        if (!user) throw new TRPCError({ code: "NOT_FOUND" });

        const post = await ctx.prisma.post.findUnique({
            where: { id: input.postId },
        });

        if (!post) throw new TRPCError({ code: "NOT_FOUND" });

        if (user.id != ctx.auth.userId && post.createdById != ctx.auth.userId) throw new TRPCError({ code: "FORBIDDEN" });

        const visit = await ctx.prisma.visit.findFirst({
            where: { postId: post.id, userId: user.id },
        });

        return visit;
    }),

});