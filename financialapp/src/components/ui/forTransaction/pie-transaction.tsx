import React, { useState, useEffect } from "react";
import axios from "axios";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
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
  type: string; // "income" or "expense"
  category: string;
  transactionAmount: number;
  title: string;
  _id: string;
}

const categoryOptions = [
  "Household",
  "Shopping",
  "Food & Dining",
  "Utilities",
  "Transportation",
];

const categoryColors: { [key: string]: string } = {
  Household: "#FF6384",
  Shopping: "#36A2EB",
  "Food & Dining": "#FFCE56",
  Utilities: "#4BC0C0",
  Transportation: "#9966FF",
};

const chartConfig = {
  transactionAmount: {
    label: "Transaction Amount",
  },
} satisfies ChartConfig;

const PieTransaction: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
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

  const aggregateTransactionsByCategory = (transactions: Transaction[]) => {
    const aggregatedData: { [key: string]: number } = {};

    transactions.forEach((transaction) => {
      if (aggregatedData[transaction.category]) {
        if (transaction.type === "income") {
          aggregatedData[transaction.category] += transaction.transactionAmount;
        } else if (transaction.type === "expense") {
          aggregatedData[transaction.category] -= transaction.transactionAmount;
        }
      } else {
        aggregatedData[transaction.category] =
          transaction.type === "income"
            ? transaction.transactionAmount
            : -transaction.transactionAmount;
      }
    });

    return categoryOptions.map((category) => ({
      category,
      transactionAmount: aggregatedData[category] || 0,
      fill: categoryColors[category] || "#0000FF", // Default to blue if no color is found
    }));
  };

  const chartData = aggregateTransactionsByCategory(transactions);

  const totalTransactionAmount = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.transactionAmount, 0);
  }, [chartData]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card className="flex flex-col border-none">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Donut with Text</CardTitle>
        <CardDescription>Transaction Data</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
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
              dataKey="transactionAmount"
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
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalTransactionAmount.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Amount
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm ">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total transaction amounts for the selected period
        </div>
      </CardFooter>
    </Card>
  );
};

export default PieTransaction;
