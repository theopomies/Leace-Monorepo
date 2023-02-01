import React from "react";
import Header from "../../components/Web/Header";
import DisplayProperty from "../../components/Web/DisplayProperty";
import { Post, Attribute } from "@prisma/client";
import { useRouter } from "next/router";

const PostPage = () => {
  const router = useRouter();
  const [post, setPost] = React.useState<
    Post & { attribute: Attribute | null }
  >();
  const [done, setDone] = React.useState(false);

  const getInitialProps = async () => {
    const { query } = router;
    console.log(query.post);
    const post = JSON.parse(query.post as string) as Post & {
      attribute: Attribute | null;
    };
    return { post };
  };

  if (!done) {
    getInitialProps().then((res) => {
      setPost(res.post);
      setDone(true);
    });
  }

  return (
    <div className="h-full bg-slate-100">
      {post && post.attribute && (
        <DisplayProperty post={post} attribute={post.attribute} />
      )}
    </div>
  );
};

export default PostPage;
