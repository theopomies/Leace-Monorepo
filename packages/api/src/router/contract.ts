import { router, protectedProcedure, AuthenticatedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Role, UserStatus, MaritalStatus } from "@prisma/client";
import { getId } from "../utils/getId";
import { filterStrings } from "../utils/filter";
/**
 * export type TenantContract = {
  userId: string  // Clé étrangère pour relier à User
  proofOfIdentity: string | null
  proofOfResidence: string | null
  incomeProof: string | null
  taxNotice: string | null
  guarantorDetails: Guarantor | null
  employmentContract: string | null
  bankDetails: string | null
  homeInsurance: string | null
  educationalRecord: string | null
  depositAmount: number | null
}

export type Guarantor = {
  name: string
  address: string
  incomeProof: string
  taxNotice: string
}
 */
export const tenantContractRouter = router({
    createTenantContract: AuthenticatedProcedure.input(
        z.object({
            userId: z.string(),
            proofOfIdentity: z.string(),
            proofOfResidence: z.string(),
            incomeProof: z.string(),
            taxNotice: z.string(),
            guarantorDetails: z.object({
                name: z.string(),
                address: z.string(),
                incomeProof: z.string(),
                taxNotice: z.string(),
            }),
            employmentContract: z.string(),
            bankDetails: z.string(),
            homeInsurance: z.string(),
            educationalRecord: z.string(),
            depositAmount: z.number(),
        }),
    ).mutation(async ({ ctx, input }) => {
        const userId = getId({ ctx: ctx, userId: input.userId });
        const user = await ctx.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user)
            throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
        const existingTenantContract = await ctx.prisma.tenantContract.findUnique({
            where: { userId: userId },
        });
        if (existingTenantContract)
            throw new TRPCError({
                code: "FORBIDDEN",
                message: "Tenant contract already exist",
            });
        const tenantContract = await ctx.prisma.tenantContract.create({
            data: {
                userId: userId,
                proofOfIdentity: input.proofOfIdentity,
                proofOfResidence: input.proofOfResidence,
                incomeProof: input.incomeProof,
                taxNotice: input.taxNotice,
                guarantorDetails: input.guarantorDetails,
                employmentContract: input.employmentContract,
                bankDetails: input.bankDetails,
                homeInsurance: input.homeInsurance,
                educationalRecord: input.educationalRecord,
                depositAmount: input.depositAmount,
            },
        });
        if (!tenantContract)
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Tenant contract not created" });
        return tenantContract;
    }
    ),
    getTenantContractById: protectedProcedure([
        Role.TENANT,
        Role.OWNER,
        Role.AGENCY,
        Role.ADMIN,
        Role.MODERATOR,
    ])
        .input(z.object({ userId: z.string() }))
        .query(async ({ ctx, input }) => {
            const userId = input.userId;
            const tenantContract = await ctx.prisma.tenantContract.findUnique({
                where: {
                    userId: userId,
                },
            });
            if (!tenantContract)
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Tenant contract not found" });
        }),
    updateTenantContractById: protectedProcedure([
        Role.TENANT,
        Role.ADMIN,
    ])
        .input(z.object({
            userId: z.string(),
            proofOfIdentity: z.string(),
            proofOfResidence: z.string(),
            incomeProof: z.string(),
            taxNotice: z.string(),
            guarantorDetails: z.object({
                name: z.string(),
                address: z.string(),
                incomeProof: z.string(),
                taxNotice: z.string(),
            }),
            employmentContract: z.string(),
            bankDetails: z.string(),
            homeInsurance: z.string(),
            educationalRecord: z.string(),
            depositAmount: z.number(),
        }))
        .mutation(async ({ input, ctx }) => {
            const userId = getId({ ctx: ctx, userId: input.userId });
            const user = await ctx.prisma.user.findUnique({
                where: { id: userId },
            });
            const tenantContract = await ctx.prisma.tenantContract.findUnique({
                where: { userId: userId },
            });
            if (!tenantContract)
                throw new TRPCError({ code: "NOT_FOUND", message: "Tenant contract not found" });
            if (!user)
                throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
            const updated = await ctx.prisma.tenantContract.update({
                where: {
                    userId: userId,
                },
                data: {
                    proofOfIdentity: input.proofOfIdentity,
                    proofOfResidence: input.proofOfResidence,
                    incomeProof: input.incomeProof,
                    taxNotice: input.taxNotice,
                    guarantorDetails: input.guarantorDetails,
                    employmentContract: input.employmentContract,
                    bankDetails: input.bankDetails,
                    homeInsurance: input.homeInsurance,
                    educationalRecord: input.educationalRecord,
                    depositAmount: input.depositAmount,
                },
            });
            if (!updated)
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Tenant contract not updated" });
            filterStrings({
                ctx,
                userId,
                check: [
                    input.proofOfIdentity,
                    input.proofOfResidence,
                    input.incomeProof,
                    input.taxNotice,
                    input.guarantorDetails.name,
                    input.guarantorDetails.address,
                    input.guarantorDetails.incomeProof,
                    input.guarantorDetails.taxNotice,
                    input.employmentContract,
                    input.bankDetails,
                    input.homeInsurance,
                    input.educationalRecord,
                ],
            });
        }),
    deleteTenantContractById: protectedProcedure([
        Role.TENANT,
        Role.OWNER,
        Role.AGENCY,
        Role.ADMIN,
    ])
        .input(z.object({ userId: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const userId = getId({ ctx: ctx, userId: input.userId });
            const tenantContract = await ctx.prisma.tenantContract.findUnique({
                where: { userId: userId },
            });
            if (!tenantContract)
                throw new TRPCError({ code: "NOT_FOUND", message: "Tenant contract not found" });
            const deleted = await ctx.prisma.tenantContract.delete({
                where: {
                    userId: userId,
                },
            });
            if (!deleted)
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Tenant contract not deleted" });
            return { message: "Tenant contract deleted" };
            }),
});