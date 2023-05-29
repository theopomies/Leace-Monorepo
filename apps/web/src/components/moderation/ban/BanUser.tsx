import { useRouter } from "next/router";
import { RouterInputs, trpc } from "../../../utils/trpc";
import { BanModal } from "./BanModal";

export interface BanUserProps {
  userId: string;
}

export const BanUser = ({ userId }: BanUserProps) => {
  const router = useRouter();
  const utils = trpc.useContext();
  const banUser = trpc.moderation.ban.createBan.useMutation({
    onSuccess() {
      if (router.pathname.includes("/moderation")) {
        router.push("/moderation/reports");
      }
      utils.moderation.user.getUser.invalidate();
      utils.moderation.ban.getIsBan.invalidate();
    },
  });
  const { data: reports } = trpc.moderation.report.getReportsByUserId.useQuery({
    userId,
  });

  const OnBan = (banData: RouterInputs["moderation"]["ban"]["createBan"]) => {
    banUser.mutateAsync(banData);
  };

  if (!reports) {
    return null;
  }
  return <BanModal userId={userId} reports={reports} onBan={OnBan} />;
};
