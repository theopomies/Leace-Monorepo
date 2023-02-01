import React from "react";
import Header from "../../components/Web/Header";
import { trpc } from "../../utils/trpc";
import { PostBar } from "../../components/Web/PostBar";
import { LoggedLayout } from "../../components/LoggedLayout";
import { PostType } from "@prisma/client";

const postPage = () => {
  const { data: post } = trpc.post.getMyPost.useQuery();

  return (
    <LoggedLayout title="Post | Leace">
      <div className="w-full">
        <Header heading={"Post"} />
        {post &&
          post.map((post) => (
            <PostBar
              key={post.id}
              postId={post.id}
              title={post.title ? post.title : ""}
              desc={post.desc ? post.desc : ""}
              type={post.type ? post.type : PostType.TO_BE_RENTED}
            />
          ))}
      </div>
    </LoggedLayout>
  );
};

export default postPage;
