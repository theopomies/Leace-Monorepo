import LoggedLayout from "../components/LoggedLayout";
import { StripePricingTable } from "./premium/stripeComponent";

const Premium = () => {
  return (
    <LoggedLayout title="Premium | Leace">
      <div className="flex w-full flex-col items-center">
        <h1 className="py-10 text-center text-4xl">Leace Premium</h1>
        <div className="mt-12">
          <StripePricingTable />
        </div>
      </div>
    </LoggedLayout>
  );
};

export default Premium;
