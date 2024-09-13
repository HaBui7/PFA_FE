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
import { TrendingUp } from "lucide-react";
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
  // States for data, loading, and error handling
  const [chartData, setChartData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true); // Start as loading
  const [error, setError] = useState<string | null>(null);

  // Fetch data from the API on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true before starting the request
      try {
        const response = await axios.get(
          "http://localhost:3000/api/transactions/getChartData?year=2024",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth")}`,
            },
          }
        );
        const { data } = response.data;

        // Transform the data to match the chart's structure
        const transformedData = data.map((item: Transaction) => ({
          month: item.month,
          income: item.income,
          expense: item.expense,
        }));

        setChartData(transformedData); // Update state with the fetched data
        setLoading(false); // Set loading to false after data is fetched
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchData();
  }, []);

  // Show loading state or error message if applicable
  if (loading) return <div>Loading...</div>; // Show loading while fetching
  if (error) return <div>Error: {error}</div>; // Show error if there's any

  return (
    <Card>
      <CardHeader>
        <CardTitle>Balance Performance</CardTitle>
        <CardDescription>
          Showing total income/expense of each month in the year 2024
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? ( // Conditionally render the chart only when data is available
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
          <div>No data available</div> // Handle the case where no data is available
        )}
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none"></div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Display Year 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DashlineChart;
