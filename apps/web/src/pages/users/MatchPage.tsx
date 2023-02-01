import React from "react";
import Header from "../../components/Web/Header";
import { trpc } from "../../utils/trpc";
import { MatchBar } from "../../components/Web/MatchBar";
import { LoggedLayout } from "../../components/LoggedLayout";

const MatchPage = () => {
  const match = trpc.relationShip.getMatch.useQuery();

  return (
    <div className="h-full bg-slate-100">
      <LoggedLayout>
        <div>
          <Header heading={"Mes Matchs"} />
          {match.data &&
            match.data.map((match) => (
              <MatchBar key={match.id} match={match} />
            ))}
        </div>
      </LoggedLayout>
    </div>
  );
};

export default MatchPage;
