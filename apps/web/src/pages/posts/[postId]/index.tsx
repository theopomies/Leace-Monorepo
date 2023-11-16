import React from "react";
import { useRouter } from "next/router";
import { LoggedLayout } from "../../../components/layout/LoggedLayout";
import { Post } from "../../../components/posts/Post";
import { Role } from "@prisma/client";

const Index = () => {
  const router = useRouter();
  const { postId } = router.query;

  if (typeof postId != "string" || !postId) {
    return <div>Invalid postId</div>;
  }

  return (
    <LoggedLayout title="Post | Leace" roles={[Role.AGENCY, Role.OWNER]}>
      <div className="flex flex-grow overflow-hidden p-10">
        <Post postId={postId} />
      </div>
    </LoggedLayout>
  );
};

export default Index;
