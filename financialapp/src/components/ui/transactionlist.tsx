import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Transaction from "@/sample_data/transaction_data.json";
import { Pencil } from "lucide-react";
import { Trash2 } from "lucide-react";
import PaginatePage from "./paginate";
const Transactionlist = () => {
  return (
    <div className="space-y-4 m-auto flex flex-col w-8/12">
      {Transaction.map((transaction, index) => (
        <Card key={index}>
          <CardContent className="flex justify-between pt-6 ">
            <div className="">
              <p className="font-bold  ">{transaction.name}</p>
              <p className="text-gray-600 text-sm">
                {new Date(transaction.date).toDateString()}
              </p>
            </div>
            <p
              className={`font-bold  ${
                transaction.type === "income"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {transaction.type === "income" ? "+" : "-"}$
              {Math.abs(transaction.amount).toFixed(2)}
            </p>
            <div>
              <button className="pr-5">
                <Pencil />
              </button>
              <button>
                <Trash2 />
              </button>
            </div>
          </CardContent>
        </Card>
      ))}
      <div className="flex flex-col items-center">
        <PaginatePage />
      </div>
    </div>
  );
};
export default Transactionlist;
