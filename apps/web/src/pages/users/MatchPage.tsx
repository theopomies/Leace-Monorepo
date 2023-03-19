import React from "react";
import Header from "../../components/Web/Header";
import { trpc } from "../../utils/trpc";
import { LoggedLayout } from "../../components/LoggedLayout";
import { Roles } from "@prisma/client";
import { TenantList } from "../../components/Web/TenantList";
import { PostList } from "../../components/Web/PostList";

const MatchPage = () => {
  const { data: session } = trpc.auth.getSession.useQuery();
  console.log(session?.role);
  return (
    <LoggedLayout title="Mes Matchs">
      <div className="w-full">
        <Header heading={"Mes Matchs"} />
        {session && session.role != Roles.TENANT ? (
          <TenantList />
        ) : (
          <PostList />
        )}
      </div>
    </LoggedLayout>
  );
};

export default MatchPage;
