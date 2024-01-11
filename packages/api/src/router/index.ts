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
import { leaseRouter } from "./lease";
import { supportRouter } from "./support";
import { geocoderRouter } from "./geocoder";
import { cronRouter } from "./cron";
import { onboardingRouter } from "./onboarding";
import { stripeRouter } from "./stripe";
import { metricsRouter } from "./metrics";

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
  lease: leaseRouter,
  support: supportRouter,
  moderation: moderationRouter,
  geocoder: geocoderRouter,
  cron: cronRouter,
  onboarding: onboardingRouter,
  stripe: stripeRouter,
  metrics: metricsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
