import { trpc } from "../../../utils/trpc";
import { BanUser } from "./BanUser";
import { UnBan } from "./UnBan";

export interface BanUnBanProps {
  userId: string;
}

export const BanUnBan = ({ userId }: BanUnBanProps) => {
  const { data: ban } = trpc.moderation.getBan.useQuery({ userId });

  if (ban) return <UnBan userId={userId} />;
  return <BanUser userId={userId} />;
};
