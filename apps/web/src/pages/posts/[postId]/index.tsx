import React from "react";
import { useRouter } from "next/router";
import { LoggedLayout } from "../../../components/layout/LoggedLayout";
import { Post } from "../../../components/posts/Post";

const Index = () => {
  const router = useRouter();
  const { postId } = router.query;

  if (typeof postId != "string" || !postId) {
    return <div>Invalid postId</div>;
  }

  return (
    <LoggedLayout title="Post | Leace">
      <div className="m-auto py-5">
        <Post postId={postId} />
      </div>
    </LoggedLayout>
  );
};

export default Index;
