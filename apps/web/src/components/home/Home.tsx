import { Role } from "@prisma/client";
import { useRouter } from "next/router";
import { RouterOutputs } from "../../utils/trpc";
import { ModerationReportPage } from "../moderation/moderation/ModerationReportPage";
import { Loader } from "../shared/Loader";
import { AgencyOwnerHome } from "./agency-owner-home/AgencyOwnerHome";
import { PostStack } from "./stack/PostStack";

export interface HomeProps {
  session: RouterOutputs["auth"]["getSession"];
}

export const Home = ({ session }: HomeProps) => {
  const router = useRouter();

  const role = session.role;

  if (role == undefined) {
    router.push("/onboarding");
    return <Loader />;
  }

  if (role == Role.ADMIN) {
    router.push("/administration");
    return <Loader />;
  }

  if (role == Role.MODERATOR) return <ModerationReportPage />;

  if (role == Role.TENANT) return <PostStack userId={session.userId} />;

  return <AgencyOwnerHome userId={session.userId} />;
};
