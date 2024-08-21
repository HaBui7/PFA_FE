import React, { useEffect, useState } from "react";
import axios from "axios";

import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./dialog";
import {
  Pencil,
  Trash2,
  ShoppingCart,
  Home,
  Utensils,
  Bus,
  DollarSign,
} from "lucide-react";
import ReactPaginate from "react-paginate";

interface Transaction {
  date: string;
  type: string;
  category: string;
  transactionAmount: number;
  title: string;
  _id: string;
}

const categoryIcons = {
  Household: <Home />,
  Shopping: <ShoppingCart />,
  "Food & Dining": <Utensils />,
  Utilities: <DollarSign />,
  Transportation: <Bus />,
};

const categoryOptions = [
  "Household",
  "Shopping",
  "Food & Dining",
  "Utilities",
  "Transportation",
];

const formatCurrency = (amount: number) => {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
};

const TransactionList = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newTransaction, setNewTransaction] = useState<
    Omit<Transaction, "_id" | "date">
  >({
    title: "",
    category: "",
    transactionAmount: 0,
    type: "expense",
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/transactions/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth")}`,
            },
          }
        );
        setTransactions(response.data.data.transactions);
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNewTransaction({
      ...newTransaction,
      [e.target.name]:
        e.target.name === "transactionAmount"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const handleAddTransaction = async () => {
    // Frontend validation
    if (
      !newTransaction.title ||
      (!newTransaction.category && newTransaction.type === "expense") ||
      !newTransaction.transactionAmount ||
      !newTransaction.type
    ) {
      alert("Please fill out all fields.");
      return;
    }

    if (
      newTransaction.type === "expense" &&
      !categoryOptions.includes(newTransaction.category)
    ) {
      alert("Invalid category selected.");
      return;
    }

    if (
      isNaN(Number(newTransaction.transactionAmount)) ||
      Number(newTransaction.transactionAmount) < 0
    ) {
      alert("Invalid transaction amount.");
      return;
    }

    try {
      const newTransactionData = {
        ...newTransaction,
        date: new Date().toISOString(), // Current date in "2024-08-21T00:00:00.000Z" format
      };

      const response = await axios.post(
        "http://localhost:3000/api/transactions/",
        newTransactionData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth")}`,
          },
        }
      );

      setTransactions([...transactions, response.data.data.transaction]);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error adding transaction:", err);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="space-y-4 m-auto flex flex-col w-8/12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Latest Transaction</h2>
        <Button onClick={() => setIsModalOpen(true)}>Add</Button>
      </div>
      {transactions.length === 0 ? (
        <p>You have no transactions yet.</p>
      ) : (
        transactions.map((transaction) => (
          <div
            key={transaction._id}
            className="border-b border-gray-300 py-4 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-full">
                <DollarSign />
              </div>
              <div>
                <p className="font-bold">{transaction.title}</p>
                <p className="text-gray-600 text-sm">
                  {new Date(transaction.date).toLocaleString("en-US", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <p
                className={`font-bold ${
                  transaction.type === "income"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {transaction.type === "income" ? "+" : "-"}
                {formatCurrency(Math.abs(transaction.transactionAmount))}
              </p>
              <button className="text-gray-500">
                <Pencil />
              </button>
              <button className="text-red-500">
                <Trash2 />
              </button>
            </div>
          </div>
        ))
      )}
      <div className="flex flex-col items-center mt-6">
        <ReactPaginate
          className="flex items-center space-x-2 bg-white shadow-md rounded-lg p-4 border border-gray-300"
          nextLabel="Next >"
          pageRangeDisplayed={5}
          marginPagesDisplayed={4}
          pageCount={5}
          previousLabel="< Previous"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          renderOnZeroPageCount={null}
        />
      </div>

      {/* Modal for Adding Transaction */}
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-md mx-auto bg-white">
            <DialogHeader>
              <DialogTitle>Add Transaction</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={newTransaction.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  name="category"
                  value={newTransaction.category}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={newTransaction.type === "income"}
                  required={newTransaction.type === "expense"}
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {categoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <input
                  type="number"
                  name="transactionAmount"
                  value={newTransaction.transactionAmount}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  name="type"
                  value={newTransaction.type}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTransaction}>Submit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TransactionList;
