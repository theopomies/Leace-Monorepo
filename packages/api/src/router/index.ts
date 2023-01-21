import { router } from "../trpc";
import { postRouter } from "./post";
import { authRouter } from "./auth";
import { userRouter } from "./user";
import { reportRouter } from "./report";
import { attributesRouter } from "./attributes";
import { moderationRouter } from "./moderation";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  post: postRouter,
  report: reportRouter,
  attribute: attributesRouter,
  moderation: moderationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
