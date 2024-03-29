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
import { postRouter } from "./post";
import { relationshipRouter } from "./relationship";
import { reportRouter } from "./report";
import { supportRouter } from "./support";
import { userRouter } from "./user";
import { visitRouter } from "./visit";
import { stripeRouter } from "./stripe";

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
  metrics: metricsRouter,
  visit: visitRouter,
  stripe: stripeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
