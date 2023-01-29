import { useState } from "react";
import { Stack } from "../../components/Stack/Stack";
import { StackElementProps } from "../../components/Stack/StackElement";
import LoggedLayout from "../../components/LoggedLayout";

const defaultPosts: StackElementProps[] = [];

for (let i = 0; i < 10; i++) {
  defaultPosts.push({
    id: "" + i,
    img: "/sample_image.avif",
    title: "Candidat " + i,
    age: 22,
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Reiciendis doloremque blanditiis modi quos a eveniet, eligendi temporibus necessitatibus, eius consequatur, provident obcaecati reprehenderit possimus aliquam totam? Praesentium inventore facilis vero.",
    onReport: () => console.log("Reported"),
  });
}

export default function Candidats() {
  const [posts, setPosts] = useState(defaultPosts);
  const [lastPost, setLastPost] = useState<StackElementProps | null>(null);

  const removePost = (post: StackElementProps) => {
    setPosts((posts) => {
      const newPosts = posts.filter((p) => p.id !== post.id);
      newPosts.push({
        id: "" + (+(newPosts[newPosts.length - 1]?.id || "0") + 1),
        img: "/sample_image.avif",
        title: "Candidat " + (+(newPosts[newPosts.length - 1]?.id || "0") + 1),
        age: 22,
        description:
          "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Reiciendis doloremque blanditiis modi quos a eveniet, eligendi temporibus necessitatibus, eius consequatur, provident obcaecati reprehenderit possimus aliquam totam? Praesentium inventore facilis vero.",
        onReport: () => console.log("Reported"),
      });
      return newPosts;
    });
  };

  const onLike = (post: StackElementProps) => {
    console.log("Liked post " + post.id);
    removePost(post);
  };

  const onDislike = (post: StackElementProps) => {
    console.log("Disliked post " + post.id);
    removePost(post);
    setLastPost(post);
  };

  const onRewind = () => {
    if (lastPost) {
      setPosts((posts) => [lastPost, ...posts]);
      setLastPost(null);
    }
  };

  return (
    <LoggedLayout>
      <div className="flex w-full items-center justify-center">
        <Stack
          posts={posts}
          onDislike={onDislike}
          onLike={onLike}
          onRewind={onRewind}
        />
      </div>
    </LoggedLayout>
  );
}
