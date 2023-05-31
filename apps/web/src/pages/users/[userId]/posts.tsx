import React from "react";
import { LoggedLayout } from "../../../components/layout/LoggedLayout";
import { UserPostList } from "../../../components/users/UserPostList";
import { useRouter } from "next/router";

const Posts = () => {
  const router = useRouter();
  const { userId } = router.query;

  if (typeof userId != "string" || !userId) {
    return <div>Invalid userId</div>;
  }

  return (
    <LoggedLayout title="Post | Leace">
      <UserPostList userId={userId as string} />
    </LoggedLayout>
  );
};

export default Posts;
