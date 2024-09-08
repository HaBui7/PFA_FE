import { useEffect, useState } from "react";
import { Switch } from "../switch";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function SavingToggle() {
  const [isAutoSavingEnabled, setIsAutoSavingEnabled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savingPercentage, setSavingPercentage] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the initial state of the toggle
    const fetchSavingData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/saving", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth")}`,
          },
        });
        const data = response.data.data;
        setIsAutoSavingEnabled(data.isAutoSavingEnabled);
        setSavingPercentage(data.autoSavingPercentage);
      } catch (err) {
        setError("Failed to fetch saving data.");
      }
    };

    fetchSavingData();
  }, []);

  const handleSwitchToggle = () => {
    if (isAutoSavingEnabled) {
      // If already enabled, open modal to allow modification
      setIsModalOpen(true);
    } else {
      // If currently disabled, open modal to enable and set percentage
      setIsModalOpen(true);
    }
  };

  const handleSavePercentage = async () => {
    if (inputValue === null || inputValue < 1 || inputValue > 100) {
      setError("Please enter a valid percentage between 1 and 100.");
      return;
    }

    try {
      const response = await axios.patch(
        "http://localhost:3000/api/saving/toggle-automatic",
        {
          isAutoSavingEnabled: true,
          autoSavingPercentage: inputValue,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth")}`,
          },
        }
      );

      setSavingPercentage(response.data.autoSavingPercentage);
      setIsAutoSavingEnabled(true);
      setIsModalOpen(false);
      setError(null);
    } catch (err) {
      setError("Failed to update the automatic saving settings.");
    }
  };

  const handleDisableAutoSaving = async () => {
    try {
      await axios.patch(
        "http://localhost:3000/api/saving/toggle-automatic",
        {
          isAutoSavingEnabled: false,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth")}`,
          },
        }
      );

      setIsAutoSavingEnabled(false);
      setSavingPercentage(null);
      setIsModalOpen(false);
      setError(null);
    } catch (err) {
      setError("Failed to disable automatic saving.");
    }
  };

  return (
    <div className="flex flex-row items-center relative">
      <div className="flex items-center">
        <div className="flex flex-col">
          <span className="font-semibold text-amber-600">Automatic Saving</span>{" "}
          {savingPercentage !== null && isAutoSavingEnabled && (
            <span className="ml-2 text-sm text-gray-500">
              Percentage: {savingPercentage}%
            </span>
          )}
        </div>
        <Switch
          checked={isAutoSavingEnabled}
          onCheckedChange={handleSwitchToggle}
          className="ml-2"
        />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="absolute top-0 right-0 -mt-1 -mr-4">
              <Info size={16} />
            </TooltipTrigger>
            <TooltipContent
              side="top"
              align="center"
              className="bg-white border-2 border-black"
            >
              <p className="text-md">
                When this is turned on, a percentage of every income you add
                will automatically go to this saving goal.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Modal for Percentage Input */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>
              {isAutoSavingEnabled
                ? "Modify Saving Percentage"
                : "Set Saving Percentage"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {error && <p className="text-red-500">{error}</p>}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Percentage (%)
              </label>
              <Input
                type="number"
                value={inputValue !== null ? inputValue : ""}
                onChange={(e) => setInputValue(Number(e.target.value))}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                min="1"
                max="100"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePercentage}>
              {isAutoSavingEnabled ? "Save Changes" : "Enable Auto Saving"}
            </Button>
            {isAutoSavingEnabled && (
              <Button variant="destructive" onClick={handleDisableAutoSaving}>
                Turn Off Auto Saving
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
