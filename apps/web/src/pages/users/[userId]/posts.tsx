import React from "react";
import { LoggedLayout } from "../../../components/layout/LoggedLayout";
import { UserPostsList } from "../../../components/users/posts/UserPostsList";
import { useRouter } from "next/router";

const Posts = () => {
  const router = useRouter();
  const { userId } = router.query;

  const children =
    userId && typeof userId == "string" ? (
      <UserPostsList userId={userId as string} />
    ) : (
      <div>Please enter a valid userId</div>
    );

  return <LoggedLayout title="Post | Leace">{children}</LoggedLayout>;
};

export default Posts;
