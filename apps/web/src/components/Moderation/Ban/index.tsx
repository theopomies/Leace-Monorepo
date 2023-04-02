import { XOR } from "../../../utils/types";
import { BanUser } from "./BanUser";
import { RejectPostReports } from "./RejectPostReports";
import { RejectUserReports } from "./RejectUserReports";

export type BanProps = XOR<{ userId: string }, { postId: string }>;

export const Ban = ({ userId, postId }: BanProps) => {
  if (userId)
    return (
      <div className="flex w-full flex-row justify-between">
        <BanUser userId={userId} />
        <RejectUserReports userId={userId} />
      </div>
    );
  if (postId)
    return (
      <div className="flex w-full flex-row justify-between">
        <RejectPostReports postId={postId} />
      </div>
    );
  return null;
};
