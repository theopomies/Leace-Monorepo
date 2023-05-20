import Link from "next/link";
import React, { useState } from "react";
import "tailwindcss/tailwind.css";
import { trpc } from "../../utils/trpc";

interface Income {
  id: number;
  amount: number;
  date: string;
}

const initialIncomes: Income[] = [
  // { id: 1, amount: 1000, date: "2023-05-01" },
  // { id: 2, amount: 500, date: "2023-04-01"},
  // { id: 3, amount: 250, date: "2023-03-01" },
];

interface IncomeListProps {
  userId: string;
}

export function Income({ userId }: IncomeListProps) {
  const incomesList = trpc.post.getRentIncomeByUserId.useQuery({
    userId: userId,
  });
  console.log(incomesList.data);

  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [Incomes, setIncomes] = useState<Income[]>(initialIncomes);
  const [amount, setAmount] = useState<number | null>(null);
  const [date, setDate] = useState("");

  const filteredIncomes =
    selectedMonth === "all"
      ? Incomes
      : Incomes.filter((rev) => rev.date.startsWith(selectedMonth));

  const addIncome = () => {
    if (!amount || !date) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    setIncomes([
      ...Incomes,
      {
        id: Incomes.length + 1,
        amount: amount,
        date: date,
      },
    ]);

    // reset fields after adding
    setAmount(null);
    setDate("");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="mb-8 text-3xl font-bold">Mes revenus</h1>

        <div className="flex w-full max-w-screen-md flex-col items-center">
          <div className="mb-4 flex items-center">
            <label htmlFor="month-select" className="mr-4">
              Mois :
            </label>
            <select
              id="month-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-1"
            >
              <option value="all">Tous les mois</option>
              <option value="2023-04">Avril 2023</option>
              <option value="2023-05">Mai 2023</option>
            </select>
          </div>

          <div className="mt-4">
            <input
              type="number"
              className="mr-2 rounded-lg border px-2 py-1"
              value={amount || ""}
              onChange={(e) => setAmount(e.target.valueAsNumber)}
              placeholder="Montant"
            />
            <input
              type="date"
              className="mr-2 rounded-lg border px-2 py-1"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <button
              onClick={addIncome}
              className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            >
              Ajouter un revenu
            </button>
          </div>

          <table className="mt-4 w-full overflow-hidden rounded-md border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Montant</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncomes.map((rev) => (
                <tr key={rev.id} className="border-t border-gray-300">
                  <td className="px-4 py-2">{rev.date}</td>
                  <td className="px-4 py-2">{rev.amount}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-100">
              <tr>
                <td className="px-4 py-2 font-bold">Total</td>
                <td className="px-4 py-2 font-bold">
                  {filteredIncomes.reduce((acc, rev) => acc + rev.amount, 0)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <Link
          className="mt-4 flex items-center justify-center rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          href={`/dashboard/main`}
        >
          Return
        </Link>
      </div>
    </div>
  );
}
