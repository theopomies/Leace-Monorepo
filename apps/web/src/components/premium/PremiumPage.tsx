import { trpc } from "../../utils/trpc";
import { StripePricingTable } from "./StripePricingTable";

export interface PremiumPageProps {
  userId: string;
}

export const PremiumPage = ({ userId }: PremiumPageProps) => {
  const { data: user, isLoading } = trpc.user.getUserById.useQuery({
    userId,
  });

  if (isLoading || !user) {
    return <div>loading...</div>;
  }

  if (user.isPremium) {
    return (
      <div className="flex w-full flex-col items-center">
        <h1 className="py-10 text-center text-4xl">Leace Premium</h1>
        <h2>Already Premium</h2>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center">
      <h1 className="py-10 text-center text-4xl">Leace Premium</h1>
      <div className="mt-12">
        <StripePricingTable userId={user.id} />
      </div>
    </div>
  );
};
