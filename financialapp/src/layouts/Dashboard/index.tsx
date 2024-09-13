import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HandCoins, Wallet, ChevronsRight } from "lucide-react";
import StatCard from "@/components/ui/forDashboard/statCard";
import TransactionLineChart from "@/components/ui/forDashboard/transactionLineChart";

type Transaction = {
  id: number;
  type: "income" | "expense";
  transactionAmount: number;
};

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [savingPlan, setSavingData] = useState({
    goalName: "",
    targetAmount: 0,
    currentAmount: 0,
    targetDate: "",
    isAutoSavingEnabled: false,
    autoSavingPercentage: 0,
  });
  const [noSavingGoal, setNoSavingGoal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactionsAndSaving = async () => {
      try {
        // Fetch transactions
        const transactionResponse = await axios.get(
          "http://localhost:3000/api/transactions/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth")}`,
            },
          }
        );
        setTransactions(transactionResponse.data.data.transactions);
        console.log(transactions);

        // Fetch saving plan
        const savingResponse = await axios.get(
          "http://localhost:3000/api/saving/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth")}`,
            },
          }
        );

        setSavingData(savingResponse.data.data); // Set saving plan data
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setNoSavingGoal(true);
        } else if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionsAndSaving();
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
      title: "Total Expense",
      amount: `$${totalExpense}`,
    },
    {
      backgroundColor: "bg-green-100",
      icon: Wallet,
      title: "Total Income",
      amount: `$${totalIncome}`,
    },
  ];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="min-h-screen p-6 w-[80%] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        {/* Left Side: Stat Cards */}
        <div className="flex flex-col h-full gap-3">
          {statCards.map((card, index) => (
            <StatCard
              key={index}
              backgroundColor={card.backgroundColor}
              icon={card.icon}
              title={card.title}
              amount={card.amount}
            />
          ))}

          {/* Mini Saving Plan Card */}
          <Card
            className="flex-1 cursor-pointer"
            onClick={() => navigate("/goals")} // Navigate to goals on click
          >
            <CardHeader>
              <CardTitle className="flex flex-row justify-between">
                <div> Saving Plan</div>
                <ChevronsRight size={30} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!noSavingGoal ? (
                <div>
                  <p className="font-bold text-lg">
                    Goal Name: {savingPlan.goalName.toUpperCase()}
                  </p>
                  <p>
                    ${savingPlan.currentAmount} / ${savingPlan.targetAmount}
                  </p>
                  <p>
                    Due: {new Date(savingPlan.targetDate).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <p>You have not set up any saving plan.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Line Chart */}
        <div className="col-span-3 flex-1">
          <TransactionLineChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
