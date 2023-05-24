import { RouterOutputs, trpc } from "../../../../utils/trpc";
import { Popover } from "./Popover";
import { LeaseForm } from "./LeaseForm";

export function OwnerContractPopover({
  relationship,
}: {
  relationship?: RouterOutputs["relationship"]["getMatchesForOwner"][number];
}) {
  const utils = trpc.useContext();
  const createLease = trpc.lease.createLease.useMutation({
    onSuccess() {
      utils.relationship.getMatchesForOwner.invalidate();
    },
  });
  const updateLease = trpc.lease.updateLeaseById.useMutation({
    onSuccess() {
      utils.relationship.getMatchesForOwner.invalidate();
    },
  });
  const deleteLease = trpc.lease.deleteLeaseById.useMutation({
    onSuccess() {
      utils.relationship.getMatchesForOwner.invalidate();
    },
  });

  if (!relationship) {
    return null;
  }

  if (relationship.lease?.isSigned) {
    return (
      <div>
        <p className="text-lg font-medium">Lease Signed ✅</p>
      </div>
    );
  }

  if (relationship.lease === null) {
    return (
      <Popover label="Create Lease Proposal">
        <LeaseForm
          submitLabel="Create"
          onSubmit={(data) => {
            createLease.mutate({
              relationshipId: relationship.id,
              ...data,
            });
          }}
        />
      </Popover>
    );
  }

  const leaseId = relationship.lease.id;

  return (
    <Popover label="Update Lease Proposal">
      <LeaseForm
        submitLabel="Update"
        defaultValues={relationship.lease}
        onSubmit={(data) => {
          updateLease.mutate({
            leaseId,
            ...data,
          });
        }}
        onDeleted={() => {
          deleteLease.mutate({ leaseId });
        }}
      />
    </Popover>
  );
}
