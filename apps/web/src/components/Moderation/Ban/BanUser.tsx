import { RouterInputs, trpc } from "../../../utils/trpc";
import { BanModal } from "./BanModal";

export interface BanUserProps {
  userId: string;
}

export const BanUser = ({ userId }: BanUserProps) => {
  const utils = trpc.useContext();
  const mutation = trpc.moderation.createBan.useMutation({
    onSuccess() {
      utils.moderation.getReport.invalidate();
      utils.moderation.getUser.invalidate();
      utils.moderation.getBan.invalidate();
    },
  });
  const { data: reports } = trpc.moderation.getReportsByUserId.useQuery({
    userId,
  });

  const OnBan = (banData: RouterInputs["moderation"]["createBan"]) => {
    mutation.mutate(banData);
  };

  if (!reports) {
    return null;
  }
  return <BanModal userId={userId} reports={reports} onBan={OnBan} />;
};
