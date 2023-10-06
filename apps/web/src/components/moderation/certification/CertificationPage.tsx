import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import { Loader } from "../../shared/Loader";

export const CertificationPage = () => {
  const router = useRouter();
  const { data: uncertifiedPost, isLoading: uncertifiedPostIsLoading } =
    trpc.moderation.post.getUncertifiedPosts.useQuery(undefined, {
      retry: false,
      onSuccess: (uncertifiedPost) => {
        if (uncertifiedPost) {
          if (uncertifiedPost.id) {
            router.push(`/certification/posts/${uncertifiedPost.id}`);
          }
        }
      },
    });

  if (!uncertifiedPostIsLoading && !uncertifiedPost) {
    return (
      <div className="flex w-full items-center justify-center">
        <p>No post need to be certified</p>
      </div>
    );
  }

  return <Loader />;
};
