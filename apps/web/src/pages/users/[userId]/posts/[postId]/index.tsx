import React from "react";
import { useRouter } from "next/router";
import { LoggedLayout } from "../../../../../components/layout/LoggedLayout";
import { MyPostsPage } from "../../../../../components/posts/MyPostsPage";
import { Role } from "@prisma/client";

const MyPostsView = () => {
  const router = useRouter();
  const { userId, postId } = router.query;

  if (!userId || typeof userId !== "string") {
    return <div>Invalid userId</div>;
  }

  if (typeof postId != "string" || !postId) {
    return <div>Invalid postId</div>;
  }

  return (
    <LoggedLayout title="Post | Leace" roles={[Role.OWNER, Role.AGENCY]}>
      <MyPostsPage userId={userId} postId={postId} />
    </LoggedLayout>
  );
};

export default MyPostsView;
