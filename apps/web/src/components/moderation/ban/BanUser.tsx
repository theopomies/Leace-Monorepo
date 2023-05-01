import { RouterInputs, trpc } from "../../../utils/trpc";
import { BanModal } from "./BanModal";

export interface BanUserProps {
  userId: string;
}

export const BanUser = ({ userId }: BanUserProps) => {
  const utils = trpc.useContext();
  const mutation = trpc.moderation.ban.createBan.useMutation({
    onSuccess() {
      utils.moderation.report.getReport.invalidate();
      utils.moderation.user.getUser.invalidate();
      utils.moderation.ban.getIsBan.invalidate();
    },
  });
  const { data: reports } = trpc.moderation.report.getReportsByUserId.useQuery({
    userId,
  });

  const OnBan = (banData: RouterInputs["moderation"]["ban"]["createBan"]) => {
    mutation.mutate(banData);
  };

  if (!reports) {
    return null;
  }
  return <BanModal userId={userId} reports={reports} onBan={OnBan} />;
};
