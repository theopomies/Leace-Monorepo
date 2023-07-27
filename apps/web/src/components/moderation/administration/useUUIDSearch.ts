import { useEffect, useMemo, useState } from "react";
import { RouterOutputs, trpc } from "../../../utils/trpc";

type UseUUIDSearchReturnType = {
  type: "user" | "post" | "none";
  userList?: RouterOutputs["moderation"]["user"]["searchUsers"];
  uuid: string;
  setUUID: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
};

export function useUUIDSearch(): UseUUIDSearchReturnType {
  const [uuid, setUUID] = useState<string>("");
  const [userList, setUserList] =
    useState<RouterOutputs["moderation"]["user"]["searchUsers"]>();

  const {
    data: usersSearched,
    status,
    refetch,
    isLoading: searchUsersIsLoading,
  } = trpc.moderation.user.searchUsers.useQuery(
    { name: uuid },
    { retry: false, enabled: false },
  );

  const { data: user, isLoading: userIsLoading } =
    trpc.moderation.user.getUserById.useQuery(uuid, {
      retry: false,
      enabled:
        uuid !== "" &&
        !searchUsersIsLoading &&
        usersSearched &&
        usersSearched.length === 0,
    });

  const { data: post, isLoading: postIsLoading } =
    trpc.moderation.post.getPostById.useQuery(uuid, {
      retry: false,
      enabled:
        uuid !== "" &&
        !searchUsersIsLoading &&
        usersSearched &&
        usersSearched.length === 0,
    });

  const isLoading = useMemo(
    () => uuid !== "" && (userIsLoading || postIsLoading),
    [uuid, userIsLoading, postIsLoading],
  );

  useEffect(() => {
    if (status === "success") {
      setUserList(usersSearched);
    }
    const timeout = setTimeout(() => {
      if (status === "loading") {
        refetch();
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [uuid, usersSearched, refetch, status]);

  if (!searchUsersIsLoading && userList && userList.length > 0) {
    return {
      type: "none",
      userList,
      uuid,
      setUUID,
      isLoading: searchUsersIsLoading,
    };
  }

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
      uuid,
      setUUID,
      isLoading,
    };
  }

  if (post) {
    return {
      type: "post",
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
