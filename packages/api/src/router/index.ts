import { router } from "../trpc";
import { authRouter } from "./auth";
import { userRouter } from "./user";
import { postRouter } from "./post";
import { reportRouter } from "./report";
import { attributesRouter } from "./attributes";
import { moderationRouter } from "./moderation";
import { relationShipRouter } from "./relationship";
import { documentRouter } from "./document";
import { imageRouter } from "./image";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  post: postRouter,
  report: reportRouter,
  attribute: attributesRouter,
  moderation: moderationRouter,
  relationShip: relationShipRouter,
  document: documentRouter,
  image: imageRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
