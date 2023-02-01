import React from "react";
import Header from "../../components/Web/Header";
import { trpc } from "../../utils/trpc";
import { MatchBar } from "../../components/Web/MatchBar";
import { LoggedLayout } from "../../components/LoggedLayout";

const MatchPage = () => {
  const match = trpc.relationShip.getMatch.useQuery();

  return (
    <LoggedLayout title="Match">
      <div>
        <Header heading={"Mes Matchs"} />
        {match.data &&
          match.data.map((match) => <MatchBar key={match.id} match={match} />)}
      </div>
    </LoggedLayout>
  );
};

export default MatchPage;
