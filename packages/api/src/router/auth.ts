import { publicProcedure, router } from "../trpc";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return { auth: ctx.auth, role: ctx.role };
  }),
});
