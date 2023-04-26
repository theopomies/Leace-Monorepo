import { router } from "../trpc";
import { authRouter } from "./auth";
import { userRouter } from "./user";
import { postRouter } from "./post";
import { reportRouter } from "./report";
import { attributesRouter } from "./attributes";
import { moderationRouter } from "./moderation/moderation";
import { relationshipRouter } from "./relationship";
import { documentRouter } from "./document";
import { imageRouter } from "./image";
import { conversationRouter } from "./conversation";
import { leaseRouter } from "./lease";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  post: postRouter,
  report: reportRouter,
  attribute: attributesRouter,
  moderation: moderationRouter,
  relationship: relationshipRouter,
  document: documentRouter,
  image: imageRouter,
  conversation: conversationRouter,
  lease: leaseRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
