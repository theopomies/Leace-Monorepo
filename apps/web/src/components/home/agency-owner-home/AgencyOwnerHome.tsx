import Link from "next/link";
import { useMemo } from "react";
import { trpc } from "../../../utils/trpc";
import { Loader } from "../../shared/Loader";
import { TenantList } from "../stack/TenantList";
import { VisitsCalendar } from "./VisitsCalendar";

export interface AgencyOwnerHomeProps {
  userId: string;
}

export const AgencyOwnerHome = ({ userId }: AgencyOwnerHomeProps) => {
  const { data: me } = trpc.user.getUserById.useQuery(
    { userId: userId },
    { enabled: !!userId, retry: false },
  );

  const { data: relationships, isLoading: relationshipsLoading } =
    trpc.relationship.getMatchesForOwner.useQuery({ userId });

  const { data: supportRelationships, isLoading: supportRelationshipsLoading } =
    trpc.support.getRelationshipsForOwner.useQuery({ userId });

  const { data: leases, isLoading: leasesLoading } =
    trpc.lease.getLeasesByUserId.useQuery({ userId });

  const { data: posts, isLoading: postsLoading } =
    trpc.post.getPostsByUserId.useQuery({ userId });

  const { data: totalUnreadMessages, isLoading: totalUnreadMessagesLoading } =
    trpc.conversation.totalUnreads.useQuery({ userId });

  const signedLeases = useMemo(
    () => leases?.filter((lease) => lease.isSigned),
    [leases],
  );

  const isLoadingRelationships = useMemo(
    () => relationshipsLoading || supportRelationshipsLoading,
    [relationshipsLoading, supportRelationshipsLoading],
  );

  const totalRelationships = useMemo(
    () => (relationships?.length ?? 0) + (supportRelationships?.length ?? 0),

    [relationships, supportRelationships],
  );

  return (
    <div className="mt-10 flex w-full font-light">
      <div className="flex h-full w-1/3 flex-col items-center gap-y-10 p-16">
        <div className="flex h-28 w-full">
          <h1 className="text-left text-2xl">
            Welcome,
            <br />
            <span className="text-4xl text-indigo-500">{me?.firstName}</span>
          </h1>
        </div>
        <div className="flex w-full justify-between gap-x-4">
          <div className="flex h-40 w-full flex-col items-center justify-center rounded-md bg-white p-4 text-center duration-500 hover:shadow-md hover:shadow-indigo-300 hover:duration-500">
            {postsLoading ? (
              <Loader />
            ) : (
              <p className="text-lg">
                <span className="text-4xl font-bold text-indigo-500">
                  {posts?.filter((post) => post.type === "TO_BE_RENTED")
                    .length ?? 0}
                </span>
                <br />
                Active posts
              </p>
            )}
          </div>
          <div className="flex h-40 w-full flex-col items-center justify-center rounded-md bg-white p-4 text-center duration-500 hover:shadow-md hover:shadow-indigo-300 hover:duration-500">
            {leasesLoading ? (
              <Loader />
            ) : (
              <p className="text-lg">
                <span className="text-4xl font-bold text-indigo-500">
                  {signedLeases?.length ?? 0}
                </span>
                <br />
                Signed leases
              </p>
            )}
          </div>
          <div className="flex h-40 w-full flex-col items-center justify-center rounded-md bg-white p-4 text-center duration-500 hover:shadow-md hover:shadow-indigo-300 hover:duration-500">
            {isLoadingRelationships ? (
              <Loader />
            ) : (
              <p className="text-lg">
                <span className="text-4xl font-bold text-indigo-500">
                  {totalRelationships}
                </span>
                <br />
                Ongoing chats
              </p>
            )}
          </div>
        </div>
        <Link
          className={`flex h-16 w-full flex-col items-center justify-center rounded-md ${
            totalUnreadMessages ?? 0 > 0 ? "border-2 border-indigo-500" : ""
          } bg-white duration-500 hover:shadow-md hover:shadow-indigo-300 hover:duration-500`}
          href={`/users/${userId}/matches`}
        >
          {totalUnreadMessagesLoading ? (
            <Loader />
          ) : totalUnreadMessages ?? 0 > 0 ? (
            <p>
              Vous avez{" "}
              <span className="text-indigo-500">{totalUnreadMessages}</span>{" "}
              nouveaux messages
            </p>
          ) : (
            <p>Vous n&apos;avez aucun nouveau message</p>
          )}
        </Link>

        <div className="flex w-full flex-col rounded-md bg-white p-4 duration-500 hover:shadow-md hover:shadow-indigo-300 hover:duration-500">
          <p>Upcoming visits :</p>
          <VisitsCalendar userId={userId} />
        </div>
      </div>
      <TenantList userId={userId} />
    </div>
  );
};
