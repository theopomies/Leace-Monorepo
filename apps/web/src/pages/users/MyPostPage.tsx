import React from "react";
import Header from "../../components/Web/Header";
import { trpc } from "../../utils/trpc";
import { PostBar } from "../../components/Web/PostBar";
import LoggedLayout from "../../components/LoggedLayout";

const postPage = () => {
  const post = trpc.post.getMyPost.useQuery();

  return (
    <div className="h-full bg-slate-100">
      <LoggedLayout>
        <div>
          <Header heading={"Annonce"} />
          {post.data &&
            post.data.map((post) => <PostBar key={post.id} post={post} />)}
        </div>
      </LoggedLayout>
    </div>
  );
};

export default postPage;
