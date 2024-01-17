import { Role } from "@prisma/client";
import { useState } from "react";
import { trpc } from "../../../utils/trpc";
import { Button } from "../button/Button";
import { Popover } from "./contracts/Popover";

export interface VisitPopoverProps {
  conversationId: string;
  userId: string;
  postId: string;
  role: Role;
}

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export const VisitPopover = ({
  conversationId,
  userId,
  postId,
  role,
}: VisitPopoverProps) => {
  const { data: visit } = trpc.visit.getVisit.useQuery({
    userId,
    postId,
  });

  const createVisit = trpc.visit.createVisit.useMutation({
    onSuccess() {
      window.location.reload();
    },
  });

  const acceptVisit = trpc.visit.acceptVisit.useMutation({
    onSuccess() {
      window.location.reload();
    },
  });

  const declineVisit = trpc.visit.declineVisit.useMutation({
    onSuccess() {
      window.location.reload();
    },
  });

  const [dateTime, setDateTime] = useState<Value>(new Date());

  if (role === "OWNER" || role === "AGENCY") {
    if (!visit) {
      return (
        <Popover label="Schedule Visit">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createVisit.mutate({
                postId,
                userId,
                scheduledAt: dateTime as Date,
              });
            }}
            className="flex flex-col gap-4 rounded-md bg-white p-4 drop-shadow-2xl"
          >
            <div className="flex h-fit flex-col">
              <label htmlFor="date" className="mb-2 text-lg font-medium">
                Date and time of the visit
              </label>
              <input
                aria-label="Date and time"
                type="datetime-local"
                className="rounded-md border p-4"
                onChange={(e) => setDateTime(new Date(e.target.value))}
              />
            </div>
            <Button type="submit">Submit</Button>
          </form>
        </Popover>
      );
    }

    return (
      <div className="flex flex-col rounded-md bg-white p-2 drop-shadow">
        <p className="text-lg font-medium">
          {visit.accepted ? "Visit Accepted ✅: " : "Visit Pending: "}{" "}
          <span className="font-bold">
            {visit.scheduledAt.toLocaleString()}
          </span>
        </p>
      </div>
    );
  }

  if (role === "TENANT") {
    if (!visit) {
      return null;
    }

    if (!visit.accepted) {
      return (
        <Popover label="You received a visit request">
          <div className="flex flex-col items-center justify-center gap-4 rounded-md bg-white p-4 text-center drop-shadow-2xl">
            <p className="text-lg font-medium">
              Time of the visit:{" "}
              <span className="font-bold">
                {visit.scheduledAt.toLocaleString()}
              </span>
            </p>
            <p className="text-lg font-medium">Do you accept?</p>
            <div className="flex gap-4">
              <Button
                onClick={() =>
                  acceptVisit.mutate({ visitId: visit.id, conversationId })
                }
              >
                Accept
              </Button>
              <Button
                onClick={() =>
                  declineVisit.mutate({ visitId: visit.id, conversationId })
                }
              >
                Decline
              </Button>
            </div>
          </div>
        </Popover>
      );
    }

    return (
      <div className="flex flex-col rounded-md bg-white p-2 drop-shadow">
        <p className="text-lg font-medium ">
          Visit Accepted ✅ :{" "}
          <span className="font-bold">
            {visit.scheduledAt.toLocaleString()}
          </span>
        </p>
      </div>
    );
  }

  return null;
};
