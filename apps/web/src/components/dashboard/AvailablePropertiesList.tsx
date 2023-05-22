import { PostType } from "@prisma/client";
import { PostCard } from "../posts/card";
import Link from "next/link";
import { trpc } from "../../utils/trpc";

interface AvailablePropertiesListProps {
  userId: string;
}

export function AvailablePropertiesList({
  userId,
}: AvailablePropertiesListProps) {
  const availableProperties = trpc.post.getPostsByUserId.useQuery({
    userId,
    postType: PostType.TO_BE_RENTED,
  });

  return (
    <div className="container mx-auto p-4">
      <div className="left-0 right-0 top-0 mx-5 mb-20 mt-20 items-center justify-center">
        <div className="mb-20 items-center justify-center text-center text-3xl font-bold">
          Available Accommodation
        </div>
        {availableProperties.data && availableProperties.data.length > 0 ? (
          <div className="left-0 right-0 top-0 flex flex-row flex-wrap items-center justify-center">
            {availableProperties.data.map((item) => {
              return (
                <div key={item.id} className="mb-10">
                  <PostCard
                    title={item.title}
                    desc={item.desc}
                    content={item.content}
                    income={undefined}
                    expenses={undefined}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bottom-80 left-0 right-0 top-80 items-center justify-center">
            <div className="items-center justify-center text-center text-3xl font-bold">
              No property available at the moment
            </div>
          </div>
        )}
        <Link
          className="bottom-0 left-0 right-0 flex items-center justify-center rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          href={`/dashboard/main`}
        >
          Return
        </Link>
      </div>
    </div>
  );
}
