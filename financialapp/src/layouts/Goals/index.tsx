import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import { Separator } from "@/components/ui/separator";
import transactionData from "@/sample_data/transaction_data.json"; // Importing the JSON data

export default function SavingGoalPage() {
  // Calculate the total current amount (net income minus expenses)
  let currentAmount = transactionData.reduce((total, transaction) => {
    return total + transaction.amount;
  }, 0);

  if (currentAmount < 0) currentAmount = 0;
  const targetAmount = 500; // You can set this target dynamically as needed
  let progressPercentage = (currentAmount / targetAmount) * 100;

  // Ensure progressPercentage is at least 0 and at most 100
  if (progressPercentage < 0) progressPercentage = 0;
  if (progressPercentage > 100) progressPercentage = 100;

  const Header = () => {
    return (
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Saving Goal</h1>
        <div className="flex justify-center space-x-4">
          <Button variant="outline">Edit</Button>
          <Button variant="outline">Change</Button>
          <Button variant="outline">Add</Button>
        </div>
      </div>
    );
  };

  const GoalProgress = () => {
    const progressBarColor =
      progressPercentage >= 100 ? "[&>*]:bg-yellow-500" : "[&>*]:bg-green-500";

    return (
      <div className="text-center mb-8 flex md:flex-row justify-center items-start md:items-center space-y-8 md:space-y-0 md:space-x-8 ">
        <div className="w-full ">
          <p className="text-gray-600">You have reached</p>
          <p className="text-6xl font-bold mb-2">${currentAmount.toFixed(2)}</p>
          <p className="text-gray-600">
            of your ${targetAmount.toFixed(2)} saving goal <br /> due Jul 28,
            2024
          </p>
          <Separator className="my-4" />
          <div className="mb-4">
            <p className="text-lg font-bold mb-2">BUYING HOUSE</p>
            <Progress
              value={progressPercentage}
              className={`w-1/2 mx-auto ${progressBarColor} bg-gray-200`}
            />
            <p className="text-gray-600 mt-2">
              {progressPercentage === 100
                ? "Congratulations! You have achieved your goal"
                : `${progressPercentage.toFixed(0)}%`}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // const TransactionList = () => {
  //   return (
  //     <div className="space-y-4 flex flex-col">
  //       {transactionData.map((transaction, index) => (
  //         <Card key={index}>
  //           <CardContent className="flex justify-between py-2 ">
  //             <div className="">
  //               <p className="font-bold ">{transaction.name}</p>
  //               <p className="text-gray-600 text-sm">
  //                 {new Date(transaction.date).toDateString()}
  //               </p>
  //             </div>
  //             <p
  //               className={`font-bold ${
  //                 transaction.type === "income"
  //                   ? "text-green-500"
  //                   : "text-red-500"
  //               }`}
  //             >
  //               {transaction.type === "income" ? "+" : "-"}$
  //               {Math.abs(transaction.amount).toFixed(2)}
  //             </p>
  //           </CardContent>
  //         </Card>
  //       ))}
  //     </div>
  //   );
  // };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <Header />
        <GoalProgress />
        {/* <TransactionList /> */}
      </main>
    </div>
  );
}
