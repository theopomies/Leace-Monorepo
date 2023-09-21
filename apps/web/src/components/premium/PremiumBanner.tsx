import { User } from "@prisma/client";
export interface PremiumBannerProps {
  user: User;
}

export const PremiumBanner = ({ user }: PremiumBannerProps) => {
  return (
    <div className="flex h-32 w-full items-center justify-center rounded-b-2xl bg-gradient-to-tr from-amber-400 via-blue-500 to-black">
      <div className="flex flex-col items-center justify-center space-y-2">
        <h1 className="text-3xl font-bold text-white">
          You are a <b className="font-extrabold text-amber-400">Premium</b>{" "}
          user
        </h1>
        <p className="text-white">
          You can now discover all your potentials matches here !
        </p>
        <a
          href={`https://billing.stripe.com/p/login/test_4gw5of526bSw6WI288?prefilled_email=${user.email}`}
          target="_blank"
          className="absolute right-4 rounded-full bg-white px-8 py-3 text-lg font-bold text-blue-500 shadow-lg transition duration-500 ease-in-out hover:scale-105"
          rel="noreferrer"
        >
          Manage your subscription
        </a>
      </div>
    </div>
  );
};
