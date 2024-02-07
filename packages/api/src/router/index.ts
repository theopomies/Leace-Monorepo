import { router } from "../trpc";
import { attributesRouter } from "./attributes";
import { authRouter } from "./auth";
import { conversationRouter } from "./conversation";
import { cronRouter } from "./cron";
import { documentRouter } from "./document";
import { geocoderRouter } from "./geocoder";
import { imageRouter } from "./image";
import { leaseRouter } from "./lease";
import { metricsRouter } from "./metrics";
import { moderationRouter } from "./moderation";
import { onboardingRouter } from "./onboarding";
import { stripeRouter } from "./stripe";
import { postRouter } from "./post";
import { relationshipRouter } from "./relationship";
import { reportRouter } from "./report";
import { supportRouter } from "./support";
import { userRouter } from "./user";
import { visitRouter } from "./visit";

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
  visit: visitRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
