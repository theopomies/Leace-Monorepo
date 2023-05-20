import React, { useState } from "react";
import { trpc } from "../../utils/trpc";
import Link from "next/link";

interface ExpenseProps {
  description: string;
  amount: number;
  date: string;
}

const Expense: React.FC<ExpenseProps> = ({ description, amount, date }) => {
  return (
    <div className="my-2 flex items-center justify-between rounded bg-white p-4 shadow">
      <div>
        <p className="text-lg text-gray-800">{description}</p>
        <p className="text-sm text-gray-500">{date}</p>
      </div>
      <p className="text-xl font-bold text-gray-800">{amount}€</p>
    </div>
  );
};

interface ExpenseItem {
  id: number;
  description: string;
  amount: number;
  date: string;
}

interface ExpensesListProps {
  expenses: ExpenseItem[];
}

const ExpensesList: React.FC<ExpensesListProps> = ({ expenses }) => {
  return (
    <div>
      {expenses.map((expense) => (
        <Expense
          key={expense.id}
          description={expense.description}
          amount={expense.amount}
          date={expense.date}
        />
      ))}
    </div>
  );
};

interface ExpenseListProps {
  userId: string; 
}


export function Expenses({ userId }: ExpenseListProps) {
  const expenses_get = trpc.post.getRentExpenseByUserId.useQuery({userId: userId});
  console.log(expenses_get.data);

  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    // {
    //   id: 1,
    //   description: "Achat de nourriture",
    //   amount: 45,
    //   date: "2023-04-01",
    // },
    // {
    //   id: 2,
    //   description: "Facture d'électricité",
    //   amount: 60,
    //   date: "2023-03-28",
    // },
    // {
    //   id: 3,
    //   description: "Abonnement Netflix",
    //   amount: 12,
    //   date: "2023-03-25",
    // },
  ]);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | null>(null);
  const [date, setDate] = useState("");

  const addExpense = () => {
    if (!description || !amount || !date) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    setExpenses([
      ...expenses,
      {
        id: expenses.length + 1,
        description: description,
        amount: amount,
        date: date,
      },
    ]);

    // reset fields after adding
    setDescription("");
    setAmount(null);
    setDate("");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-3xl font-bold">Liste des dépenses</h1>
      <ExpensesList expenses={expenses} />
      
      <div className="mt-4">
        <input
          className="px-2 py-1 border rounded-lg mr-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
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
          onClick={addExpense}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Ajouter une dépense
        </button>
      </div>

      <Link 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-4 flex items-center justify-center rounded"
        href={`/dashboard/main`}
      >
        Return
      </Link>
    </div>
  );
}