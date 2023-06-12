import React from "react";
import { useRouter } from "next/router";
import { LoggedLayout } from "../../../../components/layout/LoggedLayout";
import { Role } from "@prisma/client";
import { MyPostsPage } from "../../../../components/posts/MyPostsPage";
import { getCacheData } from "../../../../utils/useCache";

const PostListView = () => {
  const router = useRouter();
  const { userId } = router.query;

  if (typeof userId != "string" || !userId) {
    return <div>Invalid userId</div>;
  }

  const cachedPostId = getCacheData("lastSelectedPostId");

  return (
    <LoggedLayout
      title="Profile Page | Leace"
      roles={[Role.AGENCY, Role.OWNER]}
    >
      <MyPostsPage userId={userId} postId={cachedPostId} />
    </LoggedLayout>
  );
};

export default PostListView;
