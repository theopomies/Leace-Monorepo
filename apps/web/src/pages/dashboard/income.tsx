import Link from "next/link";
import React, { useState } from "react";
import "tailwindcss/tailwind.css"; // import du fichier CSS de Tailwind

interface Revenue {
  id: number;
  amount: number;
  date: string;
}

const revenues: Revenue[] = [
  { id: 1, amount: 1000, date: "2022-02-01" },
  { id: 2, amount: 500, date: "2022-01-15" },
  { id: 3, amount: 250, date: "2022-01-03" },
];

const RevenuePage = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const filteredRevenues = selectedMonth === "all" ? revenues : revenues.filter((rev) => rev.date.startsWith(selectedMonth));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Mes revenus</h1>

      <div className="w-full max-w-screen-md flex flex-col items-center">
        <div className="flex items-center mb-4">
          <label htmlFor="month-select" className="mr-4">
            Mois :
          </label>
          <select
            id="month-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border border-gray-300 rounded-md py-1 px-3"
          >
            <option value="all">Tous les mois</option>
            <option value="2022-02">Février 2022</option>
            <option value="2022-01">Janvier 2022</option>
          </select>
        </div>

        <table className="w-full border border-gray-300 rounded-md overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Montant</th>
            </tr>
          </thead>
          <tbody>
            {filteredRevenues.map((rev) => (
              <tr key={rev.id} className="border-t border-gray-300">
                <td className="px-4 py-2">{rev.date}</td>
                <td className="px-4 py-2">{rev.amount}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-100">
            <tr>
              <td className="px-4 py-2 font-bold">Total</td>
              <td className="px-4 py-2 font-bold">{filteredRevenues.reduce((acc, rev) => acc + rev.amount, 0)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <Link 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 flex items-center justify-center rounded bottom-0 left-0 right-0"
                href={`/dashboard/main`}
                >
                Return
      </Link>
    </div>
  );
};

export default RevenuePage;
