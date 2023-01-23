import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { Roles } from "@prisma/client";

export const attributesRouter = router({
  updateUserAtt: protectedProcedure([Roles.TENANT])
    .input(
      z.object({
        id: z.string(),
        location: z.string().optional(),
        maxPrice: z.number().optional(),
        minPrice: z.number().optional(),
        maxSize: z.number().optional(),
        minSize: z.number().optional(),
        rentStartDate: z.date().optional(),
        rentEndDate: z.date().optional(),
        furnished: z.boolean().optional(),
        house: z.boolean().optional(),
        appartment: z.boolean().optional(),
        terrace: z.boolean().optional(),
        pets: z.boolean().optional(),
        smoker: z.boolean().optional(),
        disability: z.boolean().optional(),
        garden: z.boolean().optional(),
        parking: z.boolean().optional(),
        elevator: z.boolean().optional(),
        pool: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const att = await ctx.prisma.attribute.findUnique({
        where: { userId: ctx.session.user.id },
      });
      if (att) {
        return ctx.prisma.attribute.update({
          where: { id: att.id },
          data: {
            location: input.location,
            maxPrice: input.maxPrice,
            minPrice: input.minPrice,
            maxSize: input.maxSize,
            minSize: input.minSize,
            rentStartDate: input.rentStartDate,
            rentEndDate: input.rentEndDate,
            furnished: input.furnished,
            house: input.house,
            appartment: input.appartment,
            terrace: input.terrace,
            pets: input.pets,
            smoker: input.smoker,
            disability: input.disability,
            garden: input.garden,
            parking: input.parking,
            elevator: input.elevator,
            pool: input.pool,
          },
        });
      }
      return ctx.prisma.attribute.create({
        data: {
          userId: ctx.session.user.id,
          location: input.location,
          maxPrice: input.maxPrice,
          minPrice: input.minPrice,
          maxSize: input.maxSize,
          minSize: input.minSize,
          rentStartDate: input.rentStartDate,
          rentEndDate: input.rentEndDate,
          furnished: input.furnished,
          house: input.house,
          appartment: input.appartment,
          terrace: input.terrace,
          pets: input.pets,
          smoker: input.smoker,
          disability: input.disability,
          garden: input.garden,
          parking: input.parking,
          elevator: input.elevator,
          pool: input.pool,
        },
      });
    }),
  updatePostAtt: protectedProcedure([Roles.OWNER, Roles.AGENCY])
    .input(
      z.object({
        id: z.string(),
        location: z.string().optional(),
        maxPrice: z.number().optional(),
        minPrice: z.number().optional(),
        maxSize: z.number().optional(),
        minSize: z.number().optional(),
        rentStartDate: z.date().optional(),
        rentEndDate: z.date().optional(),
        furnished: z.boolean().optional(),
        house: z.boolean().optional(),
        appartment: z.boolean().optional(),
        terrace: z.boolean().optional(),
        pets: z.boolean().optional(),
        smoker: z.boolean().optional(),
        disability: z.boolean().optional(),
        garden: z.boolean().optional(),
        parking: z.boolean().optional(),
        elevator: z.boolean().optional(),
        pool: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const att = await ctx.prisma.attribute.findUnique({
        where: { postId: input.id },
      });
      if (att) {
        return ctx.prisma.attribute.update({
          where: { id: att.id },
          data: {
            location: input.location,
            maxPrice: input.maxPrice,
            minPrice: input.minPrice,
            maxSize: input.maxSize,
            minSize: input.minSize,
            rentStartDate: input.rentStartDate,
            rentEndDate: input.rentEndDate,
            furnished: input.furnished,
            house: input.house,
            appartment: input.appartment,
            terrace: input.terrace,
            pets: input.pets,
            smoker: input.smoker,
            disability: input.disability,
            garden: input.garden,
            parking: input.parking,
            elevator: input.elevator,
            pool: input.pool,
          },
        });
      }
      return ctx.prisma.attribute.create({
        data: {
          postId: input.id,
          location: input.location,
          maxPrice: input.maxPrice,
          minPrice: input.minPrice,
          maxSize: input.maxSize,
          minSize: input.minSize,
          rentStartDate: input.rentStartDate,
          rentEndDate: input.rentEndDate,
          furnished: input.furnished,
          house: input.house,
          appartment: input.appartment,
          terrace: input.terrace,
          pets: input.pets,
          smoker: input.smoker,
          disability: input.disability,
          garden: input.garden,
          parking: input.parking,
          elevator: input.elevator,
          pool: input.pool,
        },
      });
    }),
});
