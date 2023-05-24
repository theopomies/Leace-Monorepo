import { RouterOutputs, trpc } from "../../../../utils/trpc";
import { Button } from "../../button/Button";
import { ContractPopover } from "./ContractPopover";

export function TenantContractPopover({
  relationship,
}: {
  relationship?: RouterOutputs["relationship"]["getMatchesForTenant"][number];
}) {
  const utils = trpc.useContext();
  const signLease = trpc.lease.signLeaseById.useMutation({
    onSuccess() {
      utils.relationship.getMatchesForTenant.invalidate();
    },
  });

  if (
    !relationship ||
    relationship.lease === null ||
    relationship.lease?.isSigned
  ) {
    return null;
  }

  const lease = relationship.lease;

  return (
    <ContractPopover label="View Lease Proposal">
      <div className="flex flex-col gap-8 rounded-md bg-white p-4 drop-shadow-2xl">
        <div className="flex gap-16">
          <div>
            <p className="text-lg font-medium">Rent Cost</p>
            <p>{lease.rentCost} $</p>
          </div>
          <div className="flex flex-grow flex-col">
            <p className="text-lg font-medium">Utilities Cost</p>
            <p>{lease.utilitiesCost} $</p>
          </div>
        </div>
        <div className="flex justify-around gap-16">
          <div className="flex flex-grow flex-col">
            <p className="text-lg font-medium">Start Date</p>
            <p>{lease.startDate.toISOString().substring(0, 10)}</p>
          </div>
          <div className="flex flex-grow flex-col">
            <p className="text-lg font-medium">End Date</p>
            <p>{lease.endDate.toISOString().substring(0, 10)}</p>
          </div>
        </div>
        <div className="flex justify-center">
          <Button
            className="flex-grow"
            onClick={() => signLease.mutateAsync({ leaseId: lease.id })}
          >
            Sign Lease
          </Button>
        </div>
      </div>
    </ContractPopover>
  );
}
