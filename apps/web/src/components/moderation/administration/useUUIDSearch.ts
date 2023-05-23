import { useMemo, useState } from "react";
import { trpc } from "../../../utils/trpc";

type UseUUIDSearchReturnType =
  | {
      type: "user";
      user: ReturnType<
        typeof trpc.moderation.user.getUserById.useQuery
      >["data"];
      uuid: string;
      setUUID: React.Dispatch<React.SetStateAction<string>>;
      isLoading: boolean;
    }
  | {
      type: "post";
      post: ReturnType<
        typeof trpc.moderation.post.getPostById.useQuery
      >["data"];
      uuid: string;
      setUUID: React.Dispatch<React.SetStateAction<string>>;
      isLoading: boolean;
    }
  | {
      type: "none";
      uuid: string;
      setUUID: React.Dispatch<React.SetStateAction<string>>;
      isLoading: boolean;
    };

export function useUUIDSearch(): UseUUIDSearchReturnType {
  const [uuid, setUUID] = useState<string>("");

  const { data: user, isLoading: userIsLoading } =
    trpc.moderation.user.getUserById.useQuery(uuid, {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
    });

  const { data: post, isLoading: postIsLoading } =
    trpc.moderation.post.getPostById.useQuery(uuid, {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
    });

  const isLoading = useMemo(
    () => userIsLoading || postIsLoading,
    [userIsLoading, postIsLoading],
  );

  if (isLoading) {
    return {
      type: "none",
      uuid,
      setUUID,
      isLoading,
    };
  }

  if (user) {
    return {
      type: "user",
      user,
      uuid,
      setUUID,
      isLoading,
    };
  }

  if (post) {
    return {
      type: "post",
      post,
      uuid,
      setUUID,
      isLoading,
    };
  }

  return {
    type: "none",
    uuid,
    setUUID,
    isLoading,
  };
}
