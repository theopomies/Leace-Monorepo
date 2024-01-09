import { protectedProcedure, router } from "../trpc";
import { getId } from "../utils/getId";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Role } from "@prisma/client";

type MonthlyData = {
  month: string;
  count: number;
};

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function initializeMonthlyData(): MonthlyData[] {
  return monthNames.map((monthName) => ({ month: monthName, count: 0 }));
}

export const dashboardRouter = router({
  metricsByUserId: protectedProcedure([Role.OWNER, Role.AGENCY])
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const userId = getId({ ctx: ctx, userId: input.userId });

      const user = await ctx.prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      const leases = await ctx.prisma.lease.findMany({
        where: { createdBy: { id: userId }, isSigned: true },
        select: {
          startDate: true,
          rentCost: true,
        },
      });

      const monthlyRevenuesData = initializeMonthlyData();
      leases.forEach(({ startDate, rentCost }) => {
        const month = startDate.getMonth();
        const data = monthlyRevenuesData[month];
        if (data) {
          data.count += rentCost;
        }
      });

      const relationships = await ctx.prisma.relationship.findMany({
        where: {
          post: { createdById: userId },
          relationType: { in: ["POST", "MATCH"] },
        },
        select: { createdAt: true },
      });

      const monthlyLikesData = initializeMonthlyData();
      relationships.forEach(({ createdAt }) => {
        const month = createdAt.getMonth();
        const data = monthlyLikesData[month];
        if (data) {
          data.count += 1;
        }
      });

      const monthlyLeaseSignedData = initializeMonthlyData();
      leases.forEach(({ startDate }) => {
        const month = startDate.getMonth();
        const data = monthlyLeaseSignedData[month];
        if (data) {
          data.count += 1;
        }
      });

      return {
        monthlyRevenues: monthlyRevenuesData,
        monthlyLikes: monthlyLikesData,
        monthlyLeaseSigned: monthlyLeaseSignedData,
      };
    }),
  getRented: protectedProcedure([Role.AGENCY, Role.OWNER])
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = getId({ ctx, userId: input.userId });

      const user = await ctx.prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      const signedLeases = await ctx.prisma.lease.findMany({
        where: {
          createdBy: { id: userId },
          isSigned: true,
        },
        include: {
          relationship: {
            include: {
              post: true,
              user: true,
            },
          },
        },
      });

      const rentedProperties = signedLeases.map(
        ({ relationship, rentCost, startDate, endDate }) => {
          return {
            id: relationship.postId,
            title: relationship.post.title
              ? relationship.post.title
              : "Unknown title",
            owner: `${user.firstName} ${user.lastName}`,
            ownerId: relationship.post.createdById,
            tenant: relationship.user
              ? `${relationship.user.firstName} ${relationship.user.lastName}`
              : "N/A",
            tenantId: relationship.userId,
            rent: rentCost,
            leaseBegin: startDate.toDateString(),
            leaseEnd: endDate.toDateString(),
          };
        },
      );

      return rentedProperties;
    }),
  getPending: protectedProcedure([Role.AGENCY, Role.OWNER])
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = getId({ ctx, userId: input.userId });

      const user = await ctx.prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      const posts = await ctx.prisma.post.findMany({
        where: {
          createdById: userId,
          relationships: { every: { lease: null } },
        },
        include: {
          relationships: true,
        },
      });

      const pendingProperties = posts.map((post) => {
        const likes = post.relationships.filter(
          (r) => r.relationType === "TENANT",
        ).length;
        const matches = post.relationships.filter(
          (r) => r.relationType === "MATCH",
        ).length;

        return {
          id: post.id,
          title: post.title ? post.title : "Unknown Title",
          owner: `${user.firstName} ${user.lastName}`,
          ownerId: user.id,
          rent: post.estimatedCosts ?? 0,
          likes: likes,
          matches: matches,
          createdAt: post.createdAt.toDateString(),
        };
      });

      return pendingProperties;
    }),
});
