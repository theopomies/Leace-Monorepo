import React from "react";
import { useRouter } from "next/router";
import { LoggedLayout } from "../../../components/layout/LoggedLayout";
import { PostPage } from "../../../components/posts/PostPage";

const Index = () => {
  const router = useRouter();
  const { postId } = router.query;

  const children =
    postId && typeof postId == "string" ? (
      <PostPage postId={postId} />
    ) : (
      <div>Please enter a valid postId</div>
    );

  return <LoggedLayout title="Post | Leace">{children}</LoggedLayout>;
};

export default Index;
