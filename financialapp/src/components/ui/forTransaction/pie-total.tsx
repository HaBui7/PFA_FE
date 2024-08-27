import * as React from "react";
import axios from "axios";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface Transaction {
  date: string;
  type: string;
  category: string;
  transactionAmount: number;
  title: string;
  _id: string;
}

const chartConfig = {
  amount: {
    label: "Amount",
  },
  income: {
    label: "Income",
    color: "#5cd170",
  },
  expense: {
    label: "Expense",
    color: "#d1352a",
  },
} satisfies ChartConfig;

export function PieTotal() {
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
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

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((acc, transaction) => acc + transaction.transactionAmount, 0);

  const totalExpense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((acc, transaction) => acc + transaction.transactionAmount, 0);

  const chartData = [
    { category: "Income", amount: totalIncome, fill: "#5cd170" },
    { category: "Expense", amount: totalExpense, fill: "#d1352a" },
  ];

  const totalAmount = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.amount, 0);
  }, [chartData]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (transactions.length === 0) {
    return <div>No transactions available.</div>;
  }

  return (
    <Card className="flex flex-col border-none p-4 ">
      <CardHeader className="items-center pb-0">
        <CardTitle>Income vs Expense</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-2">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      ></text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm"></CardFooter>
    </Card>
  );
}
