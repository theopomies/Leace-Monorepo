import { trpc } from "../../utils/trpc";
import { TenantBar } from "./UserBar";

export interface TenantListProps {
  userId: string;
}

export const TenantList = ({ userId }: TenantListProps) => {
  const { data: relationships, status } =
    trpc.relationship.getMatchesForOwner.useQuery({ userId });
  const { data: user } = trpc.user.getUserById.useQuery({
    userId: userId ?? "",
  });

  return (
    <>
      {status == "success" && relationships.length ? (
        relationships.map(
          ({
            user: { id: otherUserId, image, description, firstName, lastName },
            post: { id: postId, title },
            id,
            conversation,
            relationType,
          }) => (
            <div key={id}>
              <TenantBar
                otherUserId={otherUserId}
                img={image ?? ""}
                desc={description ?? ""}
                firstname={firstName ?? ""}
                lastName={lastName ?? ""}
                relationType={relationType}
                userId={userId}
                postId={postId}
                title={title ?? ""}
                relationshipId={id}
                conversationId={conversation?.id}
                user={user}
              />
            </div>
          ),
        )
      ) : (
        <div className="mt-8 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-gray-700">
            No matches yet :(
          </h1>

          <div className="mt-4 flex flex-col items-center justify-center">
            <p className="text-gray-500">
              Go swipe to find your dream tenant !
            </p>
          </div>
        </div>
      )}
    </>
  );
};
