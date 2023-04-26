import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { getId } from "../utils/getId";
import { UserStatus, PostType } from "@prisma/client";

export const leaseRouter = router({
  createLease: protectedProcedure([Role.AGENCY, Role.OWNER])
    .input(
      z.object({
        relationShipId: z.string(),
        isSigned: z.boolean().optional(),
        rentCost: z.number().optional(),
        utilitiesCost: z.number().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const rs = await ctx.prisma.relationship.findUnique({
        where: { id: input.relationShipId },
      });

      if (!rs) throw new TRPCError({ code: "NOT_FOUND" });

      const post = await ctx.prisma.post.findUnique({
        where: { id: rs.postId },
      });

      if (!post) throw new TRPCError({ code: "NOT_FOUND" });

      if (
        ctx.role != Role.MODERATOR &&
        ctx.role != Role.ADMIN &&
        ctx.auth.userId != post.createdById
      ) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const lease = await ctx.prisma.lease.create({
        data: {
          relationShipId: rs.id,
          isSigned: input.isSigned,
          rentCost: input.rentCost,
          utilitiesCost: input.utilitiesCost,
          startDate: input.startDate,
          endDate: input.endDate,
          createdById: post.createdById,
        },
      });

      if (!lease) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      if (input.isSigned && input.startDate) {
        const currentDate: Date = new Date();

        if (currentDate >= input.startDate) {
          const tenant = ctx.prisma.user.update({
            where: { id: rs.userId },
            data: { status: UserStatus.INACTIVE },
          });

          if (!tenant) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

          const post = ctx.prisma.post.update({
            where: { id: rs.postId },
            data: { type: PostType.RENTED },
          });

          if (!post) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }
      }

      return lease;
    }),
  updateLeaseById: protectedProcedure([Role.AGENCY, Role.OWNER])
    .input(
      z.object({
        leaseId: z.string(),
        isSigned: z.boolean(),
        rentCost: z.number(),
        utilitiesCost: z.number(),
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const lease = await ctx.prisma.lease.findUnique({
        where: { id: input.leaseId },
      });

      if (!lease) throw new TRPCError({ code: "NOT_FOUND" });

      const rs = await ctx.prisma.relationship.findUnique({
        where: { id: lease.relationShipId },
      });

      if (!rs) throw new TRPCError({ code: "NOT_FOUND" });

      const post = await ctx.prisma.post.findUnique({
        where: { id: rs.postId },
      });

      if (!post) throw new TRPCError({ code: "NOT_FOUND" });

      if (
        ctx.role != Role.MODERATOR &&
        ctx.role != Role.ADMIN &&
        ctx.auth.userId != post.createdById
      ) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const updated = await ctx.prisma.lease.update({
        where: { id: input.leaseId },
        data: {
          isSigned: input.isSigned,
          rentCost: input.rentCost,
          utilitiesCost: input.utilitiesCost,
          startDate: input.startDate,
          endDate: input.endDate,
        },
      });

      if (!updated) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      if (input.isSigned && input.startDate) {
        const currentDate: Date = new Date();

        if (currentDate >= input.startDate) {
          const tenant = ctx.prisma.user.update({
            where: { id: rs.userId },
            data: { status: UserStatus.INACTIVE },
          });
          if (!tenant) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
          const post = ctx.prisma.post.update({
            where: { id: rs.postId },
            data: { type: PostType.RENTED },
          });
          if (!post) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }
      }
    }),
  deleteLeaseById: protectedProcedure([Role.AGENCY, Role.OWNER])
    .input(z.object({ leaseId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const lease = await ctx.prisma.lease.findUnique({
        where: { id: input.leaseId },
      });

      if (!lease) throw new TRPCError({ code: "NOT_FOUND" });

      const rs = await ctx.prisma.relationship.findUnique({
        where: { id: lease.relationShipId },
      });

      if (!rs) throw new TRPCError({ code: "NOT_FOUND" });

      const post = await ctx.prisma.post.findUnique({
        where: { id: rs.postId },
      });

      if (!post) throw new TRPCError({ code: "NOT_FOUND" });

      if (
        ctx.role != Role.MODERATOR &&
        ctx.role != Role.ADMIN &&
        ctx.auth.userId != post.createdById
      ) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const deleted = await ctx.prisma.post.delete({
        where: { id: input.leaseId },
      });

      if (!deleted) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }),
  getLeaseById: protectedProcedure([Role.TENANT, Role.AGENCY, Role.OWNER])
    .input(z.object({ leaseId: z.string() }))
    .query(async ({ ctx, input }) => {
      const lease = await ctx.prisma.lease.findUnique({
        where: { id: input.leaseId },
      });

      if (!lease) throw new TRPCError({ code: "NOT_FOUND" });

      const rs = await ctx.prisma.relationship.findUnique({
        where: { id: lease.relationShipId },
      });

      if (!rs) throw new TRPCError({ code: "NOT_FOUND" });

      const post = await ctx.prisma.post.findUnique({
        where: { id: rs.postId },
      });

      if (!post) throw new TRPCError({ code: "NOT_FOUND" });

      if (
        ctx.role != Role.MODERATOR &&
        ctx.role != Role.ADMIN &&
        ctx.auth.userId != post.createdById &&
        ctx.auth.userId != rs.userId
      ) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return lease;
    }),
  getLeasesByUserId: protectedProcedure([Role.OWNER, Role.AGENCY])
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = getId({ ctx, userId: input.userId });

      const leases = await ctx.prisma.lease.findMany({
        where: { createdById: userId },
      });

      if (!leases) throw new TRPCError({ code: "NOT_FOUND" });

      return leases;
    }),
});
