import { router } from "../trpc";
import { authRouter } from "./auth";
import { userRouter } from "./user";
import { postRouter } from "./post";
import { reportRouter } from "./report";
import { attributesRouter } from "./attributes";
import { moderationRouter } from "./moderation";
import { documentRouter } from "./document";
import { imageRouter } from "./image";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  post: postRouter,
  report: reportRouter,
  attribute: attributesRouter,
  moderation: moderationRouter,
  image: imageRouter,
  document: documentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
