import { useState, useEffect, useMemo } from "react";
import { Settings, Trash2 } from "lucide-react"; // Import the trash icon for the delete button
import axios from "axios";

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
import { BudgetPieChart } from "@/components/ui/forBudget/budgetPieChart";
import ErrorMessage from "@/components/ui/errorMessage";
import ConfirmModal from "@/components/ui/confirmModal";

interface Categories {
  [key: string]: {
    limit: number;
    spent: number;
  };
}

interface Budget {
  title: string;
  startDate: string;
  deadline: string;
  categories: Categories;
}

// Color mapping for each category
const categoryColors: { [key: string]: string } = {
  household: "#FF6384",
  shopping: "#36A2EB",
  food: "#FFCE56",
  utilities: "#4BC0C0",
  transportation: "#9966FF",
  others: "#dbc8db",
  saving: "#a1ede9",
};

// Default categories for new budgets
const defaultCategories = {
  household: { limit: 0, spent: 0 },
  shopping: { limit: 0, spent: 0 },
  food: { limit: 0, spent: 0 },
  utilities: { limit: 0, spent: 0 },
  transportation: { limit: 0, spent: 0 },
  others: { limit: 0, spent: 0 },
  saving: { limit: 0, spent: 0 },
};

export default function Budget() {
  const [confirmModal, setConfirmModal] = useState(false);
  const [duration, setDuration] = useState({ start: "", end: "" });
  const [budgetData, setBudgetData] = useState<any[]>([]); // Initialize empty array
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBudgetSet, setIsBudgetSet] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); // Distinguish between create and update
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Categories>(defaultCategories);

  // Fetch real budget data on component mount
  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/budgets", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth")}`,
          },
        });

        const budget = response.data.data; // Assuming your API returns the budget data here
        if (budget) {
          const categories = budget.categories;

          // Map the categories into the format required by the component, adding colors
          const formattedBudgetData = Object.keys(categories).map(
            (category) => ({
              category: category.charAt(0).toUpperCase() + category.slice(1), // Capitalize category name
              budget: categories[category].limit,
              spent: categories[category].spent,
              fill: categoryColors[category.toLowerCase()] || "#000000", // Assign color
            })
          );

          setBudgetData(formattedBudgetData);
          setDuration({ start: budget.startDate, end: budget.deadline });
          setCategories(categories); // Set the categories in state for editing
          setIsBudgetSet(true);
          setIsUpdating(true); // Switch to update mode
        } else {
          setIsUpdating(false); // No budget exists, use create mode
        }
      } catch (err) {
        // No budget found, open the modal for new budget entry
        setIsModalOpen(true);
      }
    };

    fetchBudgetData();
  }, []);

  const totalSpent = useMemo(() => {
    return budgetData.reduce((acc, curr) => acc + curr.spent, 0);
  }, [budgetData]);

  const totalBudget = useMemo(() => {
    return budgetData.reduce((acc, curr) => acc + curr.budget, 0);
  }, [budgetData]);

  const handleSaveSettings = async () => {
    setError(null);

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize 'today' to midnight

    const startDate = new Date(duration.start);
    startDate.setHours(0, 0, 0, 0); // Normalize 'startDate' to midnight

    const endDate = new Date(duration.end);
    endDate.setHours(0, 0, 0, 0); // Normalize 'endDate' to midnight

    if (duration.start === "" || duration.end === "") {
      setError("Start date or End date is not set correctly");
      return;
    }

    if (endDate <= startDate) {
      setError("End date must be after start date.");
      return;
    }

    // Budget validation
    for (const key in categories) {
      if (categories[key].limit < 0) {
        setError("Budget amounts cannot be negative.");
        return;
      }
    }

    // Create the budget object
    const budgetToSend = {
      title: "My Budget",
      startDate: duration.start,
      deadline: duration.end,
      categories,
    };

    try {
      if (isUpdating) {
        // Make PATCH request to update the budget
        const response = await axios.patch(
          "http://localhost:3000/api/budgets/",
          budgetToSend,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth")}`,
            },
          }
        );
        // Handle updated budget
        const updatedBudget = response.data.data;
        setBudgetData(
          Object.keys(updatedBudget.categories).map((category) => ({
            category: category.charAt(0).toUpperCase() + category.slice(1),
            budget: updatedBudget.categories[category].limit,
            spent: updatedBudget.categories[category].spent,
            fill: categoryColors[category.toLowerCase()] || "#000000",
          }))
        );
      } else {
        // Make POST request to create a new budget
        const response = await axios.post(
          "http://localhost:3000/api/budgets/",
          budgetToSend,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth")}`,
            },
          }
        );
        // Handle new budget
        const newBudget = response.data.data;
        setBudgetData(
          Object.keys(newBudget.categories).map((category) => ({
            category: category.charAt(0).toUpperCase() + category.slice(1),
            budget: newBudget.categories[category].limit,
            spent: newBudget.categories[category].spent,
            fill: categoryColors[category.toLowerCase()] || "#000000",
          }))
        );
      }

      setDuration({
        start: budgetToSend.startDate,
        end: budgetToSend.deadline,
      });
      setIsBudgetSet(true);
      setIsModalOpen(false);
    } catch (err) {
      setError("An error occurred while saving the budget.");
      console.error(err);
    }
  };

  const handleOpenSettings = () => {
    setIsModalOpen(true);
  };

  const handleCategoryChange = (category: string, value: number) => {
    setCategories((prevCategories) => ({
      ...prevCategories,
      [category]: {
        ...prevCategories[category],
        limit: value,
      },
    }));
  };

  // Handle Delete Budget
  const handleDeleteBudget = async () => {
    try {
      // Make DELETE request to delete the budget
      await axios.delete("http://localhost:3000/api/budgets/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth")}`,
        },
      });

      // Clear local state after deletion
      setBudgetData([]);
      setDuration({ start: "", end: "" });
      setCategories(defaultCategories);
      setIsBudgetSet(false);
      setIsUpdating(false);
      setConfirmModal(false);
    } catch (err) {
      setError("An error occurred while deleting the budget.");
      console.error(err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleConfirmModal = () => {
    setConfirmModal(true);
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
              <Button
                variant="ghost"
                size="sm"
                className="ml-4 text-red-500"
                onClick={handleConfirmModal}
              >
                <Trash2 size={16} className="mr-2 text-red-500" />
                Delete Budget
              </Button>
            </>
          ) : (
            <div className="text-lg">
              Start setting your budget for a specific duration to track your
              expenses!
              <Button size="sm" className="ml-4" onClick={handleOpenSettings}>
                Start Now
              </Button>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      {isBudgetSet && (
        <CardContent className="flex-1 pb-0">
          {budgetData.some((item) => item.spent >= item.budget * 0.9) && (
            <p className="text-red-500 font-bold text-center mt-4 underline">
              Warning: One or more categories are close to or have exceeded
              their budget!
            </p>
          )}
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
                  <div className="flex flex-row justify-between">
                    <p className="font-medium text-lg">{item.category}</p>
                    {item.spent >= item.budget && <p className="">⚠️</p>}
                  </div>
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
              </div>
            ))}
          </div>
        </CardContent>
      )}
      <ConfirmModal
        message="Do you want to delete your budget plan?"
        title="Deleting Budget Plan"
        isOpen={confirmModal}
        onClose={() => setConfirmModal(false)}
        onConfirm={handleDeleteBudget}
      />

      {/* Modal for Setting Duration and Budgets */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md overflow-auto max-h-[90%] mx-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-center">
              {isUpdating ? "Edit Budget Settings" : "Set Your Budget"}
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

            {/* Show input fields for each category */}
            {Object.keys(categories).map((category) => (
              <div key={category}>
                <label className="block text-sm font-medium text-gray-700">
                  {category.charAt(0).toUpperCase() + category.slice(1)} Budget
                </label>
                <Input
                  value={categories[category].limit}
                  onChange={(e) =>
                    handleCategoryChange(
                      category,
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="mb-4"
                />
              </div>
            ))}

            {/* Display error message */}
            {error && <ErrorMessage message={error} />}
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSettings}>
              {isUpdating ? "Save Changes" : "Start Budget"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
