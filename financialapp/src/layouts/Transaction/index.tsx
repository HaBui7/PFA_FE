import TransactionList from "@/components/ui/forTransaction/transactionlist";
import { PieTransaction } from "@/components/ui/forTransaction/pie-transaction";
import { PieTotal } from "@/components/ui/forTransaction/pie-total";
const TransactionPage = () => {
  return (
    <div className="min-h-screen">
      <div className="flex flex-col items-center py-10 ">
        <div className="text-center">
          <h1 className="text-3xl font-bold ">Transactions Tracking</h1>
        </div>
      </div>
      <div className="flex justify-center space-x-2">
        <div className="flex-1 flex justify-center pl-4">
          <PieTransaction />
        </div>
        <div className="flex-1 flex justify-center pr-4">
          <PieTotal />
        </div>
      </div>

      <div className="flex flex-col items-center w-6/12 "></div>
      <TransactionList></TransactionList>
    </div>
  );
};

export default TransactionPage;
