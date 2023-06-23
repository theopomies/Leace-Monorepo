/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { User } from "@prisma/client";

export interface PostBarUserProps {
  user: User;
  userLink: string;
}

export const PostBarUser = ({ user, userLink }: PostBarUserProps) => {
  return (
    <Link href={userLink.replace("[userId]", user.id)}>
      <div className="ml-4 flex h-full border-l p-2">
        <div className="p-8">
          <div className="text-sm font-semibold uppercase tracking-wide text-indigo-500">
            {user.firstName}
          </div>
          <p className="mt-1 block text-lg font-medium leading-tight text-black">
            {user.lastName}
          </p>
        </div>
      </div>
    </Link>
  );
};
