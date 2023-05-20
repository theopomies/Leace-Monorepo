import Link from "next/link";
import { trpc } from "../../utils/trpc";
import { TenantBar } from "../users/UserBar";

export interface TenantListProps {
  userId: string;
}

export const OccupiedClientList = ({ userId }: TenantListProps) => {
  const { data: relationships } = trpc.relationship.getLikesForOwner.useQuery({
    userId,
  });
  //   console.log(relationships);
  if (relationships && relationships?.rs) {
    return (
      <>
        {relationships?.rs.map(
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
              />
            </div>
          ),
        )}
      </>
    );
  } else {
    return (
      <div className="container mx-auto p-4">
        <div className="bottom-80 left-0 right-0 top-80 items-center justify-center">
          <div className="items-center justify-center text-center text-3xl font-bold">
            No client has liked your post yet!
          </div>
        </div>
        <Link
          className="bottom-0 left-0 right-0 flex items-center justify-center rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          href={`/dashboard/main`}
        >
          Return
        </Link>
      </div>
    );
  }
};
