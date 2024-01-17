import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Attribute, Visit } from "@prisma/client";
import * as Popover from "@radix-ui/react-popover";
import { useState } from "react";
import Calendar from "react-calendar";
import { trpc } from "../../../utils/trpc";
import { Loader } from "../../shared/Loader";

export interface VisitsCalendarProps {
  userId: string;
}

export const VisitsCalendar = ({ userId }: VisitsCalendarProps) => {
  const { data: visits, isLoading: visitsLoading } =
    trpc.visit.getVisits.useQuery({ userId }, { enabled: true });

  const [open, setOpen] = useState<boolean>(false);
  const [selectedVisits, setSelectedVisits] = useState<
    (Visit & {
      post: {
        title: string | null;
        attribute: Attribute | null;
      };
      user: {
        firstName: string | null;
        lastName: string | null;
      };
    })[]
  >([]);

  const onClickDay = (value: Date) => {
    const clickedVisits = visits?.filter(
      (visit) =>
        visit.scheduledAt.getDate() === value.getDate() &&
        visit.scheduledAt.getMonth() === value.getMonth() &&
        visit.scheduledAt.getFullYear() === value.getFullYear() &&
        visit.accepted === true,
    );
    if (!clickedVisits || clickedVisits.length === 0) return;
    setSelectedVisits(clickedVisits);
    setOpen(true);
  };

  if (visitsLoading) {
    return (
      <div className="h-48">
        <Loader />
      </div>
    );
  }
  return (
    <>
      <Popover.Root open={open} onOpenChange={setOpen} modal={true}>
        <Popover.Trigger />
        <Popover.Portal>
          <Popover.Content className="rounded border bg-white p-4 pt-6">
            <div className="flex flex-col items-center justify-center divide-y divide-indigo-500">
              <p className="my-1 text-lg font-bold text-indigo-500">
                Visit(s) on{" "}
                {selectedVisits[0]?.scheduledAt?.toLocaleDateString()}
              </p>
              {selectedVisits.length > 0 &&
                selectedVisits.map((visit) => {
                  return (
                    <div className="my-1 flex flex-col" key={visit?.id}>
                      <p className="text-black">{visit?.post?.title}</p>
                      <p className="mb-2 text-sm text-black underline">
                        {visit?.post?.attribute?.location}
                      </p>

                      <p className="text-sm italic">
                        {visit?.scheduledAt?.toLocaleString()}
                        <br />
                        with{" "}
                        <span className="text-indigo-500">
                          {visit?.user?.firstName} {visit?.user?.lastName}
                        </span>
                      </p>
                    </div>
                  );
                })}
            </div>
            <Popover.Close className="absolute top-1 right-1 rounded border px-1 text-indigo-400">
              x
            </Popover.Close>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      <Calendar
        className="mt-4 h-full w-full items-center justify-center text-center"
        maxDetail="month"
        minDetail="month"
        tileClassName={({ date }) => {
          const tileClassName = "p-4 rounded";
          if (
            visits?.some(
              (visit) =>
                visit.scheduledAt.getDate() === date.getDate() &&
                visit.scheduledAt.getMonth() === date.getMonth() &&
                visit.scheduledAt.getFullYear() === date.getFullYear() &&
                visit.accepted === true,
            )
          ) {
            return `${tileClassName} bg-indigo-500 text-white`;
          }
          return `${tileClassName} bg-white text-indigo-500`;
        }}
        onClickDay={onClickDay}
        minDate={new Date()}
        prev2Label={null}
        next2Label={null}
        prevLabel={
          <FontAwesomeIcon icon={faChevronLeft} size="sm" className="mr-4" />
        }
        nextLabel={
          <FontAwesomeIcon icon={faChevronRight} size="sm" className="ml-4" />
        }
        formatShortWeekday={(locale, date) => {
          return date
            .toLocaleDateString(locale, { weekday: "short" })
            .slice(0, 2);
        }}
        navigationLabel={({ date, locale }) => (
          <p className="mb-4 text-indigo-500">
            {date.toLocaleDateString(locale, {
              month: "long",
            })}
          </p>
        )}
      />
    </>
  );
};
