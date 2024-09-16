import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartTooltip,
  ChartTooltipContent,
  ChartContainer,
} from "@/components/ui/chart";

// Transaction interface for data types
interface Transaction {
  month: string;
  income: number;
  expense: number;
}

// ChartConfig (you can define colors or other properties)
const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--chart-1))",
  },
  expense: {
    label: "Expense",
    color: "hsl(var(--chart-2))",
  },
};

const DashlineChart = () => {
  const [chartData, setChartData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2024); // Default year
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  // Fetch available years for the dropdown
  useEffect(() => {
    const fetchAvailableYears = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/transactions/getTransactionYear",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth")}`,
            },
          }
        );
        const { data } = response.data;
        setAvailableYears(data); // Update available years
      } catch (err) {
        setError("Failed to fetch available years");
      }
    };

    fetchAvailableYears();
  }, []);

  // Fetch data based on selected year
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/transactions/getChartData?year=${selectedYear}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth")}`,
            },
          }
        );
        const { data } = response.data;

        const transformedData = data.map((item: Transaction) => ({
          month: item.month,
          income: item.income,
          expense: item.expense,
        }));

        setChartData(transformedData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYear]); // Re-fetch data when selectedYear changes

  // Handle loading and error states
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Balance Performance</CardTitle>
        <CardDescription>
          Showing total income/expense of each month in the selected year
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Year selection dropdown */}
        <div className="mb-4">
          <label htmlFor="year-select" className="block text-sm font-medium">
            Select Year:
          </label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))} // Update selected year
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Chart rendering */}
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig}>
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
                tickFormatter={(value) => value.slice(0, 3)} // Abbreviate month names
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
                fill="var(--color-income)"
                fillOpacity={0.4}
                stroke="var(--color-income)"
                stackId="a"
              />
              <Area
                dataKey="expense"
                type="natural"
                fill="var(--color-expense)"
                fillOpacity={0.4}
                stroke="var(--color-expense)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div>No data available for the selected year</div>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Display Year: {selectedYear}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DashlineChart;
