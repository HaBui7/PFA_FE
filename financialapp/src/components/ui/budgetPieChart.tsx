import { Pie, PieChart, Label, Tooltip } from "recharts";

interface BudgetPieChartProps {
  budgetData: Array<{
    category: string;
    spent: number;
    fill: string;
  }>;
  totalSpent: number;
  totalBudget: number;
}

export function BudgetPieChart({
  budgetData,
  totalSpent,
  totalBudget,
}: BudgetPieChartProps) {
  return (
    <div className="flex flex-col items-center mb-6">
      <PieChart width={250} height={250}>
        <Pie
          data={budgetData.map((item) => ({
            name: item.category,
            value: item.spent,
            fill: item.fill,
          }))}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          label={false}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {totalSpent.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground text-sm"
                    >
                      out of {totalBudget.toLocaleString()}
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            borderRadius: "5px",
            padding: "10px",
            color: "#fff",

            borderColor: "#000",
          }}
          formatter={(value: number, name: string) => [
            `${value.toLocaleString()}`,
            `${name} Budget`,
          ]}
          labelStyle={{ fontWeight: "bold", color: "#000" }}
        />
      </PieChart>
    </div>
  );
}
