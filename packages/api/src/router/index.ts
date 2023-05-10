import { router } from "../trpc";
import { authRouter } from "./auth";
import { userRouter } from "./user";
import { postRouter } from "./post";
import { reportRouter } from "./report";
import { attributesRouter } from "./attributes";
import { moderationRouter } from "./moderation";
import { relationshipRouter } from "./relationship";
import { documentRouter } from "./document";
import { imageRouter } from "./image";
import { conversationRouter } from "./conversation";
import { supportRouter } from "./support";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  post: postRouter,
  report: reportRouter,
  attribute: attributesRouter,
  relationship: relationshipRouter,
  document: documentRouter,
  image: imageRouter,
  conversation: conversationRouter,
  support: supportRouter,
  moderation: moderationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
