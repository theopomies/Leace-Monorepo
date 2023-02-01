/* eslint-disable @next/next/no-img-element */
import { trpc } from "../../utils/trpc";
import { TenantBar } from "./UserBar";

export const TenantList = () => {
  const { data: relationships } = trpc.relationship.getMatch.useQuery();
  if (relationships) {
    return (
      <>
        {relationships.map(
          ({ user: { image, description, firstName, lastName } }) => {
            <TenantBar
              img={image ?? ""}
              desc={description ?? ""}
              firstname={firstName ?? ""}
              lastName={lastName ?? ""}
            />;
          },
        )}
      </>
    );
  }
  return <></>;
};
