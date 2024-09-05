import TransactionLineChart from "@/components/ui/forDashboard/transactionLineChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDollarSign, HandCoins, Wallet } from "lucide-react";
import StatCard from "@/components/ui/forDashboard/statCard";
import { useState, useEffect } from "react";
import axios from "axios";

type Transaction = {
  id: number;
  type: "income" | "expense";
  transactionAmount: number;
};

const Dashboard = () => {
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
        setTransactions(response.data.data.transactions);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((acc, transaction) => acc + transaction.transactionAmount, 0);

  const totalExpense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((acc, transaction) => acc + transaction.transactionAmount, 0);

  const statCards = [
    {
      backgroundColor: "bg-red-100",
      icon: HandCoins,
      percentage: "-10.2%",
      title: "Total Expense",
      amount: `$${totalExpense}`,
      percentageColor: "text-red-500",
    },
    {
      backgroundColor: "bg-green-100",
      icon: Wallet,
      percentage: "+16.4%",
      title: "Total Income",
      amount: `$${totalIncome}`,
      percentageColor: "text-green-500",
    },
  ];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="min-h-screen p-6  w-[80%] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 ">
        {/* Left Side: Three Cards Vertically */}
        <div className="flex flex-col  h-full gap-3 ">
          {statCards.map((card, index) => (
            <StatCard
              key={index}
              backgroundColor={card.backgroundColor}
              icon={card.icon}
              percentage={card.percentage}
              title={card.title}
              amount={card.amount}
              percentageColor={card.percentageColor}
            />
          ))}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Saving Plan</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add your savings plan component here */}
              <p>Sample savings plan content...</p>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Line Chart */}
        <div className="col-span-3 flex-1">
          <TransactionLineChart />
        </div>
      </div>

      {/* Other Cards Below */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-3">
        {/* Transaction History */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="">Transition History</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add your transaction history component here */}
            <p>Sample transaction history content...</p>
          </CardContent>
        </Card>

        {/* My Cards */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>My Cards</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add your cards component here */}
            <p>Sample cards content...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
