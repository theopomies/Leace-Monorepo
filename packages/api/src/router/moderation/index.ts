import { router } from "../../trpc";
import { userModeration } from "./user";
import { postModeration } from "./post";
import { reportModeration } from "./report";
import { banModeration } from "./ban";
import { relationshipModeration } from "./relationship";
import { documentModeration } from "./document";
import { imageModeration } from "./image";
import { conversationModeration } from "./conversation";
import { supportModeration } from "./support";

export const moderationRouter = router({
  user: userModeration,
  post: postModeration,
  report: reportModeration,
  ban: banModeration,
  relationship: relationshipModeration,
  document: documentModeration,
  image: imageModeration,
  conversation: conversationModeration,
  support: supportModeration,
});
