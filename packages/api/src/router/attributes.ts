import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { getId } from "../utils/getId";
import axios from "axios";

export const attributesRouter = router({
  updateUserAttributes: protectedProcedure([Role.TENANT])
    .input(
      z.object({
        userId: z.string(),
        location: z.string().optional(),
        range: z.number().optional(),
        maxPrice: z.number().optional(),
        minPrice: z.number().optional(),
        maxSize: z.number().optional(),
        minSize: z.number().optional(),
        rentStartDate: z.date().optional(),
        rentEndDate: z.date().optional(),
        furnished: z.boolean().optional(),
        homeType: z.enum(["HOUSE", "APARTMENT", ""]).optional(),
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
      const userId = getId({ ctx, userId: input.userId });

      const user = await ctx.prisma.user.findUnique({ where: { id: userId } });

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      if (user.role != Role.TENANT) throw new TRPCError({ code: "FORBIDDEN" });

      const attribute = await ctx.prisma.attribute.findUnique({
        where: { userId: userId },
      });

      // Check location and find lat and lng
      let lat = null;
      let lng = null;

      if (input.location) {
        try {
          const response = await axios.get(
            `https://api.geoapify.com/v1/geocode/search?text=${input.location}&apiKey=${process.env.GEOAPIFY_KEY}`,
          );
          if (response.data.features.length > 0) {
            const location = response.data.features[0].properties;
            input.location = location.formatted;
            if (location.lat && location.lon) {
              (lat = location.lat), (lng = location.lon);
            } else {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Location not found",
              });
            }
          } else {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Location not found",
            });
          }
        } catch (error) {
          console.error(error);
        }
      }

      if (!attribute) {
        const created = await ctx.prisma.attribute.create({
          data: {
            userId: userId,
            location: input.location,
            lat: lat,
            lng: lng,
            range: input.range,
            maxPrice: input.maxPrice,
            minPrice: input.minPrice,
            maxSize: input.maxSize,
            minSize: input.minSize,
            rentStartDate: input.rentStartDate,
            rentEndDate: input.rentEndDate,
            furnished: input.furnished,
            homeType: input.homeType || null,
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

        if (!created) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        return;
      }

      const updated = await ctx.prisma.attribute.update({
        where: { id: attribute.id },
        data: {
          location: input.location,
          lat: lat,
          lng: lng,
          range: input.range,
          maxPrice: input.maxPrice,
          minPrice: input.minPrice,
          maxSize: input.maxSize,
          minSize: input.minSize,
          rentStartDate: input.rentStartDate,
          rentEndDate: input.rentEndDate,
          furnished: input.furnished,
          homeType: input.homeType || null,
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

      if (!updated) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }),
  updatePostAttributes: protectedProcedure([Role.OWNER, Role.AGENCY])
    .input(
      z.object({
        postId: z.string(),
        location: z.string().optional(),
        price: z.number().optional(),
        size: z.number().optional(),
        rentStartDate: z.date().optional(),
        rentEndDate: z.date().optional(),
        furnished: z.boolean().optional(),
        homeType: z.enum(["HOUSE", "APARTMENT", ""]).optional(),
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
      const post = await ctx.prisma.post.findUnique({
        where: { id: input.postId },
      });

      if (!post) throw new TRPCError({ code: "NOT_FOUND" });

      if (
        post.createdById != ctx.auth.userId &&
        ctx.role != Role.ADMIN &&
        ctx.role != Role.MODERATOR
      )
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This is not a post from this user",
        });

      // Check location and find lat and lng
      let lat = null;
      let lng = null;

      if (input.location) {
        try {
          const response = await axios.get(
            `https://api.geoapify.com/v1/geocode/search?text=${input.location}&apiKey=${process.env.GEOAPIFY_KEY}`,
          );
          if (response.data.features.length > 0) {
            const location = response.data.features[0].properties;
            input.location = location.formatted;
            if (location.lat && location.lon) {
              (lat = location.lat), (lng = location.lon);
            } else {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Location not found",
              });
              
            }
          } else {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Location not found",
            });
          }
        } catch (error) {
          console.error(error);
        }
      }

      const attribute = await ctx.prisma.attribute.findUnique({
        where: { postId: input.postId },
      });

      if (!attribute) {
        const created = await ctx.prisma.attribute.create({
          data: {
            postId: input.postId,
            location: input.location,
            lat: lat,
            lng: lng,
            price: input.price,
            size: input.size,
            rentStartDate: input.rentStartDate,
            rentEndDate: input.rentEndDate,
            furnished: input.furnished,
            homeType: input.homeType || null,
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
        if (!created) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        return;
      }
      const updated = await ctx.prisma.attribute.update({
        where: { id: attribute.id },
        data: {
          location: input.location,
          lat: lat,
          lng: lng,
          price: input.price,
          size: input.size,
          rentStartDate: input.rentStartDate,
          rentEndDate: input.rentEndDate,
          furnished: input.furnished,
          homeType: input.homeType || null,
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

      if (!updated) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }),
});
