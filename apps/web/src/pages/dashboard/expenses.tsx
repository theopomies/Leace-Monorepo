import Link from "next/link";
import React from "react";

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

const Depense: React.FC = () => {
  const expenses = [
    {
      id: 1,
      description: "Achat de nourriture",
      amount: 45,
      date: "2023-04-01",
    },
    {
      id: 2,
      description: "Facture d'électricité",
      amount: 60,
      date: "2023-03-28",
    },
    {
      id: 3,
      description: "Abonnement Netflix",
      amount: 12,
      date: "2023-03-25",
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-3xl font-bold">Liste des dépenses</h1>
      <ExpensesList expenses={expenses} />
      <Link 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 flex items-center justify-center rounded bottom-0 left-0 right-0"
                href={`/dashboard/main`}
                >
                Return
      </Link>
    </div>
  );
};

export default Depense;
