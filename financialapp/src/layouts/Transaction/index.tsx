import TransactionList from "@/components/ui/forTransaction/transactionlist";
import { PieTransaction } from "@/components/ui/forTransaction/pie-transaction";
import { PieTotal } from "@/components/ui/forTransaction/pie-total";
const TransactionPage = () => {
  return (
    <div>
      <div className="flex flex-col items-center py-10">
        <div className="text-center">
          <span className="font-bold text-2xl">Welcome back,</span>{" "}
          <span>RMIT</span>
        </div>

        <p className="py-5">Welcome back !</p>
      </div>
      <div className="flex justify-center space-x-2">
        <div className="flex-1 flex justify-center pl-4">
          <PieTransaction />
        </div>
        <div className="flex-1 flex justify-center pr-4">
          <PieTotal />
        </div>
      </div>

      <div className="pt-10 pb-10 flex flex-col items-center w-6/12 mx-auto"></div>
      <TransactionList></TransactionList>
    </div>
  );
};

export default TransactionPage;
