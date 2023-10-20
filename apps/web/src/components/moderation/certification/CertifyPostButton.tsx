import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import { Button } from "../../shared/button/Button";

export interface CertifyPostButtonProps {
  postId: string;
}

export const CertifyPostButtons = ({ postId }: CertifyPostButtonProps) => {
  const router = useRouter();
  const certifyPost = trpc.moderation.post.certifyPost.useMutation({
    onSuccess() {
      router.push("/certification");
    },
  });

  const handleClick = async () => {
    await certifyPost.mutateAsync({ postId });
  };

  return (
    <div className="flex w-full items-center justify-center">
      <Button onClick={handleClick}>Certify Post</Button>
    </div>
  );
};
