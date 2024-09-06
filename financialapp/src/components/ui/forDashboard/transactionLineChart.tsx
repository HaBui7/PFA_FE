import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import axios from "axios";

interface Transaction {
  month: string;
  income: number;
  expense: number;
}

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const dashlineChart = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState([
    { month: "January", income: 0, expense: 0 },
    { month: "February", income: 0, expense: 0 },
    { month: "March", income: 0, expense: 0 },
    { month: "April", income: 0, expense: 0 },
    { month: "May", income: 0, expense: 0 },
    { month: "June", income: 0, expense: 0 },
    { month: "July", income: 0, expense: 0 },
    { month: "August", income: 0, expense: 0 },
    { month: "September", income: 0, expense: 0 },
    { month: "October", income: 0, expense: 0 },
    { month: "November", income: 0, expense: 0 },
    { month: "December", income: 0, expense: 0 },
  ]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/transactions/getChartData?year=2024",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth")}`,
            },
          }
        );

        const transactions: Transaction[] = response.data.data;
        console.log("Fetched transactions:", transactions);

        const updatedChartData = chartData.map((monthData) => {
          const transactionData = transactions.find(
            (transaction) => transaction.month === monthData.month
          );

          return transactionData
            ? {
                ...monthData,
                income: transactionData.income,
                expense: transactionData.expense,
              }
            : monthData;
        });

        console.log("Updated chart data:", updatedChartData);
        setChartData(updatedChartData);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Area Chart - Axes</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AreaChart
          data={chartData}
          margin={{
            left: -20,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickCount={3}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Area
            dataKey="income"
            type="natural"
            fill="var(--color-mobile)"
            fillOpacity={0.4}
            stroke="var(--color-mobile)"
            stackId="a"
          />
          <Area
            dataKey="expense"
            type="natural"
            fill="var(--color-desktop)"
            fillOpacity={0.4}
            stroke="var(--color-desktop)"
            stackId="a"
          />
        </AreaChart>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default dashlineChart;
