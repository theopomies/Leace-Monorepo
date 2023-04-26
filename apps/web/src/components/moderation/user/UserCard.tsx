/* eslint-disable @next/next/no-img-element */
import { trpc } from "../../../utils/trpc";
import { Loader } from "../../shared/Loader";
import { Documents } from "../documents";
import { ChatModal } from "../ChatModal";
import { displayDate } from "../../../utils/displayDate";
import { DisplayReports } from "../../Moderation/Report/DisplayReports";

export interface UserCardProps {
  userId: string;
}

export const UserCard = ({ userId }: UserCardProps) => {
  const { data: user, isLoading: userLoading } =
    trpc.moderation.getUser.useQuery({ userId });
  const { data: isBan } = trpc.moderation.getIsBan.useQuery({ userId });

  if (userLoading) return <Loader />;

  if (!user) return <p>Something went wrong</p>;

  return (
    <div className="flex w-full flex-col overflow-auto rounded-lg bg-white p-8 shadow">
      <img
        src={user.image || "/defaultImage.png"}
        referrerPolicy="no-referrer"
        alt="image"
        className="mx-auto h-32 rounded-full shadow-xl"
      />
      <div className="mt-2 px-16 text-center">
        <h3 className="font-semibold">{user.role}</h3>
        <h3 className=" text-4xl font-semibold">
          {user.firstName ? user.firstName : "FirstName"}{" "}
          {user.lastName ? user.lastName : "LastName"}
        </h3>
        <p className={`text-lg ${!isBan ? "text-green-500" : "text-red-500"}`}>
          {user.status}
        </p>
        <p className="my-5 text-lg text-amber-400">
          {user.isPremium ? "Premium" : "No premium"}
        </p>
        <div className="grid grid-cols-2 gap-4">
          <p className="text-lg">{user.email ? user.email : "No email"}</p>
          <p className="text-lg">
            {user.phoneNumber ? user.phoneNumber : "No phone number"}
          </p>
          <p className="text-lg">
            {user.birthDate ? displayDate(user.birthDate) : "No birth date"}
          </p>
          <p className="text-lg">
            {user.country ? user.country : "No country"}
          </p>
        </div>
      </div>
      <ChatModal userId={user.id} />
      <div className="border-blueGray-200 my-10 border-y py-10 text-center">
        <p className="px-10 text-gray-600">
          {user.description ? user.description : "No description"}
        </p>
      </div>
      <Documents userId={user.id} />
      <DisplayReports reports={user.reports} />
    </div>
  );
};
