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
  const { data: user } = trpc.user.getUserById.useQuery({
    userId: userId ?? "",
  });

  if (relationships && relationships.rs) {
    return (
      <div className="container mx-auto p-4">
        <>
          {relationships.rs.map(
            ({
              user: {
                id: otherUserId,
                image,
                description,
                firstName,
                lastName,
              },
              post: { id: postId, title },
              id,
              isMatch,
            }) => (
              <div key={id}>
                <TenantBar
                  otherUserId={otherUserId}
                  img={image ?? ""}
                  desc={description ?? ""}
                  firstname={firstName ?? ""}
                  lastName={lastName ?? ""}
                  isMatch={isMatch ?? false}
                  userId={userId}
                  relationshipId={id}
                  postId={postId}
                  title={title ?? ""}
                  user={user}
                />
              </div>
            ),
          )}
        </>
      </div>
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
