import LoggedLayout from "../components/LoggedLayout";
import { StripePricingTable } from "../components/premium/stripeComponent";
import { trpc } from "../utils/trpc";

const Premium = () => {
  const { data: user, isLoading } = trpc.user.getUser.useQuery();

  console.log(user);

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (!user)
    return (
      <div className="flex w-full flex-col items-center">
        <h1 className="py-10 text-center text-4xl">Leace Premium</h1>
        <h2>Please Login</h2>
      </div>
    );

  if (user.isPremium) {
    return (
      <div className="flex w-full flex-col items-center">
        <h1 className="py-10 text-center text-4xl">Leace Premium</h1>
        <h2>Already Premium</h2>
      </div>
    );
  }

  return (
    <LoggedLayout title="Premium | Leace">
      <div className="flex w-full flex-col items-center">
        <h1 className="py-10 text-center text-4xl">Leace Premium</h1>
        <div className="mt-12">
          <StripePricingTable userId={user.id} />
        </div>
      </div>
    </LoggedLayout>
  );
};

export default Premium;
