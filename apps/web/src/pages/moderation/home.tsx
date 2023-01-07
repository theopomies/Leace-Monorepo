import { useRouter } from "next/router";
import React from "react";
import Loader from "../../components/loader";
import Profile from "../../components/profile";
import ReportButton from "../../components/reportButton";
import { trpc } from "../../utils/trpc";

const Home = () => {
  const { query } = useRouter();

  const getReported = query.uid
    ? trpc.moderation.getById.useQuery(query.uid.toString())
    : trpc.moderation.getReportedUser.useQuery();

  return !getReported.isLoading ? (
    getReported.data ? (
      <div className="flex h-full">
        <div className="flex w-1/5 items-center justify-center"></div>
        <div className="flex w-3/5 items-center justify-center">
          <Profile user={getReported.data} />
        </div>
        <ReportButton user={getReported.data} />
      </div>
    ) : (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Aucun utilisateur signalé</p>
      </div>
    )
  ) : (
    <Loader />
  );
};

export default Home;
