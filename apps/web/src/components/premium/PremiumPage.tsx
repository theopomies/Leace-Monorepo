import { RouterOutputs, trpc } from "../../utils/trpc";
import { Loader } from "../shared/Loader";
import { PremiumBanner } from "./PremiumBanner";
import { PremiumFeatures } from "./PremiumFeatures";

export interface PremiumPageProps {
  session: RouterOutputs["auth"]["getSession"];
}

export const PremiumPage = ({ session }: PremiumPageProps) => {
  const { data: user, isLoading: userIsLoading } =
    trpc.user.getUserById.useQuery({ userId: session.userId });

  if (userIsLoading) return <Loader />;

  if (!user) return <div>User not found</div>;

  if (!user.isPremium) {
    return <PremiumFeatures userId={user.id} />;
  }

  return (
    <div className="flex h-screen w-full flex-grow flex-col">
      <PremiumBanner user={user} />
    </div>
  );
};
