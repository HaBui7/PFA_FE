import * as React from "react";

import { Label, Pie, PieChart, Cell } from "recharts";
import axios from "axios";

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

const categoryColors: { [key: string]: string } = {
  household: "#FF6384",
  shopping: "#36A2EB",
  food: "#FFCE56",
  utilities: "#4BC0C0",
  transportation: "#9966FF",
  others: "#dbc8db",
  saving: "#a1ede9",
};

const chartConfig = {
  Household: {
    label: "Household ",
    color: "#FF6384",
  },
  Shopping: {
    label: "Shopping ",
    color: "#36A2EB",
  },
  Food: {
    label: "Food & Dining ",
    color: "#FFCE56",
  },
  Utilities: {
    label: "Utilities ",
    color: "#4BC0C0",
  },
  Transportation: {
    label: "Transportation ",
    color: "#9966FF",
  },
  Others: {
    label: "Others ",
    color: "#dbc8db",
  },
  Saving: {
    label: "Saving ",
    color: "#a1ede9",
  },
} satisfies ChartConfig;

export function PieTransaction() {
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

  const chartData = React.useMemo(() => {
    const data = transactions
      .filter((transaction) => transaction.type === "expense")

      .reduce((acc, transaction) => {
        const category = transaction.category;

        console.log(`Adding category: ${category}`);
        acc[category] = {
          category,
          transactionAmount: 0,
          fill: categoryColors[category] || "#000000", // Default to black if category not found
        };
        console.log(`Fill color: ${acc[category].fill}`);

        acc[category].transactionAmount += transaction.transactionAmount;
        return acc;
      }, {} as Record<string, { category: string; transactionAmount: number; fill: string }>);

    return Object.values(data);
  }, [transactions]);

  const totalTransactionAmount = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.transactionAmount, 0);
  }, [chartData]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (transactions.length === 0) {
    return <div>No transactions available.</div>;
  }

  return (
    <Card className="flex flex-col border-none p-4">
      <CardHeader className="items-center pb-0">
        <CardTitle>Category Expense</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square ">
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
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
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
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing the expense amout of each category
        </div>
      </CardFooter>
    </Card>
  );
}
