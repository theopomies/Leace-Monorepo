/* eslint-disable @next/next/no-img-element */
import { Ban } from "@prisma/client";
import { displayDate } from "../../../utils/displayDate";

export interface BanMessageProps {
  ban: Ban;
}

export const BanMessage = ({ ban }: BanMessageProps) => {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex w-2/4 flex-col items-center justify-center gap-5 rounded-lg bg-white p-12 shadow-xl">
        <img
          src={"/banUser.png"}
          alt="Ban User"
          referrerPolicy="no-referrer"
          className="mx-auto w-32"
        />
        <p className="text-xl uppercase tracking-wider">You have been banned</p>
        <div className="mt-10 flex w-full flex-col gap-3">
          <p>Hello,</p>
          {ban.reason && (
            <p>
              Your account has been banned for
              <span className="font-bold"> {ban.reason} </span>
              until <span className="font-bold">{displayDate(ban.until)}</span>.
              <br />
              If you believe you have been banned for the wrong reason, please
              contact us.
            </p>
          )}
          <div>
            <p>Comment:</p>
            <span className="italic">{ban.comment}</span>
          </div>
          <p></p>
          <p>Thank you.</p>
          <p className="text-gray-500">
            This ban was issued on {displayDate(ban.createdAt)}.
          </p>
        </div>
      </div>
    </div>
  );
};
