import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart, Cell } from "recharts";
import axios from "axios";

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
  type: string;
  category: string;
  transactionAmount: number;
  title: string;
  _id: string;
}

const categoryColors: { [key: string]: string } = {
  Household: "#FF6384",
  Shopping: "#36A2EB",
  "Food & Dining": "#FFCE56",
  Utilities: "#4BC0C0",
  Transportation: "#9966FF",
  Others: "#dbc8db",
};

const chartConfig = {
  Household: {
    label: "Household",
    color: "#FF6384",
  },
  Shopping: {
    label: "Shopping",
    color: "#36A2EB",
  },
  "Food & Dining": {
    label: "Food & Dining",
    color: "#FFCE56",
  },
  Utilities: {
    label: "Utilities",
    color: "#4BC0C0",
  },
  Transportation: {
    label: "Transportation",
    color: "#9966FF",
  },
  Others: {
    label: "Others",
    color: "#dbc8db",
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
    const data = transactions.reduce((acc, transaction) => {
      const category = transaction.category;
      if (!acc[category]) {
        acc[category] = {
          category,
          transactionAmount: 0,
          fill: categoryColors[category],
        };
      }
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

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Donut with Text</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
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
                          Transaction Amount
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
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total transaction amount for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
