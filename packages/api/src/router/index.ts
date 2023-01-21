import { router } from "../trpc";
import { postRouter } from "./post";
import { authRouter } from "./auth";
import { userRouter } from "./user";
import { moderationRouter } from "./moderation";

export const appRouter = router({
  user: userRouter,
  post: postRouter,
  auth: authRouter,
  moderation: moderationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
