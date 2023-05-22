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

  if (!relationships) return <></>;

  return (
    <>
      {relationships.map(
        ({
          user: { id: otherUserId, image, description, firstName, lastName },
          post: { id: postId, title },
          id,
          isMatch,
          conversation,
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
              postId={postId}
              title={title ?? ""}
              relationshipId={id}
              conversationId={conversation?.id}
              user={user}
            />
          </div>
        ),
      )}
    </>
  );
};
