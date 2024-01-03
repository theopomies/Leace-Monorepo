import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";

export type PostToRent = {
  id: string;
  title: string;
  owner: string;
  ownerId: string;
  rent: number;
  likes: number;
  matches: number;
  createdAt: string;
};

const toRentColumnHelper = createColumnHelper<PostToRent>();

export const toRentColumns = [
  toRentColumnHelper.accessor("title", {
    header: "Property Name",
    cell: (props) => (
      <Link
        href={`/post/${props.row.original.id}`}
        className=" hover:underline"
      >
        {props.getValue()}
      </Link>
    ),
  }),
  toRentColumnHelper.accessor("owner", {
    header: "Owner",
  }),
  toRentColumnHelper.accessor("rent", {
    header: "Rent",
    cell: (props) => <span>{props.getValue()}$</span>,
  }),
  toRentColumnHelper.accessor("likes", {
    header: "Likes",
  }),
  toRentColumnHelper.accessor("matches", {
    header: "Matches",
  }),
  toRentColumnHelper.accessor("createdAt", {
    header: "Created At",
  }),
];

export type PostRented = {
  id: string;
  title: string;
  owner: string;
  ownerId: string;
  tenant: string;
  tenantId: string;
  rent: number;
  leaseBegin: string;
  leaseEnd: string;
};

const rentedColumnHelper = createColumnHelper<PostRented>();

export const rentedColumns = [
  rentedColumnHelper.accessor("title", {
    header: "Property Name",
    cell: (props) => (
      <Link
        href={`/post/${props.row.original.id}`}
        className=" hover:underline"
      >
        {props.getValue()}
      </Link>
    ),
  }),
  rentedColumnHelper.accessor("owner", {
    header: "Owner",
  }),
  rentedColumnHelper.accessor("tenant", {
    header: "Tenant",
  }),
  rentedColumnHelper.accessor("rent", {
    header: "Rent",
    cell: (props) => <span>{props.getValue()}$</span>,
  }),
  rentedColumnHelper.accessor("leaseBegin", {
    header: "Lease Begin",
  }),
  rentedColumnHelper.accessor("leaseEnd", {
    header: "Lease End",
  }),
];

export function ForRentTable({ data }: { data: PostToRent[] }) {
  return <PostTable data={data} columns={toRentColumns} />;
}

export function RentedTable({ data }: { data: PostRented[] }) {
  return <PostTable data={data} columns={rentedColumns} />;
}

export function PostTable<T>({
  data,
  columns,
}: {
  data: T[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<T, any>[];
}) {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <table className="w-full">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id} className="p-1 text-left">
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} className="border-t hover:bg-slate-100">
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="p-1">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        {table.getFooterGroups().map((footerGroup) => (
          <tr key={footerGroup.id}>
            {footerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.footer,
                      header.getContext(),
                    )}
              </th>
            ))}
          </tr>
        ))}
      </tfoot>
    </table>
  );
}
