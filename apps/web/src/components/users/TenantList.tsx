import { trpc } from "../../utils/trpc";
import { TenantBar } from "./UserBar";

export interface TenantListProps {
  userId: string;
}

export const TenantList = ({ userId }: TenantListProps) => {
  const { data: relationships } = trpc.relationship.getMatchesForOwner.useQuery(
    { userId },
  );
  const { data: user } = trpc.user.getUserById.useQuery({
    userId: userId ?? "",
  });
  if (relationships) {
    return (
      <>
        {relationships.map(
          ({
            user: {
              id: other_user_id,
              image,
              description,
              firstName,
              lastName,
            },
            id,
          }) => (
            <div key={id}>
              <TenantBar
                other_user_id={other_user_id}
                img={image ?? ""}
                desc={description ?? ""}
                firstname={firstName ?? ""}
                lastName={lastName ?? ""}
                userId={userId}
                relationShipId={id}
                user={user}
              />
            </div>
          ),
        )}
      </>
    );
  }
  return <></>;
};
