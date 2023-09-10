import { publicProcedure, router } from "../trpc";

export const cronRouter = router({
  checkInactivity: publicProcedure.query(async ({ ctx }) => {
    try {
      // retrieve all active users
      const users = await ctx.prisma.user.findMany({
        where: {
          status: "ACTIVE",
        },
      });

      const now = new Date();

      // users that have not logged in for more than 30 days
      const inactiveUsers = users.filter((user) => {
        return (
          (now.getTime() - user.lastLogin.getTime()) / (1000 * 3600 * 24) > 30
        );
      });

      await ctx.prisma.user.updateMany({
        where: {
          id: {
            in: inactiveUsers.map((user) => user.id),
          },
        },
        data: {
          status: "INACTIVE",
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error("Error while trying to launch the job");
    }
  }),
});
