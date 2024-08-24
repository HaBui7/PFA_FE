"use client";

import * as React from "react";
import { Settings } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { BudgetPieChart } from "@/components/ui/budgetPieChart";

const initialBudgetData = [
  {
    category: "Household",
    budget: 1000,
    spent: 800,
    fill: "#FF6347",
  },
  {
    category: "Shopping",
    budget: 500,
    spent: 350,
    fill: "#FFB6C1",
  },
  {
    category: "Food",
    budget: 500,
    spent: 341,
    fill: "#FFD700",
  },
  {
    category: "Utilities",
    budget: 500,
    spent: 293,
    fill: "#ADFF2F",
  },
  {
    category: "Transportation",
    budget: 300,
    spent: 257,
    fill: "#00BFFF",
  },
  {
    category: "Others",
    budget: 200,
    spent: 218,
    fill: "#9370DB",
  },
];

export default function Budget() {
  const [duration, setDuration] = React.useState({ start: "", end: "" });
  const [budgetData, setBudgetData] = React.useState(initialBudgetData);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isBudgetSet, setIsBudgetSet] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<number | null>(
    null
  );

  const [error, setError] = React.useState<string | null>(null);

  const totalSpent = React.useMemo(() => {
    return budgetData.reduce((acc, curr) => acc + curr.spent, 0);
  }, [budgetData]);

  const totalBudget = React.useMemo(() => {
    return budgetData.reduce((acc, curr) => acc + curr.budget, 0);
  }, [budgetData]);

  const handleEditClick = (index: number) => {
    setSelectedCategory(index);
    setIsModalOpen(true);
  };

  const handleSaveSettings = () => {
    setError(null);

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize 'today' to midnight

    const startDate = new Date(duration.start);
    startDate.setHours(0, 0, 0, 0); // Normalize 'startDate' to midnight

    const endDate = new Date(duration.end);
    endDate.setHours(0, 0, 0, 0); // Normalize 'endDate' to midnight

    console.log(startDate);
    if (duration.start == "" || duration.end == "") {
      setError("Start date or End date is not set correctly");
      return;
    }

    if (startDate < today) {
      setError("Start date cannot be before today.");
      return;
    }

    if (endDate <= startDate) {
      setError("End date must be after start date.");
      return;
    }

    // Budget validation
    for (const item of budgetData) {
      if (item.budget < 0) {
        setError("Budget amounts cannot be negative.");
        return;
      }
    }

    setIsBudgetSet(true);
    setIsModalOpen(false);
  };

  const handleOpenSettings = () => {
    setIsModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="flex flex-col min-h-screen  border-none">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-5xl font-bold text-center ">
          Budget Tracker
        </CardTitle>
        <CardDescription className="text-center mt-2">
          {isBudgetSet ? (
            <>
              <span className="font-semibold text-lg">
                Duration: {formatDate(duration.start)} -{" "}
                {formatDate(duration.end)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="ml-4"
                onClick={handleOpenSettings}
              >
                <Settings size={16} className="mr-2" />
                Edit Budget
              </Button>
            </>
          ) : (
            <>
              Start setting your budget for a specific duration to track your
              expenses!
              <Button size="sm" className="ml-4" onClick={handleOpenSettings}>
                Start Now
              </Button>
            </>
          )}
        </CardDescription>
      </CardHeader>
      {isBudgetSet && (
        <CardContent className="flex-1 pb-0">
          <BudgetPieChart
            budgetData={budgetData}
            totalSpent={totalSpent}
            totalBudget={totalBudget}
          />
          <div className="space-y-6 max-w-2xl mx-auto">
            {budgetData.map((item, index) => (
              <div
                key={item.category}
                className="flex items-center justify-between"
              >
                <div className="w-full">
                  <p className="font-medium text-lg">{item.category}</p>
                  <div className="relative w-full h-6 rounded-full overflow-hidden bg-gray-200">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(item.spent / item.budget) * 100}%`,
                        background: item.fill,
                      }}
                    ></div>
                    <div className="absolute inset-y-0 right-2 flex items-center text-white text-xs font-bold">
                      {item.spent.toLocaleString()} /{" "}
                      {item.budget.toLocaleString()}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-4"
                  onClick={() => handleEditClick(index)}
                ></Button>
              </div>
            ))}
          </div>
        </CardContent>
      )}

      {/* Modal for Setting Duration and Budgets */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md overflow-auto max-h-[90%] mx-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-center">
              {isBudgetSet ? "Edit Budget Settings" : "Set Your Budget"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Duration Start
              </label>
              <Input
                type="date"
                value={duration.start}
                onChange={(e) =>
                  setDuration((prev) => ({
                    ...prev,
                    start: e.target.value,
                  }))
                }
                placeholder="Start Date"
                className="mb-4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Duration End
              </label>
              <Input
                type="date"
                value={duration.end}
                onChange={(e) =>
                  setDuration((prev) => ({
                    ...prev,
                    end: e.target.value,
                  }))
                }
                placeholder="End Date"
                className="mb-4"
              />
            </div>
            {budgetData.map((item, index) => (
              <div key={item.category}>
                <label className="block text-sm font-medium text-gray-700">
                  {item.category} Budget
                </label>
                <Input
                  value={item.budget}
                  onChange={(e) =>
                    setBudgetData((prev) => {
                      const newBudgetData = [...prev];
                      newBudgetData[index].budget =
                        parseFloat(e.target.value) || 0;
                      return newBudgetData;
                    })
                  }
                  className="mb-4"
                />
              </div>
            ))}
            {/* Display error message */}
            {error && (
              <p className="text-red-500 font-bold text-sm text-center">
                {error}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSettings}>
              {isBudgetSet ? "Save Changes" : "Start Budget"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
