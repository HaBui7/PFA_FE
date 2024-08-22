import React, { useEffect, useState } from "react";
import axios from "axios";
import ErrorAlert from "./errorMessage";
import ConfirmModal from "./confirmModal";
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
import PaginatePage from "./paginate";

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
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);
  const [newTransaction, setNewTransaction] = useState<
    Omit<Transaction, "_id">
  >({
    title: "",
    category: "",
    transactionAmount: 0,
    type: "expense",
    date: "",
  });
  const indexOfLastTransaction = (currentPage + 1) * itemsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - itemsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected);
  };

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

  const handleDeleteClick = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (transactionToDelete) {
      try {
        await axios.delete(
          `http://localhost:3000/api/transactions/${transactionToDelete._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth")}`,
            },
          }
        );

        setTransactions(
          transactions.filter((t) => t._id !== transactionToDelete._id)
        );
        setIsDeleteModalOpen(false);
      } catch (err) {
        console.error("Error deleting transaction:", err);
      }
    }
  };

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
    // Clear previous validation errors
    setValidationErrors([]);

    // Frontend validation
    const errors = [];
    if (!newTransaction.title) {
      errors.push("Title is required.");
    }
    if (!newTransaction.category && newTransaction.type === "expense") {
      errors.push("Category is required for expenses.");
    }
    if (!newTransaction.transactionAmount) {
      errors.push("Transaction amount is required.");
    }
    if (
      newTransaction.type === "expense" &&
      !categoryOptions.includes(newTransaction.category)
    ) {
      errors.push("Invalid category selected.");
    }
    if (
      isNaN(Number(newTransaction.transactionAmount)) ||
      Number(newTransaction.transactionAmount) < 0
    ) {
      errors.push("Invalid transaction amount.");
    }

    // Date validation: Check if the date is not in the future
    const selectedDate = new Date(newTransaction.date);

    const today = new Date().getDay;
    if (selectedDate.getDay > today) {
      errors.push("The date cannot be in the future.");
    }

    // If there are validation errors, display them and stop the submission
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/transactions/",
        newTransaction,
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
    window.location.reload();
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
      {currentTransactions.length === 0 ? (
        <p>You have no transactions yet.</p>
      ) : (
        currentTransactions.map((transaction) => (
          <div
            key={transaction._id}
            className="border-b border-gray-300 py-4 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-full">
                {categoryIcons[
                  transaction.category as keyof typeof categoryIcons
                ] || <DollarSign />}
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

              <Trash2
                onClick={() => handleDeleteClick(transaction)}
                color="red"
              />
              <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Transaction"
                message="Are you sure you want to delete this transaction? This action cannot be undone."
              />
            </div>
          </div>
        ))
      )}

      {/* Modal for Adding Transaction */}
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-md mx-auto bg-white">
            <DialogHeader>
              <DialogTitle>Add Transaction</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Display validation errors */}
              {validationErrors.length > 0 && (
                <ErrorAlert message={validationErrors.join("\r\n")} />
              )}
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
                  Date
                </label>
                <input
                  type="datetime-local"
                  name="date"
                  value={newTransaction.date}
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
      <div>
        <ReactPaginate
          previousLabel={"< Previous"}
          nextLabel={"Next >"}
          pageCount={Math.ceil(transactions.length / itemsPerPage)}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          nextClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextLinkClassName={"page-link"}
          activeClassName={"active"}
        />
      </div>
    </div>
  );
};

export default TransactionList;
