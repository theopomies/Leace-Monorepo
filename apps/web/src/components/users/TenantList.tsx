import { trpc } from "../../utils/trpc";
import { TenantBar } from "./UserBar";

export interface TenantListProps {
  userId: string;
}

export const TenantList = ({ userId }: TenantListProps) => {
  const { data: relationships } = trpc.relationship.getMatchesForOwner.useQuery(
    { userId },
  );
  if (relationships) {
    return (
      <>
        {relationships.map(
          ({ user: { image, description, firstName, lastName }, id }) => {
            <TenantBar
              img={image ?? ""}
              desc={description ?? ""}
              firstname={firstName ?? ""}
              lastName={lastName ?? ""}
              userId={userId}
              relationShipId={id}
            />;
          },
        )}
      </>
    );
  }
  return <></>;
};
