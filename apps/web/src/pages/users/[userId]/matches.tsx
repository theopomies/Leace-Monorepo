import React from "react";
import { Header } from "../../../components/users/Header";
import { trpc } from "../../../utils/trpc";
import { LoggedLayout } from "../../../components/shared/layout/LoggedLayout";
import { Role } from "@prisma/client";
import { TenantList } from "../../../components/users/TenantList";
import { PostList } from "../../../components/users/PostList";

const Matches = () => {
  const { data: session } = trpc.auth.getSession.useQuery();

  return (
    <LoggedLayout title="Mes Matchs">
      <div className="w-full">
        <Header heading={"Mes Matchs"} />
        {session && session.role != Role.TENANT ? (
          <TenantList userId={session.userId} />
        ) : session ? (
          <PostList userId={session.userId} />
        ) : null}
      </div>
    </LoggedLayout>
  );
};

export default Matches;
