import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { RentedTable, ForRentTable } from "./PostTable";

const data = [
  {
    name: "Jan",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Feb",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Mar",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Apr",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "May",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jun",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jul",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Aug",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Sep",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Oct",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Nov",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Dec",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
];

export function Metrics(/*{ user }: MetricsProps*/) {
  return (
    <div className="flex w-full flex-col justify-center py-8 px-12">
      <h1 className="text-4xl font-semibold">Welcome, Theo!</h1>
      <div className="w-full pt-8">
        <div className="grid w-full grid-cols-4 gap-4">
          <div className="flex flex-grow flex-col gap-2 rounded-xl bg-white p-4 pl-1 pb-1 shadow-sm">
            <div className="p-3">
              <h3 className="text-xl font-medium">Revenue</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data}>
                <XAxis
                  dataKey="name"
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
                <Bar dataKey="total" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-grow flex-col gap-2 rounded-xl bg-white p-4 pl-1 pb-1 shadow-sm">
            <div className="p-3">
              <h3 className="text-xl font-medium">Expenses</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data}>
                <XAxis
                  dataKey="name"
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
                <Bar dataKey="total" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-grow flex-col gap-2 rounded-xl bg-white p-4 pl-1 pb-1  shadow-sm">
            <div className="p-3">
              <h3 className="text-xl font-medium">Likes</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data}>
                <XAxis
                  dataKey="name"
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
                <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-grow flex-col gap-2 rounded-xl bg-white p-4 pl-1 pb-1  shadow-sm">
            <div className="p-3">
              <h3 className="text-xl font-medium">Lease signed</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data}>
                <XAxis
                  dataKey="name"
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
                <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="rounded-xl bg-white p-4 shadow-sm ">
            <div className="p-3">
              <h3 className="text-xl font-medium">For Rent</h3>
            </div>
            <ForRentTable
              data={[
                {
                  id: "1",
                  title: "Super nice apartment T2 in Bordeaux",
                  owner: "Jules F.",
                  ownerId: "1",
                  rent: 1200,
                  likes: 12,
                  matches: 6,
                  createdAt: "2021-09-01",
                },
                {
                  id: "1",
                  title: "Apartment T2 in Paris",
                  owner: "John D.",
                  ownerId: "1",
                  rent: 1300,
                  likes: 15,
                  matches: 7,
                  createdAt: "2022-01-01",
                },
                {
                  id: "1",
                  title: "Studio in Lyon",
                  owner: "Jane S.",
                  ownerId: "1",
                  rent: 1150,
                  likes: 20,
                  matches: 10,
                  createdAt: "2022-01-02",
                },
                {
                  id: "1",
                  title: "Loft in Marseille",
                  owner: "Robert B.",
                  ownerId: "1",
                  rent: 700,
                  likes: 30,
                  matches: 15,
                  createdAt: "2022-01-03",
                },
              ]}
            />
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="p-3">
              <h3 className="text-xl font-medium">Rented / Managed</h3>
            </div>
            <RentedTable
              data={[
                {
                  id: "1",
                  title: "Super nice apartment T2 in Bordeaux",
                  owner: "Jules F.",
                  ownerId: "1",
                  rent: 1200,
                  tenant: "John D.",
                  tenantId: "1",
                  leaseBegin: "2021-09-01",
                  leaseEnd: "2022-09-01",
                },
                {
                  id: "1",
                  title: "Apartment T2 in Paris",
                  owner: "John D.",
                  ownerId: "1",
                  rent: 1300,
                  tenant: "Jane S.",
                  tenantId: "1",
                  leaseBegin: "2021-09-01",
                  leaseEnd: "2022-09-01",
                },
                {
                  id: "1",
                  title: "Studio in Lyon",
                  owner: "Jane S.",
                  ownerId: "1",
                  rent: 1150,
                  tenant: "Robert B.",
                  tenantId: "1",
                  leaseBegin: "2021-09-01",
                  leaseEnd: "2022-09-01",
                },
                {
                  id: "1",
                  title: "Loft in Marseille",
                  owner: "Robert B.",
                  ownerId: "1",
                  rent: 700,
                  tenant: "Jules F.",
                  tenantId: "1",
                  leaseBegin: "2021-09-01",
                  leaseEnd: "2022-09-01",
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
