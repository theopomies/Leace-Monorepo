import { router, protectedProcedure } from "../../trpc";
import { z } from "zod";
import { Role } from "@prisma/client";

export const userModeration = router({
  getUserById: protectedProcedure([Role.ADMIN, Role.MODERATOR])
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
  searchUsers: protectedProcedure([Role.ADMIN, Role.MODERATOR])
    .input(z.object({ name: z.string() }))
    .query(({ ctx, input }) => {
      const nameParts = input.name
        .split(" ")
        .filter((namePart) => namePart.trim() !== "");

      // Construct the search conditions for firstName and lastName separately
      const firstNameConditions = nameParts.flatMap((namePart) => [
        { firstName: { startsWith: namePart } }, // decide if startsWith or contains
      ]);

      const lastNameConditions = nameParts.flatMap((namePart) => [
        { lastName: { startsWith: namePart } },
      ]);

      // Check if nameParts contains more than one string
      const whereCondition =
        nameParts.length > 1
          ? { AND: [{ OR: firstNameConditions }, { OR: lastNameConditions }] } // Use an AND condition if nameParts has multiple strings
          : { OR: [...firstNameConditions, ...lastNameConditions] }; // Use the OR condition if nameParts has only one string

      // Find users where firstName or/and lastName starts with nameParts
      return ctx.prisma.user.findMany({
        where: whereCondition,
        select: { id: true, firstName: true, lastName: true },
        take: 5,
      });
    }),
});
