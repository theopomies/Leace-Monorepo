import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import { Button } from "../../shared/button/Button";

export interface CertifyPostButtonProps {
  postId: string;
  isCertified?: boolean;
}

export const CertifyPostButtons = ({
  postId,
  isCertified,
}: CertifyPostButtonProps) => {
  const router = useRouter();
  const utils = trpc.useContext();
  const certifyPost = trpc.moderation.post.certifyPost.useMutation({
    onSuccess() {
      if (router.pathname.includes("/certification")) {
        router.push("/certification");
      }
      utils.moderation.post.getPostById.invalidate();
      utils.moderation.post.getPost.invalidate();
    },
  });

  const handleClick = async () => {
    await certifyPost.mutateAsync({ postId, certify: !isCertified });
  };

  return (
    <div className="flex w-full items-center justify-center">
      <Button onClick={handleClick} theme={isCertified ? "danger" : "success"}>
        {isCertified ? "Decertify" : "Certify"} Post
      </Button>
    </div>
  );
};
