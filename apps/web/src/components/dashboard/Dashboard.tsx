import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { RentedTable, ForRentTable } from "./PostTable";
import { trpc } from "../../utils/trpc";

const data = [
  {
    name: "Jan",
    total: 0,
  },
  {
    name: "Feb",
    total: 0,
  },
  {
    name: "Mar",
    total: 0,
  },
  {
    name: "Apr",
    total: 0,
  },
  {
    name: "May",
    total: 0,
  },
  {
    name: "Jun",
    total: 0,
  },
  {
    name: "Jul",
    total: 0,
  },
  {
    name: "Aug",
    total: 0,
  },
  {
    name: "Sep",
    total: 0,
  },
  {
    name: "Oct",
    total: 0,
  },
  {
    name: "Nov",
    total: 0,
  },
  {
    name: "Dec",
    total: 0,
  },
];

export interface DashboardProps {
  userId: string;
}

export function Dashboard({ userId }: DashboardProps) {
  const { data: metrics } = trpc.dashboard.metricsByUserId.useQuery({ userId });

  const { data: rented } = trpc.dashboard.getRented.useQuery({
    userId,
  });

  const { data: toRent } = trpc.dashboard.getPending.useQuery({ userId });

  return (
    <div className="flex w-full flex-col justify-center py-8 px-12">
      <h1 className="text-4xl font-semibold">Welcome !</h1>
      <div className="w-full pt-8">
        <div className="grid w-full grid-cols-4 gap-4">
          <div className="flex flex-grow flex-col gap-2 rounded-xl bg-white p-4 pl-1 pb-1 shadow-sm">
            <div className="p-3">
              <h3 className="text-xl font-medium">Revenue</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={metrics ? metrics.monthlyRevenues : data}>
                <XAxis
                  dataKey="month"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-grow flex-col gap-2 rounded-xl bg-white p-4 pl-1 pb-1  shadow-sm">
            <div className="p-3">
              <h3 className="text-xl font-medium">Likes</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={metrics ? metrics.monthlyLikes : data}>
                <XAxis
                  dataKey="month"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value / 100}`}
                />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-grow flex-col gap-2 rounded-xl bg-white p-4 pl-1 pb-1  shadow-sm">
            <div className="p-3">
              <h3 className="text-xl font-medium">Lease signed</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={metrics ? metrics.monthlyLeaseSigned : data}>
                <XAxis
                  dataKey="month"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${Math.floor(value / 1_000)}`}
                />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="rounded-xl bg-white p-4 shadow-sm ">
            <div className="p-3">
              <h3 className="text-xl font-medium">For Rent</h3>
            </div>
            {toRent ? <ForRentTable data={toRent} /> : <></>}
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="p-3">
              <h3 className="text-xl font-medium">Rented / Managed</h3>
            </div>
            {rented ? <RentedTable data={rented} /> : <></>}
          </div>
        </div>
      </div>
    </div>
  );
}
