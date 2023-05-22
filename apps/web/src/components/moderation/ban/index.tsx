import { trpc } from "../../../utils/trpc";
import { BanUser } from "./BanUser";
import { UnBan } from "./UnBan";

export interface BanProps {
  userId: string;
}

export const Ban = ({ userId }: BanProps) => {
  const { data: isBan } = trpc.moderation.ban.getIsBan.useQuery({ userId });

  if (isBan) return <UnBan userId={userId} />;
  return <BanUser userId={userId} />;
};
