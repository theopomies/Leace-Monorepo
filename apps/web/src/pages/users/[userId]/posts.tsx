import React from "react";
import { LoggedLayout } from "../../../components/layout/LoggedLayout";
import { UserPostsList } from "../../../components/users/posts/UserPostsList";
import { useRouter } from "next/router";

const Posts = () => {
  const router = useRouter();
  const { userId } = router.query;

  if (typeof userId != "string" || !userId) {
    return <div>Invalid userId</div>;
  }

  return (
    <LoggedLayout title="Post | Leace">
      <UserPostsList userId={userId as string} />
    </LoggedLayout>
  );
};

export default Posts;
