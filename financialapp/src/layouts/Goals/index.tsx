import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import GoalTransactionlist from "@/components/ui/forSaving/goalTransactionList";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import ErrorMessage from "@/components/ui/errorMessage"; // Import the ErrorAlert component
import SavingToggle from "@/components/ui/forSaving/savingToggle";

export default function SavingGoalPage() {
  const [savingData, setSavingData] = useState({
    goalName: "",
    targetAmount: 0,
    currentAmount: 0,
    targetDate: "",
    isAutoSavingEnabled: false,
    autoSavingPercentage: 0,
  });
  const [goalState, setGoalState] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noSavingGoal, setNoSavingGoal] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [addMoneyAmount, setAddMoneyAmount] = useState(0);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [addMoneyError, setAddMoneyError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [newSavingGoal, setNewSavingGoal] = useState({
    goalName: "",
    targetAmount: 0,
    targetDate: "",
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editSavingGoal, setEditSavingGoal] = useState({
    goalName: "",
    targetAmount: 0,
    targetDate: "",
  });
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavingData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/saving", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth")}`,
          },
        });

        setSavingData(response.data.data);
        const progressPercentage = Math.min(
          (response.data.data.currentAmount / response.data.data.targetAmount) *
            100,
          100
        );
        if (progressPercentage >= 100) {
          setGoalState(true);
        }

        setLoading(false);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setNoSavingGoal(true);
        } else if (err instanceof Error) {
          setError(err.message);
        }

        setLoading(false);
      }
    };

    fetchSavingData();
  }, []);

  const handleWithdrawClick = () => {
    setIsWithdrawModalOpen(true);
  };

  const handleAddMoneyClick = () => {
    setIsAddMoneyModalOpen(true);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleWithdraw = async () => {
    if (withdrawAmount <= 0) {
      setWithdrawError("Please enter a valid amount.");
      return;
    }
    if (withdrawAmount > savingData.currentAmount) {
      setWithdrawError("You cannot withdraw more than your current savings.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/saving/withdraw-money",
        { amount: withdrawAmount },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth")}`,
          },
        }
      );

      setSavingData((prevData) => ({
        ...prevData,
        currentAmount: response.data.data.currentSaving.currentAmount,
      }));
      setIsWithdrawModalOpen(false);
      setWithdrawError(null);
      window.location.reload();
    } catch (err) {
      if (err instanceof Error) setWithdrawError(err.message);
    }
  };

  const handleAddMoney = async () => {
    if (addMoneyAmount <= 0) {
      setAddMoneyError("Please enter a valid amount.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/saving/add-money",
        { amount: addMoneyAmount },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth")}`,
          },
        }
      );

      setSavingData((prevData) => ({
        ...prevData,
        currentAmount: response.data.data.currentSaving.currentAmount,
      }));
      setIsAddMoneyModalOpen(false);
      setAddMoneyError(null);
      window.location.reload();
    } catch (err) {
      if (err instanceof Error) setAddMoneyError(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete("http://localhost:3000/api/saving", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth")}`,
        },
      });

      setSavingData({
        goalName: "",
        targetAmount: 0,
        currentAmount: 0,
        targetDate: "",
        isAutoSavingEnabled: false,
        autoSavingPercentage: 0,
      });
      setNoSavingGoal(true);
      setIsDeleteModalOpen(false);
      setDeleteError(null);
    } catch (err) {
      if (err instanceof Error) setDeleteError(err.message);
    }
  };

  const validateCreateGoal = () => {
    if (newSavingGoal.targetAmount <= 0) {
      setCreateError("Target amount must be a positive number.");
      return false;
    }
    const today = new Date().setHours(0, 0, 0, 0);
    const selectedDate = new Date(newSavingGoal.targetDate).setHours(
      0,
      0,
      0,
      0
    );
    if (selectedDate < today) {
      setCreateError("Target date must be today or in the future.");
      return false;
    }
    return true;
  };

  const handleCreateSavingGoal = async () => {
    if (!validateCreateGoal()) return;

    try {
      const response = await axios.post(
        "http://localhost:3000/api/saving",
        newSavingGoal,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth")}`,
          },
        }
      );

      setSavingData(response.data.data);
      setIsCreateModalOpen(false);
      setNoSavingGoal(false);
      setCreateError(null);
      window.location.reload();
    } catch (err) {
      if (err instanceof Error) setCreateError(err.message);
    }
  };
  const handleEditClick = () => {
    setEditSavingGoal({
      goalName: savingData.goalName,
      targetAmount: savingData.targetAmount,
      targetDate: savingData.targetDate.split("T")[0], // Format date for input
    });
    setIsEditModalOpen(true);
  };
  const validateEditGoal = () => {
    if (editSavingGoal.targetAmount <= 0) {
      setEditError("Target amount must be a positive number.");
      return false;
    }
    const today = new Date().setHours(0, 0, 0, 0);
    const selectedDate = new Date(editSavingGoal.targetDate).setHours(
      0,
      0,
      0,
      0
    );
    if (selectedDate < today) {
      setEditError("Target date must be today or in the future.");
      return false;
    }
    return true;
  };
  const handleEditSavingGoal = async () => {
    if (!validateEditGoal()) return;

    try {
      const response = await axios.put(
        "http://localhost:3000/api/saving",
        editSavingGoal,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth")}`,
          },
        }
      );

      setSavingData(response.data.data);
      setIsEditModalOpen(false);
      setEditError(null);
      window.location.reload();
    } catch (err) {
      if (err instanceof Error) setEditError(err.message);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const { goalName, targetAmount, currentAmount, targetDate } = savingData;

  const progressPercentage = Math.min(
    (currentAmount / targetAmount) * 100,
    100
  );

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        {noSavingGoal ? (
          <div className="text-center  min-h-screen">
            <h2 className="text-5xl font-bold">Set Saving Goal</h2>
            <div className=" justify-center mt-2 text-lg ">
              Start by creating a saving goal to manage your savings
              effectively.
              <Button size="sm" onClick={handleCreateClick} className="ml-4">
                Create Saving Goal
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-8 ">
              <h1 className="text-3xl font-bold mb-4">
                Saving Goal: {goalName.toUpperCase()}
              </h1>

              <div className="flex justify-center space-x-4">
                <Button variant="outline" onClick={handleEditClick}>
                  Edit
                </Button>
                <Button
                  variant="outline"
                  onClick={handleAddMoneyClick}
                  disabled={goalState}
                >
                  Add Money
                </Button>
                <Button variant="outline" onClick={handleWithdrawClick}>
                  Withdraw
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDeleteClick}
                  className="text-red-500"
                >
                  Delete
                </Button>
                <SavingToggle />
              </div>
            </div>

            <div className="text-center mb-8 flex md:flex-row justify-center items-start md:items-center space-y-8 md:space-y-0 md:space-x-8 ">
              <div className="w-full ">
                <p className="text-gray-600">You have reached</p>
                <p
                  className={`text-6xl font-bold mb-2 ${
                    progressPercentage >= 100 ? "text-yellow-500" : "text-black"
                  }`}
                >
                  ${currentAmount.toFixed(2)}
                </p>
                <p className="text-gray-600">
                  of your ${targetAmount.toFixed(2)} saving goal <br /> due{" "}
                  {new Date(targetDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <Separator className="my-4" />
                <div className="mb-4">
                  <Progress
                    value={progressPercentage}
                    className={`w-1/2 mx-auto ${
                      progressPercentage >= 100
                        ? "[&>*]:bg-yellow-500"
                        : "[&>*]:bg-green-500"
                    } bg-gray-200`}
                  />
                  <p
                    className={` font-bold mt-2 ${
                      progressPercentage >= 100
                        ? "text-yellow-500"
                        : "text-black"
                    }`}
                  >
                    {progressPercentage === 100
                      ? "Congratulations! You have achieved your goal"
                      : `${progressPercentage.toFixed(0)}%`}
                  </p>
                </div>
              </div>
            </div>

            <GoalTransactionlist />
          </>
        )}
      </main>

      {/* Withdraw Money Modal */}
      <Dialog open={isWithdrawModalOpen} onOpenChange={setIsWithdrawModalOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Withdraw Money</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 ">
            {withdrawError && <ErrorMessage message={withdrawError} />}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Amount to Withdraw
              </label>
              <Input
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                min="0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setIsWithdrawModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleWithdraw}>Withdraw</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Money to Saving Modal */}
      <Dialog open={isAddMoneyModalOpen} onOpenChange={setIsAddMoneyModalOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Add Money to Saving</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 ">
            {addMoneyError && <ErrorMessage message={addMoneyError} />}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Amount to Add
              </label>
              <Input
                value={addMoneyAmount}
                onChange={(e) => setAddMoneyAmount(Number(e.target.value))}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                min="0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setIsAddMoneyModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddMoney}>Add Money</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Saving Goal Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Delete Saving Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {deleteError && <ErrorMessage message={deleteError} />}
            <p>
              Are you sure you want to delete this saving goal? This action
              cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Saving Goal Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Create Saving Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {createError && <ErrorMessage message={createError} />}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Goal Name
              </label>
              <Input
                value={newSavingGoal.goalName}
                onChange={(e) =>
                  setNewSavingGoal((prev) => ({
                    ...prev,
                    goalName: e.target.value,
                  }))
                }
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Target Amount
              </label>
              <Input
                value={newSavingGoal.targetAmount}
                onChange={(e) =>
                  setNewSavingGoal((prev) => ({
                    ...prev,
                    targetAmount: Number(e.target.value),
                  }))
                }
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Target Date
              </label>
              <Input
                type="date"
                value={newSavingGoal.targetDate}
                onChange={(e) =>
                  setNewSavingGoal((prev) => ({
                    ...prev,
                    targetDate: e.target.value,
                  }))
                }
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateSavingGoal}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Edit Saving Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {editError && <ErrorMessage message={editError} />}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Goal Name
              </label>
              <Input
                value={editSavingGoal.goalName}
                onChange={(e) =>
                  setEditSavingGoal((prev) => ({
                    ...prev,
                    goalName: e.target.value,
                  }))
                }
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Target Amount
              </label>
              <Input
                value={editSavingGoal.targetAmount}
                onChange={(e) =>
                  setEditSavingGoal((prev) => ({
                    ...prev,
                    targetAmount: Number(e.target.value),
                  }))
                }
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Target Date
              </label>
              <Input
                type="date"
                value={editSavingGoal.targetDate}
                onChange={(e) =>
                  setEditSavingGoal((prev) => ({
                    ...prev,
                    targetDate: e.target.value,
                  }))
                }
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditSavingGoal}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
