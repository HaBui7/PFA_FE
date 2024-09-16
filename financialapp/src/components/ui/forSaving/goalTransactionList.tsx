import { useEffect, useState } from "react";
import axios from "axios";
import { DollarSign } from "lucide-react";
import ReactPaginate from "react-paginate";

interface Transaction {
  date: string;
  type: string;
  transactionAmount: number;
  _id: string;
  isSavingsTransfer: boolean;
}

const formatCurrency = (amount: number) => {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
};

const GoalTransactionList = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        // Filter transactions to include only those related to the saving goal
        const savingTransactions = response.data.data.transactions.filter(
          (transaction: Transaction) => transaction.isSavingsTransfer
        );

        setTransactions(savingTransactions.reverse());
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const indexOfLastTransaction = (currentPage + 1) * itemsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - itemsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );
  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected);
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
        <h2 className="text-lg font-bold">Saving Goal Transactions</h2>
      </div>
      <div className="min-h-[15rem]">
        {" "}
        {currentTransactions.length === 0 ? (
          <p>No transactions found for the saving goal.</p>
        ) : (
          currentTransactions.map((transaction) => (
            <div
              key={transaction._id}
              className="border-b border-gray-300 pb-4 flex items-center justify-between mb-4 "
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-full">
                  <DollarSign />
                </div>
                <div>
                  <p className="font-bold">
                    {transaction.type === "expense"
                      ? "Money added to the saving"
                      : "Withdrawing money from saving to account balance"}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {new Date(transaction.date).toLocaleString("en-US", {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <p
                  className={`font-bold ${
                    transaction.type === "income"
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {transaction.type === "income" ? "-" : "+"}
                  {formatCurrency(Math.abs(transaction.transactionAmount))}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="flex flex-col items-center mt-6">
        <ReactPaginate
          previousLabel={"< Previous"}
          nextLabel={"Next >"}
          pageCount={Math.ceil(transactions.length / itemsPerPage)}
          onPageChange={handlePageClick}
          containerClassName="flex justify-center list-none p-0"
          pageClassName="mx-1"
          pageLinkClassName="block px-4 py-2 border border-gray-300 text-black-500 no-underline cursor-pointer"
          previousClassName="mx-1"
          nextClassName="mx-1"
          previousLinkClassName="block px-4 py-2 border border-gray-300 text-black-500 no-underline cursor-pointer"
          nextLinkClassName="block px-4 py-2 border border-gray-300 text-black-500 no-underline cursor-pointer"
          activeClassName="bg-blue-300 text-white border-blue-500"
        />
      </div>
    </div>
  );
};

export default GoalTransactionList;
