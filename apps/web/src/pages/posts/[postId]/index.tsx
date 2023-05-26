import React from "react";
import { useRouter } from "next/router";
import { LoggedLayout } from "../../../components/layout/LoggedLayout";
import { PostPage } from "../../../components/posts/PostPage";

const Index = () => {
  const router = useRouter();
  const { postId } = router.query;

  if (typeof postId != "string" || !postId) {
    return <div>Invalid postId</div>;
  }

  return (
    <LoggedLayout title="Post | Leace">
      <PostPage postId={postId} />
    </LoggedLayout>
  );
};

export default Index;
