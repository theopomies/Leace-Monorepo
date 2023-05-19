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
  // const incomesList = trpc.post.getRentIncomeByUserId.useQuery({userId: userId});


  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [Incomes, setIncomes] = useState<Income[]>(initialIncomes);
  const [amount, setAmount] = useState<number | null>(null);
  const [date, setDate] = useState("");

  const filteredIncomes = selectedMonth === "all" ? Incomes : Incomes.filter((rev) => rev.date.startsWith(selectedMonth));

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
              <option value="2023-04">Avril 2023</option>
              <option value="2023-05">Mai 2023</option>
            </select>
          </div>

          <div className="mt-4">
            <input
              type="number"
              className="px-2 py-1 border rounded-lg mr-2"
              value={amount || ""}
              onChange={(e) => setAmount(e.target.valueAsNumber)}
              placeholder="Montant"
            />
            <input
              type="date"
              className="px-2 py-1 border rounded-lg mr-2"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <button 
              onClick={addIncome}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Ajouter un revenu
            </button>
          </div>

          <table className="w-full border border-gray-300 rounded-md overflow-hidden mt-4">
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
                <td className="px-4 py-2 font-bold">{filteredIncomes.reduce((acc, rev) => acc + rev.amount, 0)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <Link 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-4 flex items-center justify-center rounded"
          href={`/dashboard/main`}
        >
          Return
        </Link>
      </div>
    </div>
  );
}