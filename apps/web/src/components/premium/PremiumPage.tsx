import { trpc } from "../../utils/trpc";
import { Loader } from "../shared/Loader";
import { StripePricingTable } from "./StripePricingTable";
import { FeatureCard } from "./FeatureCard";
import {
  faHourglassHalf,
  faInfinity,
  faMagnifyingGlass,
  faRectangleAd,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";

export const featureList = [
  {
    name: "Unlimited actions",
    description:
      "Take charge of your real estate journey with unlimited swipes, rewinds and matches. No more restrictions on interactions or listings. Seize every opportunity and make your dream property a reality.",
    icon: faInfinity,
  },
  {
    name: "No more ads",
    description:
      "Say goodbye to ads and enjoy an uninterrupted real estate experience. Focus solely on finding your ideal property without any distractions.",
    icon: faRectangleAd,
  },
  {
    name: "Discover who liked you",
    description:
      "Uncover the excitement of your potential connections. Get insights into potential tenants who are interested in your property or landlords / agencies who liked your profile.",
    icon: faMagnifyingGlass,
  },
  {
    name: "Boost your visibility",
    description:
      "Elevate your presence by boosting your visibility. Increase your listing's exposure and reach a broader audience, maximizing your chances of matching.",
    icon: faRocket,
  },
  {
    name: "More coming soon",
    description:
      "Exciting updates are on the horizon! Stay tuned for more innovative features that will further enhance your real estate journey.",
    icon: faHourglassHalf,
  },
];

export interface PremiumPageProps {
  userId: string;
}

export const PremiumPage = ({ userId }: PremiumPageProps) => {
  const { data: user, isLoading } = trpc.user.getUserById.useQuery({
    userId,
  });

  const isBrowser = () => typeof window !== "undefined"; //The approach recommended by Next.js

  function scrollToBottom() {
    if (!isBrowser()) return;
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  }

  if (isLoading || !user) {
    return <Loader />;
  }

  return (
    <div className="from--blue-500 flex w-full flex-col overflow-hidden bg-gradient-to-tr from-blue-100 to-white">
      <div className="flex h-screen flex-col items-center justify-evenly">
        <div>
          <h1 className="mt-12 text-center text-6xl font-extrabold text-blue-500">
            LEACE{" "}
            <b className="bg-clip-text font-extrabold text-amber-400">
              Premium
            </b>
          </h1>
          <h2 className="mb-8 text-5xl font-extrabold text-blue-500">
            Enjoy the <span className="text-amber-400">full experience</span>
          </h2>
        </div>
        <div className="animate-curtain relative mb-5 grid w-2/3 grid-cols-2 flex-row items-stretch justify-center">
          {featureList.map((feature, index) => (
            <div key={index}>
              <FeatureCard {...feature}></FeatureCard>
            </div>
          ))}
        </div>
        <button
          onClick={scrollToBottom}
          className="mb-8 transform rounded-full bg-amber-400 px-8 py-3 text-lg font-bold text-white shadow-lg transition duration-500 ease-in-out hover:scale-105"
        >
          Get Premium
        </button>
      </div>
      <div className="flex h-screen w-full flex-col items-center justify-center text-blue-400">
        <h3 className="mb-5 text-5xl font-extrabold">
          Enjoy the full experience
        </h3>
        <p className="mb-5 text-4xl font-extrabold">
          with LEACE <b className=" font-extrabold text-amber-400">Premium</b>
        </p>
        <div className="mb-5 rounded-2xl bg-white p-3 shadow-lg shadow-gray-400">
          <StripePricingTable userId={user.id} />
        </div>
      </div>
    </div>
  );
};
