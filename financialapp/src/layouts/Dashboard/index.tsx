import TransactionLineChart from "@/components/ui/forDashboard/transactionLineChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDollarSign, HandCoins, Wallet } from "lucide-react";
import StatCard from "@/components/ui/forDashboard/statCard";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const statCards = [
    {
      backgroundColor: "bg-blue-100",
      icon: CircleDollarSign,
      percentage: "+8.8%",
      title: "Total Revenue",
      amount: "$320,000",
      percentageColor: "text-green-500",
    },
    {
      backgroundColor: "bg-red-100",
      icon: HandCoins,
      percentage: "-10.2%",
      title: "Total Expense",
      amount: "$240,000",
      percentageColor: "text-red-500",
    },
    {
      backgroundColor: "bg-green-100",
      icon: Wallet,
      percentage: "+16.4%",
      title: "Total Profit",
      amount: "$160,000",
      percentageColor: "text-green-500",
    },
  ];

  useEffect(() => {});

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
