import { User } from "@leace/db";
import { Attribute } from "@prisma/client";
import Link from "next/link";

export interface DashboardListProps {
  user:
    | (User & {
        attribute: Attribute | null;
      })
    | undefined;
}

export function Dashboard({ user }: DashboardListProps) {
  return (
    <div>
      <div className="flex h-screen justify-center">
        <div className="flex flex-wrap justify-center">
          <div className="m-4 h-64 w-64 rounded-lg bg-gray-200 p-4">
            <Link
              className="w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
              href={`/dashboard/expenses`}
            >
              Expenses
            </Link>
          </div>
          <div className="m-4 h-64 w-64 rounded-lg bg-gray-200 p-4">
            <Link
              className="w-full rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
              href={`/dashboard/income`}
            >
              Income
            </Link>
          </div>
          <div className="m-4 h-64 w-64 rounded-lg bg-gray-200 p-4">
            <Link
              className="w-full rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
              href={`/dashboard/available`}
            >
              Available
            </Link>
          </div>
          <div className="m-4 h-64 w-64 rounded-lg bg-gray-200 p-4">
            <Link
              className="w-full rounded bg-yellow-500 px-4 py-2 font-bold text-white hover:bg-yellow-700"
              href={`/dashboard/occupied`}
            >
              Occupied
            </Link>
          </div>
          {user?.isPremium == true && (
            <div className="m-4 h-64 w-64 rounded-lg bg-gray-200 p-4">
              <Link
                className="w-full rounded bg-purple-500 px-4 py-2 font-bold text-white hover:bg-purple-700"
                href={`/dashboard/potential-matches`}
              >
                Potential matches
              </Link>
            </div>
          )}
          <div className="m-4 h-64 w-64 rounded-lg bg-gray-200 p-4">
            <Link
              className="w-full rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-700"
              href={`/chat/all`}
            >
              Chat
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
